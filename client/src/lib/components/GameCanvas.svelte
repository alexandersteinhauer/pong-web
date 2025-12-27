<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import {
    FIELD_WIDTH,
    FIELD_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_OFFSET,
    BALL_SIZE,
  } from "$lib/game/wasm";

  interface GameState {
    ballX: number;
    ballY: number;
    leftPaddleY: number;
    rightPaddleY: number;
    leftScore: number;
    rightScore: number;
  }

  interface Props {
    gameState: GameState;
    overlay?: string | null;
    countdown?: number | null;
    playerSide?: "left" | "right" | null;
    showTouchZones?: boolean;
    children?: Snippet;
  }

  let {
    gameState,
    overlay = null,
    countdown = null,
    playerSide = null,
    showTouchZones = false,
    children,
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let scale = $state(1);

  const scaledWidth = $derived(FIELD_WIDTH * scale);
  const scaledHeight = $derived(FIELD_HEIGHT * scale);

  const overlayLines = $derived(overlay ? overlay.split("\n") : []);

  onMount(() => {
    ctx = canvas.getContext("2d");

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        // Calculate scale to fit FIELD_WIDTH x FIELD_HEIGHT into width x height
        const scaleX = width / FIELD_WIDTH;
        const scaleY = height / FIELD_HEIGHT;
        scale = Math.min(scaleX, scaleY, 1); // Max scale of 1 to keep it crisp
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  });

  $effect(() => {
    if (!ctx) return;
    ctx.resetTransform();
    ctx.scale(scale, scale);

    // Clear
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

    // Center line
    ctx.strokeStyle = "#222";
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(FIELD_WIDTH / 2, 0);
    ctx.lineTo(FIELD_WIDTH / 2, FIELD_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left paddle
    ctx.fillStyle = playerSide === "left" ? "#22d3ee" : "#fff";
    ctx.shadowColor = playerSide === "left" ? "#22d3ee" : "transparent";
    ctx.shadowBlur = playerSide === "left" ? 15 : 0;
    ctx.fillRect(
      PADDLE_OFFSET,
      gameState.leftPaddleY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
    );

    // Right paddle
    ctx.fillStyle = playerSide === "right" ? "#22d3ee" : "#fff";
    ctx.shadowColor = playerSide === "right" ? "#22d3ee" : "transparent";
    ctx.shadowBlur = playerSide === "right" ? 15 : 0;
    ctx.fillRect(
      FIELD_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH,
      gameState.rightPaddleY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
    );

    // Reset shadow
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = "#facc15";
    ctx.shadowColor = "#facc15";
    ctx.shadowBlur = 10;
    ctx.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE);
    ctx.shadowBlur = 0;
  });
</script>

<div
  bind:this={container}
  class="flex h-full min-h-0 w-full flex-col items-center justify-center gap-4"
>
  <!-- Canvas wrapper with overlay -->
  <div class="relative touch-none">
    <canvas
      bind:this={canvas}
      width={scaledWidth}
      height={scaledHeight}
      class="block rounded border-2 border-neutral-800 bg-[#0a0a0a]"
    ></canvas>

    <!-- Score display (integrated into canvas area) -->
    <div
      class="pointer-events-none absolute top-8 left-0 flex w-full justify-center gap-16 font-mono text-4xl font-bold opacity-30 select-none"
    >
      <span class="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        {gameState.leftScore}
      </span>
      <span class="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        {gameState.rightScore}
      </span>
    </div>

    <!-- Touch zone indicators -->
    {#if showTouchZones}
      <div class="pointer-events-none absolute inset-0 flex">
        {#if playerSide}
          <!-- Online mode: single player, full area for touch -->
          <div class="flex h-full w-full items-center justify-center">
            <div class="flex flex-col items-center gap-1 text-cyan-400/30">
              <span class="text-2xl">↕</span>
              <span class="text-xs font-medium">Drag to move</span>
            </div>
          </div>
        {:else}
          <!-- Local mode: split screen for two players -->
          <div
            class="flex h-full w-1/2 items-center justify-center border-r border-cyan-400/20"
          >
            <span class="text-sm font-medium text-cyan-400/40">P1</span>
          </div>
          <div class="flex h-full w-1/2 items-center justify-center">
            <span class="text-sm font-medium text-yellow-400/40">P2</span>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Countdown overlay -->
    {#if countdown !== null && countdown > 0}
      <div
        class="absolute inset-0 flex items-center justify-center rounded bg-black/70"
      >
        <span
          class="font-mono text-[120px] font-bold text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.5)]"
        >
          {countdown}
        </span>
      </div>
    {/if}

    <!-- Text overlay -->
    {#if children}
      <div
        class="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-2 rounded bg-black/70"
      >
        {@render children()}
      </div>
    {:else if overlay}
      <div
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded bg-black/70"
      >
        {#each overlayLines as line}
          <span
            class="font-mono text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {line}
          </span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Player indicator -->
  {#if playerSide}
    <div class="font-mono text-sm text-cyan-400">
      {playerSide === "left"
        ? "You: Left (W/S or Arrows)"
        : "You: Right (W/S or Arrows)"}
    </div>
  {/if}
</div>
