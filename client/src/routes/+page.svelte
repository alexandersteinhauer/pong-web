<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="container">
	<header class="header">
		<h1 class="title">
			<span class="title-pong">PONG</span>
			<span class="title-sub">WebTransport Edition</span>
		</h1>
	</header>

	<main class="menu">
		<button class="menu-btn local" onclick={() => goto('/local')}>
			<span class="btn-icon">🎮</span>
			<span class="btn-content">
				<span class="btn-title">Local Multiplayer</span>
				<span class="btn-desc">Two players, one keyboard</span>
			</span>
		</button>

		<button class="menu-btn online" onclick={() => goto('/online')}>
			<span class="btn-icon">🌐</span>
			<span class="btn-content">
				<span class="btn-title">Online Multiplayer</span>
				<span class="btn-desc">Play with friends worldwide</span>
			</span>
		</button>
	</main>

	<footer class="controls-hint">
		<div class="hint-group">
			<span class="hint-label">Player 1</span>
			<span class="hint-keys">W / S</span>
		</div>
		<div class="hint-divider"></div>
		<div class="hint-group">
			<span class="hint-label">Player 2</span>
			<span class="hint-keys">↑ / ↓</span>
		</div>
	</footer>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		gap: 3rem;
	}

	.header {
		text-align: center;
	}

	.title {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
	}

	.title-pong {
		font-size: 5rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		background: linear-gradient(180deg, #fff 0%, #888 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: 0 0 60px rgba(255, 255, 255, 0.3);
	}

	.title-sub {
		font-size: 0.875rem;
		font-weight: 400;
		letter-spacing: 0.2em;
		color: var(--color-accent);
		text-transform: uppercase;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
		max-width: 400px;
	}

	.menu-btn {
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

	.menu-btn:hover {
		border-color: var(--color-accent);
		box-shadow: 0 0 30px var(--color-accent-glow);
		transform: translateY(-2px);
	}

	.menu-btn:active {
		transform: translateY(0);
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

	.controls-hint {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 1rem 2rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
	}

	.hint-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.hint-label {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.hint-keys {
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-accent);
	}

	.hint-divider {
		width: 1px;
		height: 2rem;
		background: var(--color-border);
	}
</style>
