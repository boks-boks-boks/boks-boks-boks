<script>
	import { register } from '$lib';
	import { goto } from '$app/navigation';
	
	let username = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	async function handleRegister() {
		if (!username || !password) {
			errorMessage = 'Please enter both username and password';
			return;
		}

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			await register({ username, password });

			successMessage = 'Registration successful! Redirecting to login...';
			
			// Redirect to login page after successful registration
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (error) {
			errorMessage = 'Registration failed. Please try again.';
			console.error('Registration error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div>
	<h1>Register</h1>
	
	{#if errorMessage}
		<div class="error-message">
			{errorMessage}
		</div>
	{/if}
	
	{#if successMessage}
		<div class="success-message">
			{successMessage}
		</div>
	{/if}
	
	<form on:submit|preventDefault={handleRegister}>
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
			{isLoading ? 'Registering...' : 'Register'}
		</button>
	</form>
	
	<div>
		<p>Already have an account? <a href="/login">Login here</a></p>
	</div>
</div>