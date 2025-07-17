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

<svelte:head>
	<title>Register - Boks-Boks-Boks</title>
</svelte:head>

<div class="register-container">
	<div class="register-card">
		<div class="register-header">
			<div class="register-icon">📦</div>
			<h1>Create Account</h1>
			<p>Join Boks-Boks-Boks and start organizing</p>
		</div>
		
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
		
		<form on:submit|preventDefault={handleRegister} class="register-form">
			<div class="form-group">
				<label for="username">Username</label>
				<input
					type="text"
					id="username"
					bind:value={username}
					required
					disabled={isLoading}
					placeholder="Choose a username"
				/>
			</div>
			
			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					disabled={isLoading}
					placeholder="Create a password"
				/>
			</div>
			
			<button type="submit" disabled={isLoading} class="btn btn-primary btn-full">
				{isLoading ? 'Creating Account...' : 'Create Account'}
			</button>
		</form>
		
		<div class="register-footer">
			<p>Already have an account? <a href="/login" class="link">Sign in here</a></p>
			<p><a href="/" class="link">← Back to Home</a></p>
		</div>
	</div>
</div>

<style>
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 8rem);
		padding: 2rem 1rem;
	}

	.register-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
		padding: 3rem;
		width: 100%;
		max-width: 400px;
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

	.error-message {
		background: #fef2f2;
		color: #dc2626;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #fecaca;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.success-message {
		background: #f0fdf4;
		color: #166534;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #bbf7d0;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.register-form {
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
		font-family: inherit;
	}

	.form-group input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-group input:disabled {
		background-color: #f9fafb;
		cursor: not-allowed;
	}

	.form-group input::placeholder {
		color: #9ca3af;
	}

	.btn {
		display: inline-block;
		padding: 0.875rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		text-align: center;
		transition: all 0.2s ease;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		font-family: inherit;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.btn-primary:disabled {
		background: #9ca3af;
		cursor: not-allowed;
		transform: none;
	}

	.btn-full {
		width: 100%;
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
		.register-card {
			padding: 2rem 1.5rem;
		}

		.register-header h1 {
			font-size: 1.75rem;
		}
	}
</style>