# Pong Web

A real-time multiplayer Pong game built with Rust, WebAssembly, WebTransport, and SvelteKit.

## 🏗 Architecture

### Shared Game Logic (Rust/WASM)

- The core game engine (`pong/` directory) is written in **Rust**.
- It compiles to **native code** for the authoritative server.
- It compiles to **WebAssembly (WASM)** for the client.
- **Benefit:** Zero logic duplication between client and server. Both run the exact same physics simulation, minimizing desyncs and implementation bugs.

### WebTransport

- The game uses **WebTransport** (via `wtransport` in Rust) for next-generation low-latency bidirectional communication.
- **Datagrams (Unreliable):** Used for high-frequency game state updates (60Hz ball/paddle positions). If a packet is dropped, we don't care; the next one is coming in 16ms.
- **Streams (Reliable):** Used for critical events like joining a room, scoring, and game over states.

### Binary Protocol (Protobuf)

- All network messages are defined in `proto/pong.proto`.
- Uses **Protocol Buffers** for compact binary serialization.
- Client uses `protobufjs`; Server uses `prost`.

## 🛠 Tech Stack

### Frontend (`client/`)

- **Framework:** SvelteKit (Svelte 5)
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4
- **Runtime:** Browser (WASM enabled)
- **Package Manager:** Bun

### Backend (`server/`)

- **Language:** Rust (Edition 2024)
- **Async Runtime:** Tokio
- **Network Library:** `wtransport` (WebTransport)
- **Serialization:** `prost` (Protobuf)

### Shared Logic (`pong/`)

- **Language:** Rust
- **Target:** `wasm32-unknown-unknown` (Client) & `x86_64/aarch64` (Server)
- **Tooling:** `wasm-pack`

## 📂 Project Structure

```
├── client/          # SvelteKit frontend application
│   ├── src/lib/wasm # Compiled WASM artifacts live here
│   └── src/proto    # Generated Protobuf JS/TS bindings
├── server/          # Authoritative Rust game server
├── pong/            # Shared Rust game logic (compiled to WASM & Native)
├── proto/           # Protocol Buffer definitions (.proto)
└── deploy.sh        # Deployment orchestration script
```

## 🚀 Development Setup

### Prerequisites

- **Rust** (latest stable)
- **Bun** (or Node.js)
- **wasm-pack** (`cargo install wasm-pack`)
- **protobuf-compiler** (protoc)

### 1. Build Shared Components

First, build the WASM module and generate Protobuf bindings:

```bash
# Build WASM for the client
cd pong
wasm-pack build --target web --release
cd ..

# Copy WASM artifacts to client
cp pong/pkg/* client/src/lib/wasm/

# Generate Protobuf bindings (requires client deps installed first)
cd client
bun install
bun run proto
cd ..
```

### 2. Run the Server

```bash
cd server
cargo run
```

### 3. Run the Client

```bash
cd client
bun run dev
```

## 🚢 Deployment

The project includes a `deploy.sh` script to manage deployment to a remote server.

```bash
./deploy.sh [command]
```

- `./deploy.sh full` - Full redeploy (client + server + proto)
- `./deploy.sh client` - Redeploy frontend only
- `./deploy.sh server` - Redeploy backend only
- `./deploy.sh wasm` - Rebuild WASM and full redeploy
