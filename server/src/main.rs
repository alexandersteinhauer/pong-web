use anyhow::Result;
use wtransport::Connection;
use wtransport::Endpoint;
use wtransport::Identity;
use wtransport::ServerConfig;

#[tokio::main]
async fn main() -> Result<()> {
    let identity = Identity::load_pemfiles("../cert/cert.pem", "../cert/key.pem").await?;

    let config = ServerConfig::builder()
        .with_bind_default(4433)
        .with_identity(identity)
        .build();

    let server = Endpoint::server(config)?;
    println!("Server listening on 0.0.0.0:4433...");

    loop {
        let incoming_session = server.accept().await;
        tokio::spawn(async move {
            match incoming_session.await {
                Ok(request) => {
                    println!(
                        "New session request: path={}, origin={:?}",
                        request.path(),
                        request.origin()
                    );
                    match request.accept().await {
                        Ok(connection) => {
                            println!("Connection accepted from {:?}", connection.remote_address());
                            if let Err(e) = handle_connection(connection).await {
                                eprintln!("Connection dropped: {:?}", e);
                            }
                        }
                        Err(e) => eprintln!("Failed to accept connection: {:?}", e),
                    }
                }
                Err(e) => eprintln!("Incoming session error: {:?}", e),
            }
        });
    }
}

async fn handle_connection(conn: Connection) -> Result<()> {
    loop {
        let dgram = conn.receive_datagram().await?;
        let str_data = std::str::from_utf8(&dgram)?;
        println!("Received datagram: {str_data}");

        // Echo back a response
        let response = format!("Server received: {}", str_data);
        conn.send_datagram(response.as_bytes())?;
        println!("Sent response: {response}");
    }
}
