<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { PongTransport, type ConnectionStatus } from '$lib/game/transport';

	let mode: 'select' | 'creating' | 'joining' = $state('select');
	let roomCode = $state('');
	let joinCode = $state('');
	let status: ConnectionStatus = $state('connecting');
	let error = $state<string | null>(null);
	let transport: PongTransport | null = null;

	function createRoom() {
		mode = 'creating';
		error = null;

		transport = new PongTransport({
			onStatusChange: (s) => {
				status = s;
				if (s === 'disconnected') {
					error = 'Connection lost. Please try again.';
					mode = 'select';
				}
			},
			onRoomCode: (code) => {
				roomCode = code;
			},
			onSideAssigned: (side) => {
				goto(`/online/${roomCode}?side=${side}&host=true`);
			},
			onCountdown: () => {},
			onGameState: () => {},
			onGameOver: () => {}
		});

		transport.createRoom().catch((err) => {
			console.error('Failed to create room:', err);
			error = 'Failed to connect to server. Is it running?';
			mode = 'select';
		});
	}

	function joinRoom() {
		if (!joinCode.trim() || joinCode.trim().length !== 6) {
			error = 'Please enter a valid 6-character room code';
			return;
		}

		mode = 'joining';
		error = null;
		const code = joinCode.trim().toUpperCase();

		transport = new PongTransport({
			onStatusChange: (s) => {
				status = s;
				if (s === 'join_failed') {
					error = 'Room not found. Check the code and try again.';
					mode = 'select';
				} else if (s === 'disconnected') {
					error = 'Connection lost. Please try again.';
					mode = 'select';
				}
			},
			onRoomCode: () => {},
			onSideAssigned: (side) => {
				goto(`/online/${code}?side=${side}&host=false`);
			},
			onCountdown: () => {},
			onGameState: () => {},
			onGameOver: () => {}
		});

		transport.joinRoom(code).catch((err) => {
			console.error('Failed to join room:', err);
			error = 'Failed to connect to server. Is it running?';
			mode = 'select';
		});
	}

	function cancel() {
		if (transport) {
			transport.close();
			transport = null;
		}
		mode = 'select';
		roomCode = '';
		error = null;
	}

	onDestroy(() => {
		if (transport) {
			transport.close();
		}
	});
</script>

<div class="flex min-h-screen flex-col items-center gap-8 p-6">
	<header class="flex w-full max-w-[500px] items-center gap-6">
		<button
			class="cursor-pointer rounded-md border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-sm text-white transition-all hover:border-cyan-400"
			onclick={() => goto('/')}
		>
			← Back
		</button>
		<h1 class="text-xl font-bold text-neutral-500">Online Multiplayer</h1>
	</header>

	<main class="flex flex-1 w-full max-w-[500px] items-center justify-center">
		{#if mode === 'select'}
			<div class="flex w-full flex-col gap-6">
				<button
					class="flex cursor-pointer items-center gap-5 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-6 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
					onclick={createRoom}
				>
					<span class="text-3xl">✨</span>
					<span class="flex flex-col gap-1">
						<span class="text-lg font-bold text-white">Create Room</span>
						<span class="text-xs text-neutral-500">Get a code to share with a friend</span>
					</span>
				</button>

				<div class="flex items-center gap-4 text-sm text-neutral-500">
					<div class="h-px flex-1 bg-neutral-800"></div>
					<span>or</span>
					<div class="h-px flex-1 bg-neutral-800"></div>
				</div>

				<div class="flex flex-col gap-3">
					<label class="text-sm text-neutral-500" for="join-code">Join with code</label>
					<div class="flex gap-3">
						<input
							id="join-code"
							type="text"
							class="flex-1 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-5 py-4 text-center text-xl font-bold uppercase tracking-[0.2em] text-white placeholder:text-neutral-700 focus:border-cyan-400 focus:outline-none"
							placeholder="ABCD12"
							maxlength="6"
							bind:value={joinCode}
							onkeydown={(e) => e.key === 'Enter' && joinRoom()}
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
					<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-500">
						{error}
					</div>
				{/if}
			</div>
		{:else if mode === 'creating'}
			<div class="flex flex-col items-center gap-6 rounded-xl border border-neutral-800 bg-[#0a0a0a] p-12 text-center">
				{#if roomCode}
					<div class="text-xs uppercase tracking-widest text-neutral-500">Your room code</div>
					<div class="text-5xl font-bold tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
						{roomCode}
					</div>
					<div class="text-sm text-neutral-500">Share this code with your friend</div>
				{/if}
				<div class="flex items-center gap-4 text-neutral-500">
					<div class="h-5 w-5 animate-spin rounded-full border-2 border-neutral-800 border-t-cyan-400"></div>
					<span>Waiting for opponent...</span>
				</div>
				<button
					class="cursor-pointer rounded-md border border-neutral-800 px-6 py-3 text-sm text-neutral-500 transition-all hover:border-red-500 hover:text-red-500"
					onclick={cancel}
				>
					Cancel
				</button>
			</div>
		{:else if mode === 'joining'}
			<div class="flex flex-col items-center gap-6 rounded-xl border border-neutral-800 bg-[#0a0a0a] p-12 text-center">
				<div class="flex items-center gap-4 text-neutral-500">
					<div class="h-5 w-5 animate-spin rounded-full border-2 border-neutral-800 border-t-cyan-400"></div>
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
