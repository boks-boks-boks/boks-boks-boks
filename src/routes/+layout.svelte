<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { isAuthenticated, isHydrationComplete } from '$lib/stores/auth';
	import { translateStore } from '$lib/strings';
	import { getUserProfile } from '$lib';	
	import LangSwitcher from '$lib/components/LangSwitcher.svelte';

	interface Props {
		data: any
	}
	
	let { data }: Props = $props()
	let serverIsAuthenticated = $derived(data?.isAuthenticated ?? false);
	// After hydration, prioritize client-side auth state over server-side
	let authState = $derived($isHydrationComplete ? $isAuthenticated : serverIsAuthenticated);
	let username: string | null = $state(null)

	$effect(() => {
		if (!username && $isAuthenticated) {
			getUserProfile().then(userProfile => {
				username = userProfile.username
			})
		}
	})
</script>

<div class="app">
	<header class="header">
		<nav class="nav">
			<div class="nav-brand">
				<a href="/" class="brand-link">
					<span class="brand-icon">📦</span>
					<span class="brand-text">{$translateStore('brand')}</span>
				</a>
			</div>
			<div class="nav-links">
				<LangSwitcher />
				{#if authState === true}
					<a href="/" class="nav-link" class:active={$page.url.pathname === '/'}>
						{$translateStore('boxes')}
					</a>
					<a href="/labels" class="nav-link" class:active={$page.url.pathname === '/labels'}>
						{$translateStore('labels')}
					</a>
					<a href="/users/{username}" class="nav-link" class:active={$page.url.pathname.startsWith('/users/')}>
						{$translateStore('profile')}
					</a>
				{:else}
					<a href="/" class="nav-link" class:active={$page.url.pathname === '/'}>
						{$translateStore('home')}
					</a>
					<a href="/login" class="nav-link" class:active={$page.url.pathname === '/login'}>
						{$translateStore('login')}
					</a>
					<a href="/register" class="nav-link" class:active={$page.url.pathname === '/register'}>
						{$translateStore('register')}
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
			<p>&copy; 2025 {$translateStore('brand')} - {$translateStore('footer')} - <a class="author" href="https://github.com/viastolfi">{$translateStore('author')}</a></p>
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
		font-family: inherit;
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
