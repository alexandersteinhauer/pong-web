use anyhow::Result;
use pong::Game;
use rand::Rng;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::Mutex;
use tokio::sync::mpsc;
use wtransport::Connection;
use wtransport::Endpoint;
use wtransport::Identity;
use wtransport::ServerConfig;

const TICK_RATE: f64 = 60.0;
const TICK_DURATION: Duration = Duration::from_nanos((1_000_000_000.0 / TICK_RATE) as u64);
const COUNTDOWN_SECONDS: u8 = 5;

// Server -> Client messages (reliable stream)
const MSG_ASSIGN_LEFT: u8 = 0;
const MSG_ASSIGN_RIGHT: u8 = 1;
const MSG_OPPONENT_LEFT: u8 = 3;
const MSG_ROOM_CODE: u8 = 4;
const MSG_JOIN_FAILED: u8 = 5;
const MSG_COUNTDOWN: u8 = 6;
const MSG_GAME_OVER: u8 = 7;
const MSG_WAITING: u8 = 8;

// Server -> Client messages (datagram - game state only)
const MSG_STATE: u8 = 2;

struct Room {
    creator: Connection,
}

type RoomManager = Arc<Mutex<HashMap<String, Room>>>;

fn generate_room_code() -> String {
    const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let mut rng = rand::rng();
    (0..6)
        .map(|_| {
            let idx = rng.random_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

#[tokio::main]
async fn main() -> Result<()> {
    let identity = Identity::load_pemfiles("../cert/cert.pem", "../cert/key.pem").await?;

    let config = ServerConfig::builder()
        .with_bind_default(4433)
        .with_identity(identity)
        .build();

    let server = Endpoint::server(config)?;
    println!("Server listening on 0.0.0.0:4433...");

    let rooms: RoomManager = Arc::new(Mutex::new(HashMap::new()));

    loop {
        let incoming_session = server.accept().await;
        let rooms = rooms.clone();

        tokio::spawn(async move {
            match incoming_session.await {
                Ok(request) => {
                    let path = request.path().to_string();
                    println!("New session request: path={}", path);

                    match request.accept().await {
                        Ok(connection) => {
                            println!("Player connected from {:?}", connection.remote_address());
                            handle_connection(connection, path, rooms).await;
                        }
                        Err(e) => eprintln!("Failed to accept connection: {:?}", e),
                    }
                }
                Err(e) => eprintln!("Incoming session error: {:?}", e),
            }
        });
    }
}

async fn handle_connection(conn: Connection, path: String, rooms: RoomManager) {
    if path == "/create" {
        handle_create_room(conn, rooms).await;
    } else if path.starts_with("/join/") {
        let code = path.strip_prefix("/join/").unwrap_or("").to_uppercase();
        handle_join_room(conn, code, rooms).await;
    } else {
        eprintln!("Unknown path: {}", path);
    }
}

/// Send a reliable message over a unidirectional stream
async fn send_reliable(conn: &Connection, msg: &[u8]) -> bool {
    let stream = match conn.open_uni().await {
        Ok(opening) => match opening.await {
            Ok(s) => s,
            Err(_) => return false,
        },
        Err(_) => return false,
    };

    let mut stream = stream;
    // Write length prefix (2 bytes) + message
    let len = msg.len() as u16;
    let mut buf = Vec::with_capacity(2 + msg.len());
    buf.extend_from_slice(&len.to_le_bytes());
    buf.extend_from_slice(msg);
    if stream.write_all(&buf).await.is_err() {
        return false;
    }
    let _ = stream.finish().await;
    true
}

async fn handle_create_room(conn: Connection, rooms: RoomManager) {
    let code = generate_room_code();

    // Send room code to creator (reliable)
    let mut msg = vec![MSG_ROOM_CODE];
    msg.extend_from_slice(code.as_bytes());
    if !send_reliable(&conn, &msg).await {
        eprintln!("Failed to send room code");
        return;
    }

    // Send waiting status (reliable)
    if !send_reliable(&conn, &[MSG_WAITING]).await {
        eprintln!("Failed to send waiting status");
        return;
    }

    println!("Room {} created, waiting for opponent...", code);

    let room = Room { creator: conn };
    rooms.lock().await.insert(code.clone(), room);
}

async fn handle_join_room(conn: Connection, code: String, rooms: RoomManager) {
    let room = rooms.lock().await.remove(&code);

    match room {
        Some(room) => {
            println!("Player joined room {}, starting match...", code);
            run_match(room.creator, conn).await;
        }
        None => {
            println!("Room {} not found", code);
            send_reliable(&conn, &[MSG_JOIN_FAILED]).await;
        }
    }
}

struct PlayerConnection {
    conn: Arc<Connection>,
    reliable_tx: mpsc::Sender<Vec<u8>>,
}

impl PlayerConnection {
    fn new(conn: Arc<Connection>) -> Self {
        let (reliable_tx, mut reliable_rx) = mpsc::channel::<Vec<u8>>(32);

        // Spawn a task to send reliable messages sequentially
        let conn_clone = conn.clone();
        tokio::spawn(async move {
            while let Some(msg) = reliable_rx.recv().await {
                if let Ok(opening) = conn_clone.open_uni().await {
                    if let Ok(mut stream) = opening.await {
                        let len = msg.len() as u16;
                        let mut buf = Vec::with_capacity(2 + msg.len());
                        buf.extend_from_slice(&len.to_le_bytes());
                        buf.extend_from_slice(&msg);
                        let _ = stream.write_all(&buf).await;
                        let _ = stream.finish().await;
                    }
                }
            }
        });

        Self { conn, reliable_tx }
    }

    async fn send_reliable(&self, msg: Vec<u8>) -> bool {
        self.reliable_tx.send(msg).await.is_ok()
    }

    fn send_datagram(&self, msg: &[u8]) -> bool {
        self.conn.send_datagram(msg).is_ok()
    }
}

async fn run_match(left_conn: Connection, right_conn: Connection) {
    let left = PlayerConnection::new(Arc::new(left_conn));
    let right = PlayerConnection::new(Arc::new(right_conn));

    // Assign sides (reliable)
    if !left.send_reliable(vec![MSG_ASSIGN_LEFT]).await {
        println!("Left player disconnected before game start");
        let _ = right.send_reliable(vec![MSG_OPPONENT_LEFT]).await;
        return;
    }
    if !right.send_reliable(vec![MSG_ASSIGN_RIGHT]).await {
        println!("Right player disconnected before game start");
        let _ = left.send_reliable(vec![MSG_OPPONENT_LEFT]).await;
        return;
    }

    // Countdown (reliable)
    for i in (1..=COUNTDOWN_SECONDS).rev() {
        let msg = vec![MSG_COUNTDOWN, i];
        if !left.send_reliable(msg.clone()).await || !right.send_reliable(msg).await {
            println!("Player disconnected during countdown");
            return;
        }
        tokio::time::sleep(Duration::from_secs(1)).await;
    }

    // Start signal - countdown 0 (reliable)
    let start_msg = vec![MSG_COUNTDOWN, 0];
    if !left.send_reliable(start_msg.clone()).await || !right.send_reliable(start_msg).await {
        println!("Player disconnected at game start");
        return;
    }

    let (left_input_tx, mut left_input_rx) = mpsc::channel::<i8>(16);
    let (right_input_tx, mut right_input_rx) = mpsc::channel::<i8>(16);
    let (disconnect_tx, mut disconnect_rx) = mpsc::channel::<&str>(2);

    // Read input datagrams from left player
    let left_reader = left.conn.clone();
    let disconnect_tx_left = disconnect_tx.clone();
    tokio::spawn(async move {
        loop {
            match left_reader.receive_datagram().await {
                Ok(data) if !data.is_empty() => {
                    let input = data[0] as i8;
                    let _ = left_input_tx.send(input).await;
                }
                _ => {
                    let _ = disconnect_tx_left.send("left").await;
                    break;
                }
            }
        }
    });

    // Read input datagrams from right player
    let right_reader = right.conn.clone();
    let disconnect_tx_right = disconnect_tx.clone();
    tokio::spawn(async move {
        loop {
            match right_reader.receive_datagram().await {
                Ok(data) if !data.is_empty() => {
                    let input = data[0] as i8;
                    let _ = right_input_tx.send(input).await;
                }
                _ => {
                    let _ = disconnect_tx_right.send("right").await;
                    break;
                }
            }
        }
    });

    let mut game = Game::new();
    let mut last_tick = Instant::now();

    loop {
        tokio::select! {
            Some(who) = disconnect_rx.recv() => {
                println!("{} player disconnected", who);
                if who == "left" {
                    let _ = right.send_reliable(vec![MSG_OPPONENT_LEFT]).await;
                } else {
                    let _ = left.send_reliable(vec![MSG_OPPONENT_LEFT]).await;
                }
                break;
            }
            _ = tokio::time::sleep(TICK_DURATION.saturating_sub(last_tick.elapsed())) => {
                let dt = last_tick.elapsed().as_secs_f64();
                last_tick = Instant::now();

                while let Ok(input) = left_input_rx.try_recv() {
                    game.left_paddle_input = input as f64;
                }
                while let Ok(input) = right_input_rx.try_recv() {
                    game.right_paddle_input = input as f64;
                }

                game.update(dt);

                // Check for game over (send reliably)
                if game.is_game_over() {
                    let winner = game.winner();
                    let game_over_msg = vec![MSG_GAME_OVER, winner as u8];
                    let _ = left.send_reliable(game_over_msg.clone()).await;
                    let _ = right.send_reliable(game_over_msg).await;
                    println!("Game over! Winner: {}", if winner == 0 { "left" } else { "right" });
                    break;
                }

                // Send game state via datagram (unreliable, fast)
                let state = encode_state(&game);
                if !left.send_datagram(&state) || !right.send_datagram(&state) {
                    break;
                }
            }
        }
    }

    println!("Match ended");
}

fn encode_state(game: &Game) -> Vec<u8> {
    let mut buf = Vec::with_capacity(35);
    buf.push(MSG_STATE);
    buf.extend_from_slice(&game.ball_x.to_le_bytes());
    buf.extend_from_slice(&game.ball_y.to_le_bytes());
    buf.extend_from_slice(&game.left_paddle_y.to_le_bytes());
    buf.extend_from_slice(&game.right_paddle_y.to_le_bytes());
    buf.push(game.left_score as u8);
    buf.push(game.right_score as u8);
    buf
}
