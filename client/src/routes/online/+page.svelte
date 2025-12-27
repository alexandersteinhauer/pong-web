<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount, onDestroy } from "svelte";
  import GameCanvas from "$lib/components/GameCanvas.svelte";
  import {
    PongTransport,
    type ConnectionStatus,
    type GameState,
  } from "$lib/game/transport";
  import {
    FIELD_HEIGHT,
    PADDLE_HEIGHT,
    FIELD_WIDTH,
    BALL_SIZE,
  } from "$lib/game/wasm";

  type Mode = "select" | "creating" | "joining" | "playing";

  let mode = $state<Mode>("select");
  let roomCode = $state("");
  let joinCode = $state("");
  let status = $state<ConnectionStatus>("connecting");
  let error = $state<string | null>(null);
  let transport: PongTransport | null = null;

  let side = $state<"left" | "right" | null>(null);
  let preferredSide = $state<"left" | "right">("left");
  let countdown = $state<number | null>(null);
  let winner = $state<number | null>(null);
  let intentionalDisconnect = false;
  let isTouchDevice = $state(false);
  let rematchRequested = $state(false);

  let gameState = $state<GameState>({
    ballX: 395,
    ballY: 295,
    leftPaddleY: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
    rightPaddleY: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
    leftScore: 0,
    rightScore: 0,
    waitingForServe: false,
    servingSide: -1,
  });

  let displayGameState = $derived.by(() => {
    if (!side || side === preferredSide) {
      return gameState;
    }
    // Mirror state
    return {
      ...gameState,
      leftPaddleY: gameState.rightPaddleY,
      rightPaddleY: gameState.leftPaddleY,
      leftScore: gameState.rightScore,
      rightScore: gameState.leftScore,
      ballX: FIELD_WIDTH - gameState.ballX - BALL_SIZE,
      // ballY stays same
    };
  });

  const keys = { up: false, down: false };
  let inputInterval: ReturnType<typeof setInterval> | null = null;

  // Touch state - target Y position in game coordinates
  let activeTouch = $state<number | null>(null);
  let touchTargetY = $state<number | null>(null);
  let canvasRect: DOMRect | null = null;

  // Dead zone in game units - paddle won't move if finger is within this distance of paddle center
  // Needs to be fairly large to account for touch sensor noise and prevent jitter
  const TOUCH_DEAD_ZONE = 25;

  function handleKeyDown(e: KeyboardEvent) {
    if (mode !== "playing") return;

    // Unified controls: W/S or ArrowUp/ArrowDown work regardless of side
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
      keys.up = true;
      e.preventDefault();
    }
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
      keys.down = true;
      e.preventDefault();
    }

    // Launch ball with space bar
    if (e.key === " ") {
      e.preventDefault();
      const mySide = side === "left" ? 0 : 1;
      if (gameState.waitingForServe && gameState.servingSide === mySide) {
        transport?.sendInput(2); // 2 = launch ball
      }
    }

    if (e.key === "Escape") {
      leaveGame();
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") keys.up = false;
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown")
      keys.down = false;
  }

  // Convert screen Y position to game Y coordinate
  function screenToGameY(screenY: number, rect: DOMRect): number {
    const relativeY = (screenY - rect.top) / rect.height;
    return relativeY * FIELD_HEIGHT;
  }

  function getTouchInput(): number {
    if (touchTargetY === null || side === null) return 0;

    // Get the player's paddle Y based on which side they're on
    const paddleY =
      side === "left" ? gameState.leftPaddleY : gameState.rightPaddleY;
    const paddleCenterY = paddleY + PADDLE_HEIGHT / 2;
    const diff = touchTargetY - paddleCenterY;

    // Dead zone to prevent jitter
    if (Math.abs(diff) < TOUCH_DEAD_ZONE) return 0;

    // Return -1 to move up, 1 to move down
    return diff < 0 ? -1 : 1;
  }

  function getInput(): number {
    // Touch input takes priority when touch is active
    if (activeTouch !== null) return getTouchInput();

    let input = 0;
    if (keys.up) input -= 1;
    if (keys.down) input += 1;
    return input;
  }

  // Touch handlers for iPad/mobile
  function handleTouchStart(e: TouchEvent) {
    if (mode !== "playing" || status !== "playing") return;

    const touch = e.touches[0];
    if (!touch) return;

    canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    // Handle serve launch on touch
    if (gameState.waitingForServe) {
      const mySide = side === "left" ? 0 : 1;
      if (gameState.servingSide === mySide) {
        transport?.sendInput(2); // 2 = launch ball
      }
    }

    activeTouch = touch.identifier;
    touchTargetY = screenToGameY(touch.clientY, canvasRect);
  }

  function handleTouchMove(e: TouchEvent) {
    if (activeTouch === null || !canvasRect) return;
    e.preventDefault();

    for (const touch of Array.from(e.touches)) {
      if (touch.identifier === activeTouch) {
        touchTargetY = screenToGameY(touch.clientY, canvasRect);
        break;
      }
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === activeTouch) {
        activeTouch = null;
        touchTargetY = null;
        break;
      }
    }
  }

  function startInputLoop() {
    if (inputInterval) return;
    inputInterval = setInterval(() => {
      if (transport && status === "playing") {
        transport.sendInput(getInput());
      }
    }, 1000 / 60);
  }

  function stopInputLoop() {
    if (inputInterval) {
      clearInterval(inputInterval);
      inputInterval = null;
    }
  }

  function requestRematch() {
    if (!transport) return;
    rematchRequested = true;
    transport.requestRematch();
  }

  function createRoom() {
    mode = "creating";
    error = null;

    intentionalDisconnect = false;
    transport = new PongTransport({
      onStatusChange: (s) => {
        status = s;
        if (s === "countdown") {
          rematchRequested = false;
        }
        if (s === "playing") {
          startInputLoop();
        } else if (
          s === "game_over" ||
          s === "opponent_left" ||
          s === "disconnected"
        ) {
          stopInputLoop();
        }
        if (
          s === "disconnected" &&
          mode !== "playing" &&
          !intentionalDisconnect
        ) {
          error = "Connection lost. Please try again.";
          mode = "select";
        }
      },
      onRoomCode: (code) => {
        roomCode = code;
      },
      onSideAssigned: (s) => {
        side = s;
        mode = "playing";
      },
      onCountdown: (seconds) => {
        countdown = seconds;
      },
      onGameState: (state) => {
        gameState = state;
      },
      onGameOver: (w) => {
        winner = w;
      },
    });

    transport.createRoom().catch((err) => {
      console.error("Failed to create room:", err);
      error = "Failed to connect to server. Is it running?";
      mode = "select";
    });
  }

  function joinRoom() {
    if (!joinCode.trim() || joinCode.trim().length !== 6) {
      error = "Please enter a valid 6-character room code";
      return;
    }

    mode = "joining";
    error = null;
    const code = joinCode.trim().toUpperCase();
    roomCode = code;

    intentionalDisconnect = false;
    transport = new PongTransport({
      onStatusChange: (s) => {
        status = s;
        if (s === "countdown") {
          rematchRequested = false;
        }
        if (s === "playing") {
          startInputLoop();
        } else if (
          s === "game_over" ||
          s === "opponent_left" ||
          s === "disconnected"
        ) {
          stopInputLoop();
        }
        if (s === "join_failed") {
          error = "Room not found. Check the code and try again.";
          mode = "select";
        } else if (
          s === "disconnected" &&
          mode !== "playing" &&
          !intentionalDisconnect
        ) {
          error = "Connection lost. Please try again.";
          mode = "select";
        }
      },
      onRoomCode: () => {},
      onSideAssigned: (s) => {
        side = s;
        mode = "playing";
      },
      onCountdown: (seconds) => {
        countdown = seconds;
      },
      onGameState: (state) => {
        gameState = state;
      },
      onGameOver: (w) => {
        winner = w;
      },
    });

    transport.joinRoom(code).catch((err) => {
      console.error("Failed to join room:", err);
      error = "Failed to connect to server. Is it running?";
      mode = "select";
    });
  }

  function cancel() {
    intentionalDisconnect = true;
    if (transport) {
      transport.close();
      transport = null;
    }
    stopInputLoop();
    mode = "select";
    roomCode = "";
    error = null;
    side = null;
    countdown = null;
    winner = null;
    rematchRequested = false;
  }

  function leaveGame() {
    cancel();
  }

  onMount(() => {
    isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  });

  onDestroy(() => {
    stopInputLoop();
    if (transport) {
      transport.close();
    }
    if (browser) {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  });

  let overlay = $derived.by(() => {
    if (mode !== "playing") return null;
    if (status === "connecting") return "Connecting...";
    if (status === "waiting") return "Waiting for opponent...";

    const leaveHint = isTouchDevice
      ? "Tap Leave to exit"
      : "Press ESC to leave";

    if (status === "opponent_left")
      return `Opponent disconnected\n\n${leaveHint}`;
    if (status === "disconnected") return `Connection lost\n\n${leaveHint}`;
    if (status === "game_over" && winner !== null) {
      const isWinner =
        (winner === 0 && side === "left") || (winner === 1 && side === "right");
      return isWinner
        ? `You Win!\n\n${leaveHint}`
        : `You Lose!\n\n${leaveHint}`;
    }

    // Show serve prompt when waiting
    if (gameState.waitingForServe && status === "playing") {
      const mySide = side === "left" ? 0 : 1;
      const isMyServe = gameState.servingSide === mySide;
      if (isMyServe) {
        if (isTouchDevice) {
          return "Your serve\n\nTap to launch";
        } else {
          return "Your serve\n\nPress SPACE";
        }
      } else {
        return "Opponent's serve...";
      }
    }
    return null;
  });

  let displayCountdown = $derived(status === "countdown" ? countdown : null);
</script>

{#if mode === "playing"}
  <!-- Game View -->
  <div
    class="flex h-screen flex-col items-center gap-6 overflow-hidden bg-[#050505] p-6 text-white"
  >
    <header class="flex w-full shrink-0 items-center gap-6">
      <button
        class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-red-500 hover:text-red-500"
        onclick={leaveGame}
      >
        ← Leave
      </button>
      <h1 class="flex-1 text-xl font-bold text-neutral-500">
        Room: {roomCode}
      </h1>
      {#if preferredSide}
        <span
          class="rounded px-3 py-1.5 text-xs font-bold tracking-wide uppercase {preferredSide ===
          'left'
            ? 'border border-cyan-400/30 bg-cyan-400/15 text-cyan-400'
            : 'border border-yellow-400/30 bg-yellow-400/15 text-yellow-400'}"
        >
          You: {preferredSide === "left" ? "Left" : "Right"}
        </span>
      {/if}
    </header>

    <main
      class="flex min-h-0 w-full flex-1 items-center justify-center"
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
      ontouchcancel={handleTouchEnd}
    >
      <GameCanvas
        gameState={displayGameState}
        countdown={displayCountdown}
        playerSide={preferredSide}
        showTouchZones={isTouchDevice && status === "playing"}
      >
        {#if overlay}
          {#each overlay.split("\n") as line}
            <span
              class="font-mono text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {line}
            </span>
          {/each}
        {/if}

        {#if status === "game_over" && winner !== null}
          <div class="mt-8 flex flex-col items-center gap-4">
            {#if rematchRequested}
              <div class="flex items-center gap-2 text-neutral-400">
                <div
                  class="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-white"
                ></div>
                <span>Waiting for opponent...</span>
              </div>
            {:else}
              <button
                class="cursor-pointer rounded bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-neutral-200"
                onclick={requestRematch}
              >
                Rematch
              </button>
            {/if}
          </div>
        {/if}
      </GameCanvas>
    </main>

    <footer
      class="flex shrink-0 items-center gap-8 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-4"
    >
      <div class="flex flex-col items-center gap-2">
        <span class="text-xs tracking-widest text-neutral-500 uppercase"
          >Your controls</span
        >
        {#if isTouchDevice}
          <span class="text-sm text-cyan-400"
            >Touch where you want the paddle</span
          >
        {:else}
          <div class="flex items-center gap-8">
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
            <span class="text-xs text-neutral-600">OR</span>
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
      </div>
    </footer>
  </div>
{:else}
  <!-- Lobby View -->
  <div
    class="flex h-screen flex-col items-center gap-8 overflow-hidden bg-[#050505] p-6 text-white"
  >
    <header class="flex w-full shrink-0 items-center gap-6">
      <button
        class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-cyan-400"
        onclick={() => goto("/")}
      >
        ← Back
      </button>
      <h1 class="text-xl font-bold text-neutral-500">Online Multiplayer</h1>
    </header>

    <main
      class="flex min-h-0 w-full max-w-[500px] flex-1 items-center justify-center"
    >
      {#if mode === "select"}
        <div class="flex max-h-full w-full flex-col gap-6 overflow-y-auto p-2">
          <!-- Side Selector -->
          <div class="flex flex-col gap-3">
            <span class="text-sm text-neutral-500">Preferred Side</span>
            <div
              class="flex gap-3 rounded-lg border border-neutral-800 bg-[#0a0a0a] p-1"
            >
              <button
                class="flex-1 cursor-pointer rounded py-2 text-sm font-bold transition-all {preferredSide ===
                'left'
                  ? 'bg-neutral-800 text-cyan-400'
                  : 'text-neutral-500 hover:text-white'}"
                onclick={() => (preferredSide = "left")}
              >
                Left Side
              </button>
              <button
                class="flex-1 cursor-pointer rounded py-2 text-sm font-bold transition-all {preferredSide ===
                'right'
                  ? 'bg-neutral-800 text-yellow-400'
                  : 'text-neutral-500 hover:text-white'}"
                onclick={() => (preferredSide = "right")}
              >
                Right Side
              </button>
            </div>
          </div>

          <button
            class="flex shrink-0 cursor-pointer items-center gap-5 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-6 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            onclick={createRoom}
          >
            <span class="text-3xl">✨</span>
            <span class="flex flex-col gap-1">
              <span class="text-lg font-bold text-white">Create Room</span>
              <span class="text-xs text-neutral-500"
                >Get a code to share with a friend</span
              >
            </span>
          </button>

          <div
            class="flex shrink-0 items-center gap-4 text-sm text-neutral-500"
          >
            <div class="h-px flex-1 bg-neutral-800"></div>
            <span>or</span>
            <div class="h-px flex-1 bg-neutral-800"></div>
          </div>

          <div class="flex shrink-0 flex-col gap-3">
            <label class="text-sm text-neutral-500" for="join-code"
              >Join with code</label
            >
            <div class="flex gap-3">
              <input
                id="join-code"
                type="text"
                class="flex-1 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-5 py-4 text-xl font-bold tracking-[0.2em] text-white uppercase placeholder:text-neutral-700 focus:border-cyan-400 focus:outline-none"
                placeholder="ABCD12"
                maxlength="6"
                bind:value={joinCode}
                onkeydown={(e) => e.key === "Enter" && joinRoom()}
              />
              <button
                class="cursor-pointer rounded-lg bg-cyan-400 px-8 py-4 font-bold text-black transition-all hover:-translate-y-0.5 hover:opacity-90"
                onclick={joinRoom}
              >
                Join
              </button>
            </div>
          </div>

          {#if error}
            <div
              class="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-500"
            >
              {error}
            </div>
          {/if}
        </div>
      {:else if mode === "creating"}
        <div
          class="flex max-h-full flex-col items-center gap-6 overflow-y-auto rounded-xl border border-neutral-800 bg-[#0a0a0a] p-12 text-center"
        >
          {#if roomCode}
            <div class="text-xs tracking-widest text-neutral-500 uppercase">
              Your room code
            </div>
            <div
              class="text-5xl font-bold tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              {roomCode}
            </div>
            <div class="text-sm text-neutral-500">
              Share this code with your friend
            </div>
          {/if}
          <div class="flex items-center gap-4 text-neutral-500">
            <div
              class="h-5 w-5 animate-spin rounded-full border-2 border-neutral-800 border-t-cyan-400"
            ></div>
            <span>Waiting for opponent...</span>
          </div>
          <button
            class="cursor-pointer rounded-md border border-neutral-800 px-6 py-3 text-sm text-neutral-500 transition-all hover:border-red-500 hover:text-red-500"
            onclick={cancel}
          >
            Cancel
          </button>
        </div>
      {:else if mode === "joining"}
        <div
          class="flex max-h-full flex-col items-center gap-6 overflow-y-auto rounded-xl border border-neutral-800 bg-[#0a0a0a] p-12 text-center"
        >
          <div class="flex items-center gap-4 text-neutral-500">
            <div
              class="h-5 w-5 animate-spin rounded-full border-2 border-neutral-800 border-t-cyan-400"
            ></div>
            <span>Joining room...</span>
          </div>
          <button
            class="cursor-pointer rounded-md border border-neutral-800 px-6 py-3 text-sm text-neutral-500 transition-all hover:border-red-500 hover:text-red-500"
            onclick={cancel}
          >
            Cancel
          </button>
        </div>
      {/if}
    </main>
  </div>
{/if}
