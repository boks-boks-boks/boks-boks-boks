<script>
	import { isAuthenticated, currentUser, accessToken } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { Button, Card } from '$lib';

	let localStorageToken = '';
	let localStorageUser = '';

	if (browser) {
		localStorageToken = localStorage.getItem('auth_token') || 'Not found';
		localStorageUser = localStorage.getItem('current_user') || 'Not found';
	}

	function clearAll() {
		if (browser) {
			localStorage.clear();
			location.reload();
		}
	}
</script>

<svelte:head>
	<title>Debug Auth State - Boks-Boks-Boks</title>
</svelte:head>

<Card>
	<h1>Authentication Debug Page</h1>
	
	<div class="debug-section">
		<h2>Svelte Stores</h2>
		<p><strong>isAuthenticated:</strong> {$isAuthenticated}</p>
		<p><strong>accessToken:</strong> {$accessToken || 'null'}</p>
		<p><strong>currentUser:</strong> {JSON.stringify($currentUser) || 'null'}</p>
	</div>

	<div class="debug-section">
		<h2>LocalStorage</h2>
		<p><strong>auth_token:</strong> {localStorageToken}</p>
		<p><strong>current_user:</strong> {localStorageUser}</p>
	</div>

	<div class="debug-section">
		<h2>Actions</h2>
		<Button on:click={clearAll} variant="secondary">
			Clear All Data & Reload
		</Button>
		<Button href="/" variant="primary">
			Back to Home
		</Button>
	</div>
</Card>

<style>
	.debug-section {
		margin: 2rem 0;
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: #f9fafb;
	}

	.debug-section h2 {
		margin-top: 0;
		color: #1f2937;
	}

	.debug-section p {
		margin: 0.5rem 0;
		font-family: monospace;
		background: white;
		padding: 0.5rem;
		border-radius: 4px;
		word-break: break-all;
	}
</style>
