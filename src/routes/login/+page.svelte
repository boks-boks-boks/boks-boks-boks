<script>
	import { login, setToken} from '$lib';
	import { goto } from '$app/navigation';
	import { FormInput, Button, Alert, Card } from '$lib';
	import { translateStore } from '$lib/strings';
	
	let username = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';

	async function handleLogin() {
		if (!username || !password) {
			errorMessage = $translateStore('please_enter_credentials');
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			console.log('Starting login process...');
			const response = await login({ username, password });
			console.log('Login response:', response);
			
			// Extract token from the correct location in response
			const token = response.token || response.data?.token;
			console.log('Extra	cted token:', token);
			
			if (!token) {
				console.error('Full response object:', response);
				throw new Error('No token received from server');
			}
			
			setToken(token);
			console.log('Token set in store');
		
			await new Promise(resolve => setTimeout(resolve, 100));
			// Navigate to home page
			goto('/');
		} catch (error) {
			errorMessage = $translateStore('login_failed');
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
			<h1>{$translateStore('welcome_back')}</h1>
			<p>{$translateStore('sign_in_account')}</p>
		</div>
		
		{#if errorMessage}
			<Alert type="error">{errorMessage}</Alert>
		{/if}
		
		<form on:submit|preventDefault={handleLogin} class="login-form">
			<FormInput
				id="username"
				label={$translateStore('username')}
				bind:value={username}
				placeholder={$translateStore('enter_username')}
				disabled={isLoading}
				required
			/>
			
			<FormInput
				id="password"
				type="password"
				label={$translateStore('password')}
				bind:value={password}
				placeholder={$translateStore('enter_password')}
				disabled={isLoading}
				required
			/>
			
			<Button type="submit" disabled={isLoading} variant="primary" fullWidth>
				{isLoading ? $translateStore('signing_in') : $translateStore('sign_in')}
			</Button>
		</form>
		
		<div class="login-footer">
			<p>{$translateStore('no_account')} <a href="/register" class="link">{$translateStore('create_account')}</a></p>
			<p><a href="/" class="link">{$translateStore('back_to_home')}</a></p>
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
			font-size: 1.5rem;
		}
	}
</style>
