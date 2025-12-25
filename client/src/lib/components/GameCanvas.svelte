<script lang="ts">
	import { onMount } from 'svelte';
	import {
		FIELD_WIDTH,
		FIELD_HEIGHT,
		PADDLE_WIDTH,
		PADDLE_HEIGHT,
		PADDLE_OFFSET,
		BALL_SIZE
	} from '$lib/game/wasm';

	interface GameState {
		ballX: number;
		ballY: number;
		leftPaddleY: number;
		rightPaddleY: number;
		leftScore: number;
		rightScore: number;
	}

	interface Props {
		state: GameState;
		overlay?: string | null;
		countdown?: number | null;
		playerSide?: 'left' | 'right' | null;
		scale?: number;
	}

	let { state, overlay = null, countdown = null, playerSide = null, scale = 1 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	const scaledWidth = $derived(FIELD_WIDTH * scale);
	const scaledHeight = $derived(FIELD_HEIGHT * scale);

	const overlayLines = $derived(overlay ? overlay.split('\n') : []);

	onMount(() => {
		ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.scale(scale, scale);
		}
	});

	$effect(() => {
		if (!ctx) return;

		// Clear
		ctx.fillStyle = '#0a0a0a';
		ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

		// Center line
		ctx.strokeStyle = '#222';
		ctx.setLineDash([10, 10]);
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(FIELD_WIDTH / 2, 0);
		ctx.lineTo(FIELD_WIDTH / 2, FIELD_HEIGHT);
		ctx.stroke();
		ctx.setLineDash([]);

		// Left paddle
		ctx.fillStyle = playerSide === 'left' ? '#22d3ee' : '#fff';
		ctx.shadowColor = playerSide === 'left' ? '#22d3ee' : 'transparent';
		ctx.shadowBlur = playerSide === 'left' ? 15 : 0;
		ctx.fillRect(PADDLE_OFFSET, state.leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

		// Right paddle
		ctx.fillStyle = playerSide === 'right' ? '#22d3ee' : '#fff';
		ctx.shadowColor = playerSide === 'right' ? '#22d3ee' : 'transparent';
		ctx.shadowBlur = playerSide === 'right' ? 15 : 0;
		ctx.fillRect(
			FIELD_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH,
			state.rightPaddleY,
			PADDLE_WIDTH,
			PADDLE_HEIGHT
		);

		// Reset shadow
		ctx.shadowBlur = 0;

		// Ball
		ctx.fillStyle = '#facc15';
		ctx.shadowColor = '#facc15';
		ctx.shadowBlur = 10;
		ctx.fillRect(state.ballX, state.ballY, BALL_SIZE, BALL_SIZE);
		ctx.shadowBlur = 0;
	});
</script>

<div class="flex flex-col items-center gap-4">
	<!-- Score display -->
	<div class="flex w-full items-center justify-center gap-8 font-mono">
		<div class="flex flex-col items-center gap-1">
			<span class="text-xs uppercase tracking-widest text-neutral-500">Player 1</span>
			<span class="text-6xl font-bold tabular-nums text-neutral-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
				{state.leftScore}
			</span>
		</div>
		<span class="text-3xl text-neutral-700">:</span>
		<div class="flex flex-col items-center gap-1">
			<span class="text-xs uppercase tracking-widest text-neutral-500">Player 2</span>
			<span class="text-6xl font-bold tabular-nums text-neutral-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
				{state.rightScore}
			</span>
		</div>
	</div>

	<!-- Canvas wrapper with overlay -->
	<div class="relative">
		<canvas
			bind:this={canvas}
			width={scaledWidth}
			height={scaledHeight}
			class="block rounded border-2 border-neutral-800 bg-[#0a0a0a]"
		></canvas>

		<!-- Countdown overlay -->
		{#if countdown !== null && countdown > 0}
			<div class="absolute inset-0 flex items-center justify-center rounded bg-black/70">
				<span class="font-mono text-[120px] font-bold text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.5)]">
					{countdown}
				</span>
			</div>
		{/if}

		<!-- Text overlay -->
		{#if overlay}
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded bg-black/70">
				{#each overlayLines as line}
					<span class="font-mono text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
						{line}
					</span>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Player indicator -->
	{#if playerSide}
		<div class="font-mono text-sm text-cyan-400">
			{playerSide === 'left' ? 'You: Left (W/S)' : 'You: Right (↑/↓)'}
		</div>
	{/if}
</div>
