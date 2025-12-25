<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { PongTransport, type ConnectionStatus, type GameState } from '$lib/game/transport';

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
				// Game is starting, navigate to game room
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
				// Game is starting, navigate to game room
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

<div class="container">
	<header class="header">
		<button class="back-btn" onclick={() => goto('/')}>← Back</button>
		<h1 class="title">Online Multiplayer</h1>
	</header>

	<main class="content">
		{#if mode === 'select'}
			<div class="options">
				<button class="option-btn create" onclick={createRoom}>
					<span class="btn-icon">✨</span>
					<span class="btn-content">
						<span class="btn-title">Create Room</span>
						<span class="btn-desc">Get a code to share with a friend</span>
					</span>
				</button>

				<div class="divider">
					<span>or</span>
				</div>

				<div class="join-form">
					<label class="join-label" for="join-code">Join with code</label>
					<div class="join-input-group">
						<input
							id="join-code"
							type="text"
							class="join-input"
							placeholder="ABCD12"
							maxlength="6"
							bind:value={joinCode}
							onkeydown={(e) => e.key === 'Enter' && joinRoom()}
						/>
						<button class="join-btn" onclick={joinRoom}>Join</button>
					</div>
				</div>

				{#if error}
					<div class="error">{error}</div>
				{/if}
			</div>
		{:else if mode === 'creating'}
			<div class="waiting-screen">
				<div class="waiting-card">
					{#if roomCode}
						<div class="room-code-label">Your room code</div>
						<div class="room-code">{roomCode}</div>
						<div class="room-code-hint">Share this code with your friend</div>
					{/if}
					<div class="waiting-status">
						<div class="spinner"></div>
						<span>Waiting for opponent...</span>
					</div>
					<button class="cancel-btn" onclick={cancel}>Cancel</button>
				</div>
			</div>
		{:else if mode === 'joining'}
			<div class="waiting-screen">
				<div class="waiting-card">
					<div class="waiting-status">
						<div class="spinner"></div>
						<span>Joining room...</span>
					</div>
					<button class="cancel-btn" onclick={cancel}>Cancel</button>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		gap: 2rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
		max-width: 500px;
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

	.content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 500px;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	.option-btn {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem 2rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.option-btn:hover {
		border-color: var(--color-accent);
		box-shadow: 0 0 30px var(--color-accent-glow);
		transform: translateY(-2px);
	}

	.btn-icon {
		font-size: 2rem;
	}

	.btn-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.btn-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.btn-desc {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--color-border);
	}

	.join-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.join-label {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.join-input-group {
		display: flex;
		gap: 0.75rem;
	}

	.join-input {
		flex: 1;
		padding: 1rem 1.25rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		color: var(--color-text);
		font-family: inherit;
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		text-align: center;
	}

	.join-input::placeholder {
		color: var(--color-text-muted);
		opacity: 0.5;
	}

	.join-input:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.join-btn {
		padding: 1rem 2rem;
		background: var(--color-accent);
		border: none;
		border-radius: 8px;
		color: #000;
		font-family: inherit;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.join-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.error {
		padding: 1rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 8px;
		color: #ef4444;
		font-size: 0.875rem;
		text-align: center;
	}

	.waiting-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.waiting-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 3rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		text-align: center;
	}

	.room-code-label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.room-code {
		font-size: 3rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		color: var(--color-accent);
		text-shadow: 0 0 30px var(--color-accent-glow);
	}

	.room-code-hint {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.waiting-status {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: var(--color-text-muted);
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.cancel-btn {
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		color: var(--color-text-muted);
		font-family: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.cancel-btn:hover {
		border-color: #ef4444;
		color: #ef4444;
	}
</style>

