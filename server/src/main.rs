use anyhow::Result;
use pong::Game;
use prost::Message;
use rand::Rng;
use std::collections::HashMap;
use std::env;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::io::AsyncReadExt;
use tokio::sync::Mutex;
use tokio::sync::mpsc;
use wtransport::Connection;
use wtransport::Endpoint;
use wtransport::Identity;
use wtransport::ServerConfig;

// Include generated protobuf code
pub mod proto {
    include!(concat!(env!("OUT_DIR"), "/pong.rs"));
}

use proto::*;

const TICK_RATE: f64 = 60.0;
const TICK_DURATION: Duration = Duration::from_nanos((1_000_000_000.0 / TICK_RATE) as u64);
const COUNTDOWN_SECONDS: u32 = 5;

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
    let cert_path = env::var("TLS_CERT").unwrap_or_else(|_| "../cert/cert.pem".to_string());
    let key_path = env::var("TLS_KEY").unwrap_or_else(|_| "../cert/key.pem".to_string());
    let identity = Identity::load_pemfiles(&cert_path, &key_path).await?;

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
async fn send_reliable(conn: &Connection, msg: &ServerMessage) -> bool {
    let stream = match conn.open_uni().await {
        Ok(opening) => match opening.await {
            Ok(s) => s,
            Err(_) => return false,
        },
        Err(_) => return false,
    };

    let mut stream = stream;
    let encoded = msg.encode_to_vec();
    // Write length prefix (2 bytes) + message
    let len = encoded.len() as u16;
    let mut buf = Vec::with_capacity(2 + encoded.len());
    buf.extend_from_slice(&len.to_le_bytes());
    buf.extend_from_slice(&encoded);
    if stream.write_all(&buf).await.is_err() {
        return false;
    }
    let _ = stream.finish().await;
    true
}

async fn handle_create_room(conn: Connection, rooms: RoomManager) {
    let code = generate_room_code();

    // Send room code to creator (reliable)
    let msg = ServerMessage {
        payload: Some(server_message::Payload::RoomCode(RoomCode {
            code: code.clone(),
        })),
    };
    if !send_reliable(&conn, &msg).await {
        eprintln!("Failed to send room code");
        return;
    }

    // Send waiting status (reliable)
    let msg = ServerMessage {
        payload: Some(server_message::Payload::Waiting(Waiting {})),
    };
    if !send_reliable(&conn, &msg).await {
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
            let msg = ServerMessage {
                payload: Some(server_message::Payload::JoinFailed(JoinFailed {})),
            };
            send_reliable(&conn, &msg).await;
        }
    }
}

struct PlayerConnection {
    conn: Arc<Connection>,
    reliable_tx: mpsc::Sender<ServerMessage>,
    client_msg_rx: mpsc::Receiver<ClientMessage>,
}

impl PlayerConnection {
    fn new(conn: Arc<Connection>) -> Self {
        let (reliable_tx, mut reliable_rx) = mpsc::channel::<ServerMessage>(32);
        let (client_msg_tx, client_msg_rx) = mpsc::channel::<ClientMessage>(32);

        // Spawn a task to send reliable messages sequentially
        let conn_clone = conn.clone();
        tokio::spawn(async move {
            while let Some(msg) = reliable_rx.recv().await {
                if let Ok(opening) = conn_clone.open_uni().await {
                    if let Ok(mut stream) = opening.await {
                        let encoded = msg.encode_to_vec();
                        let len = encoded.len() as u16;
                        let mut buf = Vec::with_capacity(2 + encoded.len());
                        buf.extend_from_slice(&len.to_le_bytes());
                        buf.extend_from_slice(&encoded);
                        let _ = stream.write_all(&buf).await;
                        let _ = stream.finish().await;
                    }
                }
            }
        });

        // Spawn a task to receive reliable messages (streams opened by client)
        let conn_clone_recv = conn.clone();
        tokio::spawn(async move {
            loop {
                match conn_clone_recv.accept_uni().await {
                    Ok(stream) => {
                        let mut stream = stream;
                        // Read all bytes
                        let mut buf = Vec::new();
                        if stream.read_to_end(&mut buf).await.is_ok() {
                            // Parse: 2 bytes length prefix + message
                            if buf.len() >= 2 {
                                let len = u16::from_le_bytes([buf[0], buf[1]]) as usize;
                                if buf.len() >= 2 + len {
                                    let msg_buf = &buf[2..2 + len];
                                    if let Ok(msg) = ClientMessage::decode(msg_buf) {
                                        let _ = client_msg_tx.send(msg).await;
                                    }
                                }
                            }
                        }
                    }
                    Err(_) => break, // Connection closed
                }
            }
        });

        Self {
            conn,
            reliable_tx,
            client_msg_rx,
        }
    }

