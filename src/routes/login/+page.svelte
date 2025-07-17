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

<svelte:head>
	<title>Login - Boks-Boks-Boks</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<div class="login-icon">📦</div>
			<h1>Welcome Back</h1>
			<p>Sign in to your Boks-Boks-Boks account</p>
		</div>
		
		{#if errorMessage}
			<div class="error-message">
				{errorMessage}
			</div>
		{/if}
		
		<form on:submit|preventDefault={handleLogin} class="login-form">
			<div class="form-group">
				<label for="username">Username</label>
				<input
					type="text"
					id="username"
					bind:value={username}
					required
					disabled={isLoading}
					placeholder="Enter your username"
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
					placeholder="Enter your password"
				/>
			</div>
			
			<button type="submit" disabled={isLoading} class="btn btn-primary btn-full">
				{isLoading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
		
		<div class="login-footer">
			<p>Don't have an account? <a href="/register" class="link">Create one here</a></p>
			<p><a href="/" class="link">← Back to Home</a></p>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 8rem);
		padding: 2rem 1rem;
	}

	.login-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
		padding: 3rem;
		width: 100%;
		max-width: 400px;
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

	.error-message {
		background: #fef2f2;
		color: #dc2626;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #fecaca;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.login-form {
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
		.login-card {
			padding: 2rem 1.5rem;
		}

		.login-header h1 {
			font-size: 1.75rem;
		}
	}
</style>