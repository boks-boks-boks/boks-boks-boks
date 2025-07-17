<script>
	import { login, setToken } from '$lib';
	import { goto } from '$app/navigation';
	import { FormInput, Button, Alert, Card } from '$lib';
	
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

<svelte:head>
	<title>Login - Boks-Boks-Boks</title>
</svelte:head>

<div class="login-container">
	<Card shadow="large">
		<div class="login-header">
			<div class="login-icon">📦</div>
			<h1>Welcome Back</h1>
			<p>Sign in to your Boks-Boks-Boks account</p>
		</div>
		
		{#if errorMessage}
			<Alert type="error">{errorMessage}</Alert>
		{/if}
		
		<form on:submit|preventDefault={handleLogin} class="login-form">
			<FormInput
				id="username"
				label="Username"
				bind:value={username}
				placeholder="Enter your username"
				disabled={isLoading}
				required
			/>
			
			<FormInput
				id="password"
				type="password"
				label="Password"
				bind:value={password}
				placeholder="Enter your password"
				disabled={isLoading}
				required
			/>
			
			<Button type="submit" disabled={isLoading} variant="primary" fullWidth>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</Button>
		</form>
		
		<div class="login-footer">
			<p>Don't have an account? <a href="/register" class="link">Create one here</a></p>
			<p><a href="/" class="link">← Back to Home</a></p>
		</div>
	</Card>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 8rem);
		padding: 2rem 1rem;
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.login-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.login-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0 0 0.5rem 0;
	}

	.login-header p {
		color: #6b7280;
		margin: 0;
		font-size: 1.1rem;
	}

	.login-form {
		margin-bottom: 2rem;
	}

	.login-footer {
		text-align: center;
		border-top: 1px solid #e5e7eb;
		padding-top: 2rem;
	}

	.login-footer p {
		margin: 0.5rem 0;
		color: #6b7280;
	}

	.link {
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
	}

	.link:hover {
		color: #2563eb;
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.login-header h1 {
			font-size: 1.75rem;
		}
	}
</style>