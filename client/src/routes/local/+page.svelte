<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import GameCanvas from "$lib/components/GameCanvas.svelte";
  import {
    initLocalGame,
    createKeyState,
    handleKeyDown,
    handleKeyUp,
    getLeftInput,
    getRightInput,
  } from "$lib/game/local";
  import type { Game } from "$lib/game/wasm";
  import { FIELD_HEIGHT, PADDLE_HEIGHT } from "$lib/game/wasm";

  let game = $state<Game | null>(null);
  let running = $state(false);
  let winner = $state<number>(-1);
  let loading = $state(true);
  let isTouchDevice = $state(false);

  let gameState = $state({
    ballX: 395,
    ballY: 295,
    leftPaddleY: 250,
    rightPaddleY: 250,
    leftScore: 0,
    rightScore: 0,
    waitingForServe: false,
    servingSide: -1,
  });

  const keys = createKeyState();
  let animationFrame: number | null = null;
  let lastTime: number | null = null;

  // Touch state - track by touch identifier and target Y position
  let leftTouchId = $state<number | null>(null);
  let rightTouchId = $state<number | null>(null);
  let leftTouchTargetY = $state<number | null>(null); // Target Y in game coordinates
  let rightTouchTargetY = $state<number | null>(null);
  let canvasRect = $state<DOMRect | null>(null);

  // Dead zone in game units - paddle won't move if finger is within this distance of paddle center
  // Needs to be fairly large to account for touch sensor noise and prevent jitter
  const TOUCH_DEAD_ZONE = 25;

  function updateGameState() {
    if (!game) return;

    gameState = {
      ballX: game.ball_x,
      ballY: game.ball_y,
      leftPaddleY: game.left_paddle_y,
      rightPaddleY: game.right_paddle_y,
      leftScore: game.left_score,
      rightScore: game.right_score,
      waitingForServe: game.waiting_for_serve,
      servingSide: game.serving_side,
    };
  }

  function getTouchInput(targetY: number | null, paddleY: number): number {
    if (targetY === null) return 0;

    const paddleCenterY = paddleY + PADDLE_HEIGHT / 2;
    const diff = targetY - paddleCenterY;

    // Dead zone to prevent jitter
    if (Math.abs(diff) < TOUCH_DEAD_ZONE) return 0;

    // Return -1 to move up, 1 to move down
    return diff < 0 ? -1 : 1;
  }

  function gameLoop(timestamp: number) {
    if (!game || !running) return;

    if (lastTime === null) {
      lastTime = timestamp;
    }

    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Update inputs - combine keyboard and touch
    const leftKeyInput = getLeftInput(keys);
    const rightKeyInput = getRightInput(keys);
    const leftTouchInput = getTouchInput(leftTouchTargetY, game.left_paddle_y);
    const rightTouchInput = getTouchInput(
      rightTouchTargetY,
      game.right_paddle_y,
    );

    // Touch takes priority, otherwise use keyboard
    game.left_paddle_input =
      leftTouchId !== null ? leftTouchInput : leftKeyInput;
    game.right_paddle_input =
      rightTouchId !== null ? rightTouchInput : rightKeyInput;

    // Update game
    game.update(dt);
    updateGameState();

    // Check for game over
    if (game.is_game_over()) {
      winner = game.winner();
      running = false;
      return;
    }

    animationFrame = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    if (!game) return;
    game.reset();
    winner = -1;
    running = true;
    lastTime = null;
    updateGameState();
    animationFrame = requestAnimationFrame(gameLoop);
  }

  function onKeyDown(e: KeyboardEvent) {
    handleKeyDown(keys, e);

    // Start game on space if not running and no winner
    if (e.key === " " && !running && winner === -1 && game) {
      startGame();
    }

    // Rematch on space after game over
    if (e.key === " " && winner !== -1) {
      startGame();
    }

    // Launch ball when waiting for serve
    if (running && game && gameState.waitingForServe) {
      // Left player serves with W or S
      if (
        gameState.servingSide === 0 &&
        (e.key === "w" || e.key === "W" || e.key === "s" || e.key === "S")
      ) {
        game.launch_ball(0);
        updateGameState();
      }
      // Right player serves with arrows
      if (
        gameState.servingSide === 1 &&
        (e.key === "ArrowUp" || e.key === "ArrowDown")
      ) {
        game.launch_ball(1);
        updateGameState();
      }
    }

    // Back to menu on Escape
    if (e.key === "Escape") {
      goto("/");
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    handleKeyUp(keys, e);
  }

  // Convert screen Y position to game Y coordinate
  function screenToGameY(screenY: number, rect: DOMRect): number {
    const relativeY = (screenY - rect.top) / rect.height;
    return relativeY * FIELD_HEIGHT;
  }

  // Touch handlers for iPad/mobile
  function handleTouchStart(e: TouchEvent) {
    if (!game || !running) {
      // Start game on tap if not running
      if (!running && winner === -1 && game) {
        startGame();
      } else if (winner !== -1) {
        startGame();
      }
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    canvasRect = rect;

    for (const touch of Array.from(e.changedTouches)) {
      const x = touch.clientX - rect.left;
      const relativeX = x / rect.width;
      const gameY = screenToGameY(touch.clientY, rect);

      // Handle serve launch on touch
      if (gameState.waitingForServe) {
        if (gameState.servingSide === 0 && relativeX < 0.5) {
          game.launch_ball(0);
          updateGameState();
        } else if (gameState.servingSide === 1 && relativeX >= 0.5) {
          game.launch_ball(1);
          updateGameState();
        }
      }

      // Left half controls left paddle, right half controls right paddle
      if (relativeX < 0.5 && leftTouchId === null) {
        leftTouchId = touch.identifier;
        leftTouchTargetY = gameY;
      } else if (relativeX >= 0.5 && rightTouchId === null) {
        rightTouchId = touch.identifier;
        rightTouchTargetY = gameY;
      }
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (!game || !running) return;
    e.preventDefault();

    const rect =
      canvasRect || (e.currentTarget as HTMLElement).getBoundingClientRect();

    for (const touch of Array.from(e.changedTouches)) {
      const gameY = screenToGameY(touch.clientY, rect);

      if (leftTouchId !== null && touch.identifier === leftTouchId) {
        leftTouchTargetY = gameY;
      }

      if (rightTouchId !== null && touch.identifier === rightTouchId) {
        rightTouchTargetY = gameY;
      }
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    for (const touch of Array.from(e.changedTouches)) {
      if (leftTouchId !== null && touch.identifier === leftTouchId) {
        leftTouchId = null;
        leftTouchTargetY = null;
      }
      if (rightTouchId !== null && touch.identifier === rightTouchId) {
        rightTouchId = null;
        rightTouchTargetY = null;
      }
    }
  }

  onMount(async () => {
    // Detect touch device
    isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    try {
      game = await initLocalGame();
      updateGameState();
      loading = false;
    } catch (err) {
      console.error("Failed to load game:", err);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });

  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  });

  let overlay = $derived.by(() => {
    if (loading) return "Loading...";
    if (winner !== -1) {
      const winnerName = winner === 0 ? "Player 1" : "Player 2";
      return isTouchDevice
        ? `${winnerName} Wins!\n\nTap to rematch`
        : `${winnerName} Wins!\n\nPress SPACE to rematch`;
    }
    if (!running)
      return isTouchDevice ? "Tap to start" : "Press SPACE to start";
    if (gameState.waitingForServe) {
      const serverName = gameState.servingSide === 0 ? "Player 1" : "Player 2";
      if (isTouchDevice) {
        const side = gameState.servingSide === 0 ? "left" : "right";
        return `${serverName}'s serve\n\nTap ${side} side`;
      } else {
        const keys = gameState.servingSide === 0 ? "W/S" : "↑/↓";
        return `${serverName}'s serve\n\nPress ${keys}`;
      }
    }
    return null;
  });
</script>

<div class="flex min-h-screen flex-col items-center gap-6 p-6">
  <header class="flex w-full max-w-[800px] items-center gap-6">
    <button
      class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-cyan-400"
      onclick={() => goto("/")}
    >
      ← Back
    </button>
    <h1 class="text-xl font-bold text-neutral-500">Local Multiplayer</h1>
  </header>

  <main
    class="flex flex-1 items-center justify-center"
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    ontouchcancel={handleTouchEnd}
  >
    <GameCanvas
      state={gameState}
      {overlay}
      showTouchZones={isTouchDevice && running}
    />
  </main>

  <footer
    class="flex items-center gap-8 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-4"
  >
    {#if isTouchDevice}
      <div class="flex flex-col items-center gap-2">
        <span class="text-xs tracking-widest text-neutral-500 uppercase"
          >Player 1</span
        >
        <span class="text-sm text-cyan-400">Touch left side</span>
      </div>
      <div class="h-12 w-px bg-neutral-800"></div>
      <div class="flex flex-col items-center gap-2">
        <span class="text-xs tracking-widest text-neutral-500 uppercase"
          >Player 2</span
        >
        <span class="text-sm text-cyan-400">Touch right side</span>
      </div>
    {:else}
      <div class="flex flex-col items-center gap-2">
        <span class="text-xs tracking-widest text-neutral-500 uppercase"
          >Player 1</span
        >
        <div class="flex gap-2">
          <kbd
            class="inline-flex min-w-8 items-center justify-center rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-sm font-bold text-cyan-400"
            >W</kbd
          >
          <kbd
            class="inline-flex min-w-8 items-center justify-center rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-sm font-bold text-cyan-400"
            >S</kbd
          >
        </div>
      </div>
      <div class="h-12 w-px bg-neutral-800"></div>
      <div class="flex flex-col items-center gap-2">
        <span class="text-xs tracking-widest text-neutral-500 uppercase"
          >Player 2</span
        >
        <div class="flex gap-2">
          <kbd
            class="inline-flex min-w-8 items-center justify-center rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-sm font-bold text-cyan-400"
            >↑</kbd
          >
          <kbd
            class="inline-flex min-w-8 items-center justify-center rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-sm font-bold text-cyan-400"
            >↓</kbd
          >
        </div>
      </div>
    {/if}
  </footer>
</div>
