<script>
	import { register } from '$lib';
	import { goto } from '$app/navigation';
	import { FormInput, Button, Alert, Card } from '$lib';
	
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

<svelte:head>
	<title>Register - Boks-Boks-Boks</title>
</svelte:head>

<div class="register-container">
	<Card shadow="large">
		<div class="register-header">
			<div class="register-icon">📦</div>
			<h1>Create Account</h1>
			<p>Join Boks-Boks-Boks and start organizing</p>
		</div>
		
		{#if errorMessage}
			<Alert type="error">{errorMessage}</Alert>
		{/if}
		
		{#if successMessage}
			<Alert type="success">{successMessage}</Alert>
		{/if}
		
		<form on:submit|preventDefault={handleRegister} class="register-form">
			<FormInput
				id="username"
				label="Username"
				bind:value={username}
				placeholder="Choose a username"
				disabled={isLoading}
				required
			/>
			
			<FormInput
				id="password"
				type="password"
				label="Password"
				bind:value={password}
				placeholder="Create a password"
				disabled={isLoading}
				required
			/>
			
			<Button type="submit" disabled={isLoading} variant="primary" fullWidth>
				{isLoading ? 'Creating Account...' : 'Create Account'}
			</Button>
		</form>
		
		<div class="register-footer">
			<p>Already have an account? <a href="/login" class="link">Sign in here</a></p>
			<p><a href="/" class="link">← Back to Home</a></p>
		</div>
	</Card>
</div>

<style>
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 8rem);
		padding: 2rem 1rem;
	}

	.register-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.register-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.register-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0 0 0.5rem 0;
	}

	.register-header p {
		color: #6b7280;
		margin: 0;
		font-size: 1.1rem;
	}

	.register-form {
		margin-bottom: 2rem;
	}

	.register-footer {
		text-align: center;
		border-top: 1px solid #e5e7eb;
		padding-top: 2rem;
	}

	.register-footer p {
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
		.register-header h1 {
			font-size: 1.75rem;
		}
	}
</style>