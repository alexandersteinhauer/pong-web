import init, { Game } from "../pong/pkg/pong.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let game;
let lastTime = 0;

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(game.ball_x, game.ball_y, 10, 0, Math.PI * 2);
  ctx.fill();
}

function loop(time) {
  const dt = time - lastTime;
  lastTime = time;

  game.update(dt);
  draw();

  requestAnimationFrame(loop);
}

async function main() {
  await init();
  game = new Game();
  requestAnimationFrame(loop);
}

main();