    async fn send_reliable(&self, msg: ServerMessage) -> bool {
        self.reliable_tx.send(msg).await.is_ok()
    }

    fn send_datagram(&self, msg: &[u8]) -> bool {
        self.conn.send_datagram(msg).is_ok()
    }
}

async fn run_match(left_conn: Connection, right_conn: Connection) {
    let mut left = PlayerConnection::new(Arc::new(left_conn));
    let mut right = PlayerConnection::new(Arc::new(right_conn));

    let (left_input_tx, mut left_input_rx) = mpsc::channel::<i32>(16);
    let (right_input_tx, mut right_input_rx) = mpsc::channel::<i32>(16);
    let (disconnect_tx, mut disconnect_rx) = mpsc::channel::<&str>(2);

    // Read input datagrams from left player
    let left_reader = left.conn.clone();
    let disconnect_tx_left = disconnect_tx.clone();
    tokio::spawn(async move {
        loop {
            match left_reader.receive_datagram().await {
                Ok(data) if !data.is_empty() => {
                    if let Ok(input) = PlayerInput::decode(&data[..]) {
                        let _ = left_input_tx.send(input.direction).await;
                    }
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
                    if let Ok(input) = PlayerInput::decode(&data[..]) {
                        let _ = right_input_tx.send(input.direction).await;
                    }
                }
                _ => {
                    let _ = disconnect_tx_right.send("right").await;
                    break;
                }
            }
        }
    });

    loop {
        // Drain any stale inputs from previous games
        while left_input_rx.try_recv().is_ok() {}
        while right_input_rx.try_recv().is_ok() {}

        // Assign sides (reliable)
        let left_msg = ServerMessage {
            payload: Some(server_message::Payload::AssignSide(AssignSide {
                side: Side::Left as i32,
            })),
        };
        if !left.send_reliable(left_msg).await {
            println!("Left player disconnected before game start");
            notify_opponent_left(&right).await;
            return;
        }

        let right_msg = ServerMessage {
            payload: Some(server_message::Payload::AssignSide(AssignSide {
                side: Side::Right as i32,
            })),
        };
        if !right.send_reliable(right_msg).await {
            println!("Right player disconnected before game start");
            notify_opponent_left(&left).await;
            return;
        }

        // Countdown (reliable)
        let mut countdown_aborted = false;
        for i in (1..=COUNTDOWN_SECONDS).rev() {
            let msg = ServerMessage {
                payload: Some(server_message::Payload::Countdown(Countdown { seconds: i })),
            };
            if !left.send_reliable(msg.clone()).await || !right.send_reliable(msg).await {
                println!("Player disconnected during countdown");
                countdown_aborted = true;
                break;
            }
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
        if countdown_aborted {
            return;
        }

        // Start signal - countdown 0 (reliable)
        let start_msg = ServerMessage {
            payload: Some(server_message::Payload::Countdown(Countdown { seconds: 0 })),
        };
        if !left.send_reliable(start_msg.clone()).await || !right.send_reliable(start_msg).await {
            println!("Player disconnected at game start");
            return;
        }

        let mut game = Game::new();
        let mut last_tick = Instant::now();

        loop {
            tokio::select! {
                Some(who) = disconnect_rx.recv() => {
                    println!("{} player disconnected", who);
                    if who == "left" {
                        notify_opponent_left(&right).await;
                    } else {
                        notify_opponent_left(&left).await;
                    }
                    return; // End session
                }
                _ = tokio::time::sleep(TICK_DURATION.saturating_sub(last_tick.elapsed())) => {
                    let dt = last_tick.elapsed().as_secs_f64();
                    last_tick = Instant::now();

                    while let Ok(input) = left_input_rx.try_recv() {
                        if input == 2 {
                            game.launch_ball(0);
                        } else {
                            game.left_paddle_input = input as f64;
                        }
                    }
                    while let Ok(input) = right_input_rx.try_recv() {
                        if input == 2 {
                            game.launch_ball(1);
                        } else {
                            game.right_paddle_input = input as f64;
                        }
                    }

                    game.update(dt);

                    // Check for game over (send reliably)
                    if game.is_game_over() {
                        let winner = game.winner();
                        let msg = ServerMessage {
                            payload: Some(server_message::Payload::GameOver(GameOver {
                                winner: if winner == 0 { Side::Left as i32 } else { Side::Right as i32 },
                            })),
                        };
                        let _ = left.send_reliable(msg.clone()).await;
                        let _ = right.send_reliable(msg).await;
                        println!("Game over! Winner: {}", if winner == 0 { "left" } else { "right" });
                        break;
                    }

                    // Send game state via datagram (unreliable, fast)
                    let state = encode_state(&game);
                    if !left.send_datagram(&state) || !right.send_datagram(&state) {
                         // Datagram failure might indicate disconnect, but we rely on other mechanisms or next loop to catch it
                    }
                }
            }
        }

        // Wait for rematch
        println!("Waiting for rematch...");
        let mut left_wants_rematch = false;
        let mut right_wants_rematch = false;

        // Drain any messages that might have come during game (unlikely for rematch, but good practice)
        while left.client_msg_rx.try_recv().is_ok() {}
        while right.client_msg_rx.try_recv().is_ok() {}

        loop {
            tokio::select! {
                Some(who) = disconnect_rx.recv() => {
                    println!("{} player disconnected during rematch wait", who);
                    if who == "left" {
                        notify_opponent_left(&right).await;
                    } else {
                        notify_opponent_left(&left).await;
                    }
                    return;
                }
                Some(msg) = left.client_msg_rx.recv() => {
                    if let Some(client_message::Payload::RematchRequest(_)) = msg.payload {
                         left_wants_rematch = true;
                         println!("Left player requested rematch");
                         // Optional: Notify right player?
                         // Protocol doesn't have "OpponentRequestedRematch" message yet, but "Waiting" might suffice or custom state.
                         // For now, just wait silently until both agree.
                    }
                }
                Some(msg) = right.client_msg_rx.recv() => {
                    if let Some(client_message::Payload::RematchRequest(_)) = msg.payload {
                         right_wants_rematch = true;
                         println!("Right player requested rematch");
                    }
                }
            }

            if left_wants_rematch && right_wants_rematch {
                println!("Both players agreed to rematch. Restarting...");
                break; // Restart loop
            }
        }
    }
}

async fn notify_opponent_left(conn: &PlayerConnection) {
    let msg = ServerMessage {
        payload: Some(server_message::Payload::OpponentLeft(OpponentLeft {})),
    };
    let _ = conn.send_reliable(msg).await;
}

fn encode_state(game: &Game) -> Vec<u8> {
    let state = GameState {
        ball_x: game.ball_x as f32,
        ball_y: game.ball_y as f32,
        left_paddle_y: game.left_paddle_y as f32,
        right_paddle_y: game.right_paddle_y as f32,
        left_score: game.left_score as u32,
        right_score: game.right_score as u32,
        waiting_for_serve: game.waiting_for_serve,
        serving_side: game.serving_side as i32,
    };
    state.encode_to_vec()
}
