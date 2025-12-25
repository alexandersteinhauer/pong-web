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
  import { FIELD_HEIGHT, PADDLE_HEIGHT } from "$lib/game/wasm";

  type Mode = "select" | "creating" | "joining" | "playing";

  let mode = $state<Mode>("select");
  let roomCode = $state("");
  let joinCode = $state("");
  let status = $state<ConnectionStatus>("connecting");
  let error = $state<string | null>(null);
  let transport: PongTransport | null = null;

  let side = $state<"left" | "right" | null>(null);
  let countdown = $state<number | null>(null);
  let winner = $state<number | null>(null);
  let intentionalDisconnect = false;

  let gameState = $state<GameState>({
    ballX: 395,
    ballY: 295,
    leftPaddleY: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
    rightPaddleY: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
    leftScore: 0,
    rightScore: 0,
  });

  const keys = { up: false, down: false };
  let inputInterval: ReturnType<typeof setInterval> | null = null;

  function handleKeyDown(e: KeyboardEvent) {
    if (mode !== "playing") return;

    if (side === "left") {
      if (e.key === "w" || e.key === "W") {
        keys.up = true;
        e.preventDefault();
      }
      if (e.key === "s" || e.key === "S") {
        keys.down = true;
        e.preventDefault();
      }
    } else if (side === "right") {
      if (e.key === "ArrowUp") {
        keys.up = true;
        e.preventDefault();
      }
      if (e.key === "ArrowDown") {
        keys.down = true;
        e.preventDefault();
      }
    }

    if (e.key === "Escape") {
      leaveGame();
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (side === "left") {
      if (e.key === "w" || e.key === "W") keys.up = false;
      if (e.key === "s" || e.key === "S") keys.down = false;
    } else if (side === "right") {
      if (e.key === "ArrowUp") keys.up = false;
      if (e.key === "ArrowDown") keys.down = false;
    }
  }

  function getInput(): number {
    let input = 0;
    if (keys.up) input -= 1;
    if (keys.down) input += 1;
    return input;
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

  function createRoom() {
    mode = "creating";
    error = null;

    intentionalDisconnect = false;
    transport = new PongTransport({
      onStatusChange: (s) => {
        status = s;
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
  }

  function leaveGame() {
    cancel();
  }

  onMount(() => {
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
    if (status === "opponent_left")
      return "Opponent disconnected\n\nPress ESC to leave";
    if (status === "disconnected")
      return "Connection lost\n\nPress ESC to leave";
    if (status === "game_over" && winner !== null) {
      const isWinner =
        (winner === 0 && side === "left") || (winner === 1 && side === "right");
      return isWinner
        ? "You Win!\n\nPress ESC to leave"
        : "You Lose!\n\nPress ESC to leave";
    }
    return null;
  });

  let displayCountdown = $derived(status === "countdown" ? countdown : null);
</script>

{#if mode === "playing"}
  <!-- Game View -->
  <div class="flex min-h-screen flex-col items-center gap-6 p-6">
    <header class="flex w-full max-w-[800px] items-center gap-6">
      <button
        class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-red-500 hover:text-red-500"
        onclick={leaveGame}
      >
        ← Leave
      </button>
      <h1 class="flex-1 text-xl font-bold text-neutral-500">
        Room: {roomCode}
      </h1>
      {#if side}
        <span
          class="rounded px-3 py-1.5 text-xs font-bold tracking-wide uppercase {side ===
          'left'
            ? 'border border-cyan-400/30 bg-cyan-400/15 text-cyan-400'
            : 'border border-yellow-400/30 bg-yellow-400/15 text-yellow-400'}"
        >
          You: {side === "left" ? "Left" : "Right"}
        </span>
      {/if}
    </header>

    <main class="flex flex-1 items-center justify-center">
      <GameCanvas
        state={gameState}
        {overlay}
        countdown={displayCountdown}
        playerSide={side}
      />
    </main>

    <footer
      class="flex items-center gap-8 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-4"
    >
      {#if side === "left"}
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs tracking-widest text-neutral-500 uppercase"
            >Your controls</span
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
      {:else if side === "right"}
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs tracking-widest text-neutral-500 uppercase"
            >Your controls</span
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
{:else}
  <!-- Lobby View -->
  <div class="flex min-h-screen flex-col items-center gap-8 p-6">
    <header class="flex w-full max-w-[500px] items-center gap-6">
      <button
        class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-cyan-400"
        onclick={() => goto("/")}
      >
        ← Back
      </button>
      <h1 class="text-xl font-bold text-neutral-500">Online Multiplayer</h1>
    </header>

    <main class="flex w-full max-w-[500px] flex-1 items-center justify-center">
      {#if mode === "select"}
        <div class="flex w-full flex-col gap-6">
          <button
            class="flex cursor-pointer items-center gap-5 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-6 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
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

          <div class="flex items-center gap-4 text-sm text-neutral-500">
            <div class="h-px flex-1 bg-neutral-800"></div>
            <span>or</span>
            <div class="h-px flex-1 bg-neutral-800"></div>
          </div>

          <div class="flex flex-col gap-3">
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
              class="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-500"
            >
              {error}
            </div>
          {/if}
        </div>
      {:else if mode === "creating"}
        <div
          class="flex flex-col items-center gap-6 rounded-xl border border-neutral-800 bg-[#0a0a0a] p-12 text-center"
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
          class="flex flex-col items-center gap-6 rounded-xl border border-neutral-800 bg-[#0a0a0a] p-12 text-center"
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
