import init, { Game } from "./pong/pkg/pong.js";

const SCALE = 2;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.scale(SCALE, SCALE);

let game;
let lastTime = 0;

const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

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

function updateInput() {
  let left = 0;
  if (keys.w) left -= 1;
  if (keys.s) left += 1;
  game.left_paddle_input = left;

  let right = 0;
  if (keys.ArrowUp) right -= 1;
  if (keys.ArrowDown) right += 1;
  game.right_paddle_input = right;
}

function draw() {
  const w = game.field_width();
  const h = game.field_height();
  const pw = game.paddle_width();
  const ph = game.paddle_height();
  const po = game.paddle_offset();
  const bs = game.ball_size();

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#333";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#fff";
  ctx.fillRect(po, game.left_paddle_y, pw, ph);
  ctx.fillRect(w - po - pw, game.right_paddle_y, pw, ph);

  ctx.fillRect(game.ball_x, game.ball_y, bs, bs);

  ctx.font = "48px monospace";
  ctx.textAlign = "center";
  ctx.fillText(game.left_score, w / 4, 60);
  ctx.fillText(game.right_score, (3 * w) / 4, 60);
}

function loop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  updateInput();
  game.update(dt);
  draw();

  requestAnimationFrame(loop);
}

async function main() {
  await init();
  game = new Game();
  requestAnimationFrame((time) => {
    lastTime = time;
    requestAnimationFrame(loop);
  });
}

main();
