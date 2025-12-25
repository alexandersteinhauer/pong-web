// Server -> Client message types (reliable stream)
export const MSG_ASSIGN_LEFT = 0;
export const MSG_ASSIGN_RIGHT = 1;
export const MSG_OPPONENT_LEFT = 3;
export const MSG_ROOM_CODE = 4;
export const MSG_JOIN_FAILED = 5;
export const MSG_COUNTDOWN = 6;
export const MSG_GAME_OVER = 7;
export const MSG_WAITING = 8;

// Server -> Client message types (datagram)
export const MSG_STATE = 2;

export type ConnectionStatus =
  | "connecting"
  | "waiting"
  | "countdown"
  | "playing"
  | "game_over"
  | "opponent_left"
  | "disconnected"
  | "join_failed";

export interface GameState {
  ballX: number;
  ballY: number;
  leftPaddleY: number;
  rightPaddleY: number;
  leftScore: number;
  rightScore: number;
}

export interface TransportCallbacks {
  onStatusChange: (status: ConnectionStatus) => void;
  onRoomCode: (code: string) => void;
  onSideAssigned: (side: "left" | "right") => void;
  onCountdown: (seconds: number) => void;
  onGameState: (state: GameState) => void;
  onGameOver: (winner: number) => void;
}

// Server URL - use environment variable in production
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://localhost:4433";

// Certificate hash for local development only (not needed with real CA certs)
const CERT_HASH = "eode/DS1WZRnplL5G82Oqxyvdx/DoUOy5tbqKz5ee1c=";
const USE_CERT_HASH = SERVER_URL.includes("localhost");

export class PongTransport {
  private transport: WebTransport | null = null;
  private datagramWriter: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private callbacks: TransportCallbacks;
  private running = false;

  constructor(callbacks: TransportCallbacks) {
    this.callbacks = callbacks;
  }

  async createRoom(): Promise<void> {
    await this.connect("/create");
  }

  async joinRoom(code: string): Promise<void> {
    await this.connect(`/join/${code.toUpperCase()}`);
  }

  private async connect(path: string): Promise<void> {
    this.callbacks.onStatusChange("connecting");

    try {
      const url = `${SERVER_URL}${path}`;

      // Only use certificate hash for localhost (self-signed certs)
      // Production uses real CA certs from Let's Encrypt
      const options: WebTransportOptions = USE_CERT_HASH
        ? {
            serverCertificateHashes: [
              {
                algorithm: "sha-256",
                value: Uint8Array.from(atob(CERT_HASH), (c) => c.charCodeAt(0)),
              },
            ],
          }
        : {};

      this.transport = new WebTransport(url, options);

      await this.transport.ready;
      console.log("Connected to server");

      this.datagramWriter = this.transport.datagrams.writable.getWriter();
      this.running = true;

      // Handle transport close
      this.transport.closed
        .then(() => {
          this.callbacks.onStatusChange("disconnected");
          this.running = false;
        })
        .catch(() => {
          this.callbacks.onStatusChange("disconnected");
          this.running = false;
        });

      // Start reading datagrams (game state)
      this.readDatagrams();

      // Start reading reliable streams (control messages)
      this.readStreams();
    } catch (err) {
      console.error("Connection failed:", err);
      this.callbacks.onStatusChange("disconnected");
      throw err;
    }
  }

  private async readDatagrams(): Promise<void> {
    if (!this.transport) return;

    const reader = this.transport.datagrams.readable.getReader();

    try {
      while (this.running) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value || value.length === 0) continue;

        // Only game state comes via datagrams
        if (value[0] === MSG_STATE) {
          this.callbacks.onGameState(this.decodeState(value));
        }
      }
    } catch (err) {
      console.error("Datagram read error:", err);
    } finally {
      reader.releaseLock();
    }
  }

  private async readStreams(): Promise<void> {
    if (!this.transport) return;

    const reader = this.transport.incomingUnidirectionalStreams.getReader();

    try {
      while (this.running) {
        const { value: stream, done } = await reader.read();
        if (done) break;
        if (!stream) continue;

        // Read the stream in a separate task
        this.handleIncomingStream(stream);
      }
    } catch (err) {
      console.error("Stream read error:", err);
    } finally {
      reader.releaseLock();
    }
  }

  private async handleIncomingStream(
    stream: ReadableStream<Uint8Array>,
  ): Promise<void> {
    const streamReader = stream.getReader();
    const chunks: Uint8Array[] = [];

    try {
      while (true) {
        const { value, done } = await streamReader.read();
        if (done) break;
        if (value) chunks.push(value);
      }

      // Combine all chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const data = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        data.set(chunk, offset);
        offset += chunk.length;
      }

      // Parse: 2 bytes length prefix + message
      if (data.length >= 2) {
        const msgData = data.slice(2); // Skip length prefix
        this.handleReliableMessage(msgData);
      }
    } catch (err) {
      console.error("Stream handling error:", err);
    } finally {
      streamReader.releaseLock();
    }
  }

  private handleReliableMessage(data: Uint8Array): void {
    if (data.length === 0) return;

    const msgType = data[0];

    switch (msgType) {
      case MSG_ASSIGN_LEFT:
        this.callbacks.onSideAssigned("left");
        break;

      case MSG_ASSIGN_RIGHT:
        this.callbacks.onSideAssigned("right");
        break;

      case MSG_OPPONENT_LEFT:
        this.callbacks.onStatusChange("opponent_left");
        this.running = false;
        break;

      case MSG_ROOM_CODE: {
        const code = new TextDecoder().decode(data.slice(1));
        this.callbacks.onRoomCode(code);
        break;
      }

      case MSG_JOIN_FAILED:
        this.callbacks.onStatusChange("join_failed");
        this.running = false;
        break;

      case MSG_COUNTDOWN: {
        const seconds = data[1];
        this.callbacks.onCountdown(seconds);
        if (seconds > 0) {
          this.callbacks.onStatusChange("countdown");
        } else {
          this.callbacks.onStatusChange("playing");
        }
        break;
      }

      case MSG_GAME_OVER: {
        const winner = data[1];
        this.callbacks.onGameOver(winner);
        this.callbacks.onStatusChange("game_over");
        break;
      }

      case MSG_WAITING:
        this.callbacks.onStatusChange("waiting");
        break;
    }
  }

  private decodeState(data: Uint8Array): GameState {
    const view = new DataView(data.buffer, data.byteOffset);
    return {
      ballX: view.getFloat64(1, true),
      ballY: view.getFloat64(9, true),
      leftPaddleY: view.getFloat64(17, true),
      rightPaddleY: view.getFloat64(25, true),
      leftScore: data[33],
      rightScore: data[34],
    };
  }

  sendInput(input: number): void {
    if (!this.datagramWriter) return;

    // Input sent via datagram (unreliable, fast)
    const data = new Int8Array([input]);
    this.datagramWriter.write(new Uint8Array(data.buffer)).catch(() => {
      // Ignore write errors
    });
  }

  close(): void {
    this.running = false;
    if (this.transport) {
      this.transport.close();
      this.transport = null;
    }
    this.datagramWriter = null;
  }
}
