<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import GameCanvas from '$lib/components/GameCanvas.svelte';
	import { PongTransport, type ConnectionStatus, type GameState } from '$lib/game/transport';
	import { FIELD_HEIGHT, PADDLE_HEIGHT } from '$lib/game/wasm';

	const code = $derived($page.params.code ?? '');
	const isHost = $derived($page.url.searchParams.get('host') === 'true');
	const initialSide = $derived($page.url.searchParams.get('side') as 'left' | 'right' | null);

	let transport: PongTransport | null = null;
	let status = $state<ConnectionStatus>('connecting');
	let side: 'left' | 'right' | null = $state(null);
	let countdown: number | null = $state(null);
	let winner: number | null = $state(null);

	let gameState = $state<GameState>({
		ballX: 395,
		ballY: 295,
		leftPaddleY: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
		rightPaddleY: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2,
		leftScore: 0,
		rightScore: 0
	});

	// Key state for input
	const keys = { up: false, down: false };

	function handleKeyDown(e: KeyboardEvent) {
		if (side === 'left') {
			if (e.key === 'w' || e.key === 'W') {
				keys.up = true;
				e.preventDefault();
			}
			if (e.key === 's' || e.key === 'S') {
				keys.down = true;
				e.preventDefault();
			}
		} else if (side === 'right') {
			if (e.key === 'ArrowUp') {
				keys.up = true;
				e.preventDefault();
			}
			if (e.key === 'ArrowDown') {
				keys.down = true;
				e.preventDefault();
			}
		}

		// Back to menu on Escape
		if (e.key === 'Escape') {
			goto('/online');
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (side === 'left') {
			if (e.key === 'w' || e.key === 'W') keys.up = false;
			if (e.key === 's' || e.key === 'S') keys.down = false;
		} else if (side === 'right') {
			if (e.key === 'ArrowUp') keys.up = false;
			if (e.key === 'ArrowDown') keys.down = false;
		}
	}

	function getInput(): number {
		let input = 0;
		if (keys.up) input -= 1;
		if (keys.down) input += 1;
		return input;
	}

	let inputInterval: ReturnType<typeof setInterval> | null = null;

	function startInputLoop() {
		if (inputInterval) return;
		inputInterval = setInterval(() => {
			if (transport && status === 'playing') {
				transport.sendInput(getInput());
			}
		}, 1000 / 60); // 60 Hz
	}

	function stopInputLoop() {
		if (inputInterval) {
			clearInterval(inputInterval);
			inputInterval = null;
		}
	}

	function connect() {
		transport = new PongTransport({
			onStatusChange: (s) => {
				status = s;
				if (s === 'playing') {
					startInputLoop();
				} else if (s === 'game_over' || s === 'opponent_left' || s === 'disconnected') {
					stopInputLoop();
				}
			},
			onRoomCode: () => {},
			onSideAssigned: (s) => {
				side = s;
			},
			onCountdown: (seconds) => {
				countdown = seconds;
			},
			onGameState: (state) => {
				gameState = state;
			},
			onGameOver: (w) => {
				winner = w;
			}
		});

		// If we already have side info from URL, use it
		if (initialSide) {
			side = initialSide;
		}

		if (isHost) {
			transport.createRoom().catch((err) => {
				console.error('Failed to reconnect:', err);
				goto('/online');
			});
		} else {
			transport.joinRoom(code).catch((err) => {
				console.error('Failed to reconnect:', err);
				goto('/online');
			});
		}
	}

	onMount(() => {
		connect();

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	});

	onDestroy(() => {
		stopInputLoop();
		if (transport) {
			transport.close();
		}
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
	});

	let overlay = $derived.by(() => {
		if (status === 'connecting') return 'Connecting...';
		if (status === 'waiting') return 'Waiting for opponent...';
		if (status === 'opponent_left') return 'Opponent disconnected\n\nPress ESC for menu';
		if (status === 'disconnected') return 'Connection lost\n\nPress ESC for menu';
		if (status === 'game_over' && winner !== null) {
			const isWinner = (winner === 0 && side === 'left') || (winner === 1 && side === 'right');
			return isWinner ? 'You Win!\n\nPress ESC for menu' : 'You Lose!\n\nPress ESC for menu';
		}
		return null;
	});

	let displayCountdown = $derived(status === 'countdown' ? countdown : null);
</script>

<div class="container">
	<header class="header">
		<button class="back-btn" onclick={() => goto('/online')}>← Leave</button>
		<h1 class="title">Room: {code}</h1>
		{#if side}
			<span class="side-badge" class:left={side === 'left'} class:right={side === 'right'}>
				You: {side === 'left' ? 'Left' : 'Right'}
			</span>
		{/if}
	</header>

	<main class="game-area">
		<GameCanvas state={gameState} {overlay} countdown={displayCountdown} playerSide={side} />
	</main>

	<footer class="controls">
		{#if side === 'left'}
			<div class="control-hint">
				<span class="hint-label">Your controls</span>
				<div class="keys">
					<kbd>W</kbd>
					<kbd>S</kbd>
				</div>
			</div>
		{:else if side === 'right'}
			<div class="control-hint">
				<span class="hint-label">Your controls</span>
				<div class="keys">
					<kbd>↑</kbd>
					<kbd>↓</kbd>
				</div>
			</div>
		{/if}
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
		border-color: #ef4444;
		color: #ef4444;
	}

	.title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: var(--color-text-muted);
		flex: 1;
	}

	.side-badge {
		padding: 0.375rem 0.75rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.side-badge.left {
		background: rgba(34, 211, 238, 0.15);
		color: var(--color-accent);
		border: 1px solid rgba(34, 211, 238, 0.3);
	}

	.side-badge.right {
		background: rgba(250, 204, 21, 0.15);
		color: var(--color-ball);
		border: 1px solid rgba(250, 204, 21, 0.3);
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

	.control-hint {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.hint-label {
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
</style>

