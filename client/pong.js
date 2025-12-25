const SCALE = 2;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.scale(SCALE, SCALE);

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_OFFSET = 20;
const BALL_SIZE = 10;

const MSG_ASSIGN_LEFT = 0;
const MSG_ASSIGN_RIGHT = 1;
const MSG_STATE = 2;
const MSG_OPPONENT_LEFT = 3;

let state = {
  status: "connecting",
  side: null,
  ball_x: FIELD_WIDTH / 2,
  ball_y: FIELD_HEIGHT / 2,
  left_paddle_y: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
  right_paddle_y: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
  left_score: 0,
  right_score: 0,
};

let sender = null;

const keys = { w: false, s: false };

document.addEventListener("keydown", (e) => {
  if (e.key in keys) {
    keys[e.key] = true;
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key in keys) {
    keys[e.key] = false;
    e.preventDefault();
  }
});

function getInput() {
  let input = 0;
  if (keys.w) input -= 1;
  if (keys.s) input += 1;
  return input;
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

  ctx.fillStyle = "#fff";
  ctx.font = "24px monospace";
  ctx.textAlign = "center";

  if (state.status === "connecting") {
    ctx.fillText("Connecting...", FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
    return;
  }

  if (state.status === "waiting") {
    ctx.fillText("Waiting for opponent...", FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
    return;
  }

  if (state.status === "opponent_left") {
    ctx.fillText("Opponent disconnected", FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
    return;
  }

  if (state.status === "disconnected") {
    ctx.fillText("Disconnected from server", FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
    return;
  }

  ctx.strokeStyle = "#333";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(FIELD_WIDTH / 2, 0);
  ctx.lineTo(FIELD_WIDTH / 2, FIELD_HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#fff";
  ctx.fillRect(PADDLE_OFFSET, state.left_paddle_y, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(
    FIELD_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH,
    state.right_paddle_y,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  ctx.fillRect(state.ball_x, state.ball_y, BALL_SIZE, BALL_SIZE);

  ctx.font = "48px monospace";
  ctx.fillText(state.left_score, FIELD_WIDTH / 4, 60);
  ctx.fillText(state.right_score, (3 * FIELD_WIDTH) / 4, 60);

  if (state.side !== null) {
    ctx.font = "14px monospace";
    ctx.fillStyle = "#666";
    const sideText = state.side === 0 ? "You: Left" : "You: Right";
    ctx.fillText(sideText, FIELD_WIDTH / 2, FIELD_HEIGHT - 20);
  }
}

function decodeState(data) {
  const view = new DataView(data.buffer);
  state.ball_x = view.getFloat64(1, true);
  state.ball_y = view.getFloat64(9, true);
  state.left_paddle_y = view.getFloat64(17, true);
  state.right_paddle_y = view.getFloat64(25, true);
  state.left_score = data[33];
  state.right_score = data[34];
}

function loop() {
  if (sender && state.status === "playing") {
    const input = getInput();
    const data = new Int8Array([input]);
    sender.write(data).catch(() => {});
  }

  draw();
  requestAnimationFrame(loop);
}

async function connect() {
  const url = "https://localhost:4433";

  const transport = new WebTransport(url, {
    serverCertificateHashes: [
      {
        algorithm: "sha-256",
        value: Uint8Array.from(
          atob("eode/DS1WZRnplL5G82Oqxyvdx/DoUOy5tbqKz5ee1c="),
          (c) => c.charCodeAt(0)
        ),
      },
    ],
  });

  await transport.ready;
  console.log("Connected to server");
  state.status = "waiting";

  sender = transport.datagrams.writable.getWriter();
  const reader = transport.datagrams.readable.getReader();

  transport.closed
    .then(() => {
      state.status = "disconnected";
    })
    .catch(() => {
      state.status = "disconnected";
    });

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const msgType = value[0];

    if (msgType === MSG_ASSIGN_LEFT || msgType === MSG_ASSIGN_RIGHT) {
      state.side = msgType;
      state.status = "playing";
      console.log("Assigned side:", msgType === 0 ? "left" : "right");
    } else if (msgType === MSG_STATE) {
      decodeState(value);
    } else if (msgType === MSG_OPPONENT_LEFT) {
      state.status = "opponent_left";
    }
  }
}

requestAnimationFrame(loop);

connect().catch((err) => {
  console.error("Connection failed:", err);
  state.status = "disconnected";
});
