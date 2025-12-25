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

// Server -> Client messages
const MSG_ASSIGN_LEFT: u8 = 0;
const MSG_ASSIGN_RIGHT: u8 = 1;
const MSG_STATE: u8 = 2;
const MSG_OPPONENT_LEFT: u8 = 3;
const MSG_ROOM_CODE: u8 = 4;
const MSG_JOIN_FAILED: u8 = 5;
const MSG_COUNTDOWN: u8 = 6;
const MSG_GAME_OVER: u8 = 7;
const MSG_WAITING: u8 = 8;

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

async fn handle_create_room(conn: Connection, rooms: RoomManager) {
    let code = generate_room_code();

    // Send room code to creator
    let mut msg = vec![MSG_ROOM_CODE];
    msg.extend_from_slice(code.as_bytes());
    if conn.send_datagram(&msg).is_err() {
        eprintln!("Failed to send room code");
        return;
    }

    // Send waiting status
    if conn.send_datagram(&[MSG_WAITING]).is_err() {
        eprintln!("Failed to send waiting status");
        return;
    }

    println!("Room {} created, waiting for opponent...", code);

    let room = Room { creator: conn };

    rooms.lock().await.insert(code.clone(), room);

    // Wait for the joiner to start the game (the joiner will remove the room and start the match)
    // The creator just waits - if they disconnect, we need to clean up
    // We'll handle this by having the joiner take ownership

    // Actually, we need to wait here and detect if the creator disconnects
    // Let's use a different approach: store the connection and let join handle it
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
            let _ = conn.send_datagram(&[MSG_JOIN_FAILED]);
        }
    }
}

async fn run_match(left_conn: Connection, right_conn: Connection) {
    let left = Arc::new(left_conn);
    let right = Arc::new(right_conn);

    // Assign sides
    if left.send_datagram(&[MSG_ASSIGN_LEFT]).is_err() {
        println!("Left player disconnected before game start");
        let _ = right.send_datagram(&[MSG_OPPONENT_LEFT]);
        return;
    }
    if right.send_datagram(&[MSG_ASSIGN_RIGHT]).is_err() {
        println!("Right player disconnected before game start");
        let _ = left.send_datagram(&[MSG_OPPONENT_LEFT]);
        return;
    }

    // Countdown
    for i in (1..=COUNTDOWN_SECONDS).rev() {
        let msg = [MSG_COUNTDOWN, i];
        if left.send_datagram(&msg).is_err() || right.send_datagram(&msg).is_err() {
            println!("Player disconnected during countdown");
            return;
        }
        tokio::time::sleep(Duration::from_secs(1)).await;
    }

    // Start signal (countdown 0)
    let start_msg = [MSG_COUNTDOWN, 0];
    if left.send_datagram(&start_msg).is_err() || right.send_datagram(&start_msg).is_err() {
        println!("Player disconnected at game start");
        return;
    }

    let (left_input_tx, mut left_input_rx) = mpsc::channel::<i8>(16);
    let (right_input_tx, mut right_input_rx) = mpsc::channel::<i8>(16);
    let (disconnect_tx, mut disconnect_rx) = mpsc::channel::<&str>(2);

    let left_reader = left.clone();
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

    let right_reader = right.clone();
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
                    let _ = right.send_datagram(&[MSG_OPPONENT_LEFT]);
                } else {
                    let _ = left.send_datagram(&[MSG_OPPONENT_LEFT]);
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

                // Check for game over
                if game.is_game_over() {
                    let winner = game.winner();
                    let game_over_msg = [MSG_GAME_OVER, winner as u8];
                    let _ = left.send_datagram(&game_over_msg);
                    let _ = right.send_datagram(&game_over_msg);
                    println!("Game over! Winner: {}", if winner == 0 { "left" } else { "right" });
                    break;
                }

                let state = encode_state(&game);
                if left.send_datagram(&state).is_err() || right.send_datagram(&state).is_err() {
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
