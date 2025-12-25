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
		}, 1000 / 60);
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

<div class="flex min-h-screen flex-col items-center gap-6 p-6">
	<header class="flex w-full max-w-[800px] items-center gap-6">
		<button
			class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-red-500 hover:text-red-500"
			onclick={() => goto('/online')}
		>
			← Leave
		</button>
		<h1 class="flex-1 text-xl font-bold text-neutral-500">Room: {code}</h1>
		{#if side}
			<span
				class="rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wide {side === 'left'
					? 'border border-cyan-400/30 bg-cyan-400/15 text-cyan-400'
					: 'border border-yellow-400/30 bg-yellow-400/15 text-yellow-400'}"
			>
				You: {side === 'left' ? 'Left' : 'Right'}
			</span>
		{/if}
	</header>

	<main class="flex flex-1 items-center justify-center">
		<GameCanvas state={gameState} {overlay} countdown={displayCountdown} playerSide={side} />
	</main>

	<footer class="flex items-center gap-8 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-4">
		{#if side === 'left'}
			<div class="flex flex-col items-center gap-2">
				<span class="text-xs uppercase tracking-widest text-neutral-500">Your controls</span>
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
		{:else if side === 'right'}
			<div class="flex flex-col items-center gap-2">
				<span class="text-xs uppercase tracking-widest text-neutral-500">Your controls</span>
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
