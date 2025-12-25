<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import GameCanvas from '$lib/components/GameCanvas.svelte';
	import {
		initLocalGame,
		createKeyState,
		handleKeyDown,
		handleKeyUp,
		getLeftInput,
		getRightInput
	} from '$lib/game/local';
	import type { Game } from '$lib/game/wasm';

	let game = $state<Game | null>(null);
	let running = $state(false);
	let winner = $state<number>(-1);
	let loading = $state(true);

	let gameState = $state({
		ballX: 395,
		ballY: 295,
		leftPaddleY: 250,
		rightPaddleY: 250,
		leftScore: 0,
		rightScore: 0
	});

	const keys = createKeyState();
	let animationFrame: number | null = null;
	let lastTime: number | null = null;

	function updateGameState() {
		if (!game) return;

		gameState = {
			ballX: game.ball_x,
			ballY: game.ball_y,
			leftPaddleY: game.left_paddle_y,
			rightPaddleY: game.right_paddle_y,
			leftScore: game.left_score,
			rightScore: game.right_score
		};
	}

	function gameLoop(timestamp: number) {
		if (!game || !running) return;

		if (lastTime === null) {
			lastTime = timestamp;
		}

		const dt = (timestamp - lastTime) / 1000;
		lastTime = timestamp;

		// Update inputs
		game.left_paddle_input = getLeftInput(keys);
		game.right_paddle_input = getRightInput(keys);

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
		if (e.key === ' ' && !running && winner === -1 && game) {
			startGame();
		}

		// Rematch on space after game over
		if (e.key === ' ' && winner !== -1) {
			startGame();
		}

		// Back to menu on Escape
		if (e.key === 'Escape') {
			goto('/');
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		handleKeyUp(keys, e);
	}

	onMount(async () => {
		try {
			game = await initLocalGame();
			updateGameState();
			loading = false;
		} catch (err) {
			console.error('Failed to load game:', err);
		}

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	});

	let overlay = $derived.by(() => {
		if (loading) return 'Loading...';
		if (winner !== -1) {
			const winnerName = winner === 0 ? 'Player 1' : 'Player 2';
			return `${winnerName} Wins!\n\nPress SPACE to rematch`;
		}
		if (!running) return 'Press SPACE to start';
		return null;
	});
</script>

<div class="flex min-h-screen flex-col items-center gap-6 p-6">
	<header class="flex w-full max-w-[800px] items-center gap-6">
		<button
			class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-cyan-400"
			onclick={() => goto('/')}
		>
			← Back
		</button>
		<h1 class="text-xl font-bold text-neutral-500">Local Multiplayer</h1>
	</header>

	<main class="flex flex-1 items-center justify-center">
		<GameCanvas state={gameState} {overlay} />
	</main>

	<footer class="flex items-center gap-8 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-4">
		<div class="flex flex-col items-center gap-2">
			<span class="text-xs uppercase tracking-widest text-neutral-500">Player 1</span>
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
			<span class="text-xs uppercase tracking-widest text-neutral-500">Player 2</span>
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
	</footer>
</div>
