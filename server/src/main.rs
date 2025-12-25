use anyhow::Result;
use pong::Game;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::mpsc;
use tokio::sync::Mutex;
use wtransport::Connection;
use wtransport::Endpoint;
use wtransport::Identity;
use wtransport::ServerConfig;

const TICK_RATE: f64 = 60.0;
const TICK_DURATION: Duration = Duration::from_nanos((1_000_000_000.0 / TICK_RATE) as u64);

const MSG_ASSIGN_LEFT: u8 = 0;
const MSG_ASSIGN_RIGHT: u8 = 1;
const MSG_STATE: u8 = 2;
const MSG_OPPONENT_LEFT: u8 = 3;

type WaitingPlayer = Option<Connection>;

#[tokio::main]
async fn main() -> Result<()> {
    let identity = Identity::load_pemfiles("../cert/cert.pem", "../cert/key.pem").await?;

    let config = ServerConfig::builder()
        .with_bind_default(4433)
        .with_identity(identity)
        .build();

    let server = Endpoint::server(config)?;
    println!("Server listening on 0.0.0.0:4433...");

    let waiting: Arc<Mutex<WaitingPlayer>> = Arc::new(Mutex::new(None));

    loop {
        let incoming_session = server.accept().await;
        let waiting = waiting.clone();

        tokio::spawn(async move {
            match incoming_session.await {
                Ok(request) => {
                    println!("New session request: path={}", request.path());
                    match request.accept().await {
                        Ok(connection) => {
                            println!("Player connected from {:?}", connection.remote_address());
                            handle_new_player(connection, waiting).await;
                        }
                        Err(e) => eprintln!("Failed to accept connection: {:?}", e),
                    }
                }
                Err(e) => eprintln!("Incoming session error: {:?}", e),
            }
        });
    }
}

async fn handle_new_player(conn: Connection, waiting: Arc<Mutex<WaitingPlayer>>) {
    let mut queue = waiting.lock().await;

    if let Some(opponent) = queue.take() {
        drop(queue);
        println!("Match found! Starting game...");
        run_match(opponent, conn).await;
    } else {
        *queue = Some(conn);
        println!("Player waiting for opponent...");
    }
}

async fn run_match(left_conn: Connection, right_conn: Connection) {
    let left = Arc::new(left_conn);
    let right = Arc::new(right_conn);

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
