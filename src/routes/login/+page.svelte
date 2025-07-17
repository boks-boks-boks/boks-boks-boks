<script>
	import { login, setToken } from '$lib';
	import { goto } from '$app/navigation';
	
	let username = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';

	async function handleLogin() {
		if (!username || !password) {
			errorMessage = 'Please enter both username and password';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const response = await login({ username, password });
			setToken(response.token);
			// Redirect to home page after successful login
			goto('/');
		} catch (error) {
			errorMessage = 'Login failed. Please check your credentials.';
			console.error('Login error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div>
	<h1>Login</h1>
	
	{#if errorMessage}
		<div class="error-message">
			{errorMessage}
		</div>
	{/if}
	
	<form on:submit|preventDefault={handleLogin}>
		<div>
			<label for="username">Username:</label>
			<input
				type="text"
				id="username"
				bind:value={username}
				required
				disabled={isLoading}
			/>
		</div>
		
		<div>
			<label for="password">Password:</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				disabled={isLoading}
			/>
		</div>
		
		<button type="submit" disabled={isLoading}>
			{isLoading ? 'Logging in...' : 'Login'}
		</button>
	</form>
	
	<div>
		<p>Don't have an account? <a href="/register">Register here</a></p>
		<p><a href="/">Back to Home</a></p>
	</div>
</div>