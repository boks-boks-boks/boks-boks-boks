<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { isAuthenticated, currentUser } from '$lib/stores/auth';
</script>

<div class="app">
	<header class="header">
		<nav class="nav">
			<div class="nav-brand">
				<a href="/" class="brand-link">
					<span class="brand-icon">📦</span>
					<span class="brand-text">Boks-Boks-Boks</span>
				</a>
			</div>
			<div class="nav-links">
				<a href="/" class="nav-link" class:active={$page.url.pathname === '/'}>
					Home
				</a>
				{#if $isAuthenticated && $currentUser}
					<a href="/users/{$currentUser.username}" class="nav-link" class:active={$page.url.pathname.startsWith('/users/')}>
						Profile
					</a>
				{:else}
					<a href="/login" class="nav-link" class:active={$page.url.pathname === '/login'}>
						Login
					</a>
					<a href="/register" class="nav-link" class:active={$page.url.pathname === '/register'}>
						Register
					</a>
				{/if}
			</div>
		</nav>
	</header>

	<main class="main">
		<slot />
	</main>

	<footer class="footer">
		<div class="footer-content">
			<p>&copy; 2025 Boks-Boks-Boks - Your Storage Management System - <a class="author" href="https://github.com/viastolfi">Astolfi Vincent</a></p>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background-color: #f8fafc;
		color: #1f2937;
		line-height: 1.6;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 4rem;
	}

	.nav-brand {
		display: flex;
		align-items: center;
	}

	.brand-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: #1f2937;
		font-weight: 700;
		font-size: 1.25rem;
	}

	.brand-icon {
		font-size: 1.5rem;
	}

	.brand-text {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-link {
		text-decoration: none;
		color: #6b7280;
		font-weight: 500;
		transition: color 0.2s ease;
		position: relative;
	}

	.nav-link:hover {
		color: #3b82f6;
	}

	.nav-link.active {
		color: #3b82f6;
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: -1rem;
		left: 0;
		right: 0;
		height: 2px;
		background: #3b82f6;
	}

	.main {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		width: 100%;
	}

	.footer {
		background: #1f2937;
		color: white;
		margin-top: auto;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		text-align: center;
		font-size: 0.875rem;
		opacity: 0.8;
	}

	.author {
		color: white;
		text-decoration: none; 
		background-color: none;
	}

	@media (max-width: 768px) {
		.nav {
			padding: 0 1rem;
			height: 3.5rem;
		}

		.nav-links {
			gap: 1rem;
		}

		.brand-text {
			display: none;
		}

		.main {
			padding: 1rem;
		}
	}
</style>
