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

		// Scores
		ctx.fillStyle = '#666';
		ctx.font = 'bold 72px "Space Mono", monospace';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillText(String(state.leftScore), FIELD_WIDTH / 4, 30);
		ctx.fillText(String(state.rightScore), (3 * FIELD_WIDTH) / 4, 30);

		// Player indicator
		if (playerSide) {
			ctx.font = '14px "Space Mono", monospace';
			ctx.fillStyle = '#22d3ee';
			ctx.textBaseline = 'bottom';
			const sideText = playerSide === 'left' ? 'You: Left (W/S)' : 'You: Right (↑/↓)';
			ctx.fillText(sideText, FIELD_WIDTH / 2, FIELD_HEIGHT - 15);
		}

		// Countdown overlay
		if (countdown !== null && countdown > 0) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

			ctx.fillStyle = '#22d3ee';
			ctx.font = 'bold 120px "Space Mono", monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(String(countdown), FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
		}

		// Text overlay (for messages like "Waiting...", "Game Over", etc.)
		if (overlay) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

			ctx.fillStyle = '#fff';
			ctx.font = 'bold 32px "Space Mono", monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			// Handle multiline overlay
			const lines = overlay.split('\n');
			const lineHeight = 45;
			const startY = FIELD_HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2;
			lines.forEach((line, i) => {
				ctx!.fillText(line, FIELD_WIDTH / 2, startY + i * lineHeight);
			});
		}
	});
</script>

<canvas bind:this={canvas} width={scaledWidth} height={scaledHeight} class="game-canvas"></canvas>

<style>
	.game-canvas {
		display: block;
		border: 2px solid #333;
		border-radius: 4px;
		background: #0a0a0a;
	}
</style>

