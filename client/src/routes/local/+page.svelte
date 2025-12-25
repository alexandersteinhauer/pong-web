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

	let game: Game | null = $state(null);
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

<div class="container">
	<header class="header">
		<button class="back-btn" onclick={() => goto('/')}>← Back</button>
		<h1 class="title">Local Multiplayer</h1>
	</header>

	<main class="game-area">
		<GameCanvas state={gameState} {overlay} />
	</main>

	<footer class="controls">
		<div class="player-controls">
			<span class="player-label">Player 1</span>
			<div class="keys">
				<kbd>W</kbd>
				<kbd>S</kbd>
			</div>
		</div>
		<div class="divider"></div>
		<div class="player-controls">
			<span class="player-label">Player 2</span>
			<div class="keys">
				<kbd>↑</kbd>
				<kbd>↓</kbd>
			</div>
		</div>
	</footer>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		gap: 1.5rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
		max-width: 800px;
	}

	.back-btn {
		padding: 0.5rem 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		color: var(--color-text);
		font-family: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.back-btn:hover {
		border-color: var(--color-accent);
	}

	.title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: var(--color-text-muted);
	}

	.game-area {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 1rem 2rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
	}

	.player-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.player-label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.keys {
		display: flex;
		gap: 0.5rem;
	}

	kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
		padding: 0.375rem 0.625rem;
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 4px;
		font-family: inherit;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-accent);
	}

	.divider {
		width: 1px;
		height: 3rem;
		background: var(--color-border);
	}
</style>

