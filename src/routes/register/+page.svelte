<script>
	import { login, register, setToken } from '$lib';
	import { goto } from '$app/navigation';
	import { FormInput, Button, Alert, Card } from '$lib';
	import { translateStore } from '$lib/strings';
	
	let username = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	async function handleRegister() {
		if (!username || !password) {
			errorMessage = $translateStore('please_enter_credentials');
			return;
		}

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			await register({ username, password });

			successMessage = $translateStore('registration_successful');
			
			// Redirect to login page after successful registration
			setTimeout(async () => {
				const response = await login({username, password})

				const token = response.token || response.data?.token

				if (!token) {
					console.error('Full response object:', response)
					throw new Error('No token received from server')
				}

				setToken(token)

				goto("/")
			}, 200);
		} catch (error) {
			errorMessage = $translateStore('registration_failed');
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
			<h1>{$translateStore('create_account')}</h1>
			<p>{$translateStore('join_boks')}</p>
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
				label={$translateStore('username')}
				bind:value={username}
				placeholder={$translateStore('choose_username')}
				disabled={isLoading}
				required
			/>
			
			<FormInput
				id="password"
				type="password"
				label={$translateStore('password')}
				bind:value={password}
				placeholder={$translateStore('create_password')}
				disabled={isLoading}
				required
			/>
			
			<Button type="submit" disabled={isLoading} variant="primary" fullWidth>
				{isLoading ? $translateStore('creating_account') : $translateStore('create_account')}
			</Button>
		</form>
		
		<div class="register-footer">
			<p>{$translateStore('already_have_account')} <a href="/login" class="link">{$translateStore('sign_in_here')}</a></p>
			<p><a href="/" class="link">{$translateStore('back_to_home')}</a></p>
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
			font-size: 1.5rem;
		}
	}
</style>