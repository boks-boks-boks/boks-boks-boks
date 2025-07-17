<script>
	import { isAuthenticated } from '$lib';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Boks-Boks-Boks - Storage Management System</title>
	<meta name="description" content="Organize and manage your storage boxes efficiently" />
</svelte:head>

<div class="hero">
	<div class="hero-content">
		<h1 class="hero-title">
			Welcome to <span class="brand-gradient">Boks-Boks-Boks</span>
		</h1>
		<p class="hero-description">
			Your comprehensive solution for organizing and managing storage boxes. 
			Keep track of your belongings, categorize items, and never lose track of your stored items again.
		</p>
		
		{#if $isAuthenticated}
			<div class="hero-actions">
				<button class="btn btn-primary btn-large">
					Manage Your Boxes
				</button>
			</div>
			<div class="welcome-message">
				<p class="authenticated-text">Welcome back! You are logged in and ready to organize.</p>
			</div>
		{:else}
			<div class="hero-actions">
				<button on:click={() => goto('/login')} class="btn btn-primary btn-large">
					Get Started
				</button>
				<button on:click={() => goto('/register')} class="btn btn-secondary btn-large">
					Sign Up
				</button>
			</div>
		{/if}
	</div>
	<div class="hero-image">
		<div class="box-icons">
			<span class="box-icon">📦</span>
			<span class="box-icon">🗃️</span>
			<span class="box-icon">📋</span>
		</div>
	</div>
</div>

<div class="features">
	<h2 class="features-title">Why Choose Boks-Boks-Boks?</h2>
	<div class="features-grid">
		<div class="feature-card">
			<div class="feature-icon">📋</div>
			<h3>Detailed Inventory</h3>
			<p>Keep comprehensive records of all items in each box with descriptions, categories, and photos.</p>
		</div>
		<div class="feature-card">
			<div class="feature-icon">🔍</div>
			<h3>Smart Search</h3>
			<p>Quickly find any item across all your boxes with our powerful search and filtering system.</p>
		</div>
		<div class="feature-card">
			<div class="feature-icon">📊</div>
			<h3>Organization Tools</h3>
			<p>Categorize boxes by room, type, or custom labels to maintain perfect organization.</p>
		</div>
		<div class="feature-card">
			<div class="feature-icon">🏷️</div>
			<h3>Label System</h3>
			<p>Generate printable labels and QR codes to physically mark your boxes for easy identification.</p>
		</div>
	</div>
</div>

{#if !$isAuthenticated}
	<div class="cta-section">
		<div class="cta-content">
			<h2>Ready to Get Organized?</h2>
			<p>Join thousands of users who have transformed their storage with Boks-Boks-Boks</p>
			<div class="auth-links">
				<a href="/login" class="btn btn-primary btn-large">
					Login
				</a>
				<a href="/register" class="btn btn-secondary btn-large">
					Register
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: center;
		min-height: 60vh;
		margin-bottom: 4rem;
	}

	.hero-content {
		max-width: 500px;
	}

	.hero-title {
		font-size: 3rem;
		font-weight: 800;
		line-height: 1.1;
		margin: 0 0 1.5rem 0;
		color: #1f2937;
	}

	.brand-gradient {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		font-size: 1.25rem;
		color: #6b7280;
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.welcome-message {
		margin-top: 1rem;
	}

	.authenticated-text {
		color: #059669;
		font-weight: 600;
		font-size: 1.1rem;
		margin: 0;
	}

	.hero-image {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.box-icons {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 3rem;
		border-radius: 20px;
		box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
	}

	.box-icon {
		font-size: 4rem;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	.features {
		margin-bottom: 4rem;
	}

	.features-title {
		text-align: center;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 3rem 0;
		color: #1f2937;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}

	.feature-card p {
		margin: 0;
		color: #6b7280;
		line-height: 1.6;
	}

	.cta-section {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 3rem 2rem;
		border-radius: 20px;
		margin-bottom: 2rem;
		text-align: center;
	}

	.cta-content h2 {
		color: white;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
	}

	.cta-content p {
		color: white;
		font-size: 1.25rem;
		opacity: 0.9;
		margin: 0 0 2rem 0;
	}

	.auth-links {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
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

	.btn-primary:hover {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.btn-secondary {
		background: white;
		color: #3b82f6;
		border: 2px solid #3b82f6;
	}

	.btn-secondary:hover {
		background: #3b82f6;
		color: white;
		transform: translateY(-1px);
	}

	.btn-large {
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	@media (max-width: 768px) {
		.hero {
			grid-template-columns: 1fr;
			gap: 2rem;
			text-align: center;
		}

		.hero-title {
			font-size: 2.5rem;
		}

		.hero-description {
			font-size: 1.1rem;
		}

		.hero-actions {
			justify-content: center;
			flex-wrap: wrap;
		}

		.features-title {
			font-size: 2rem;
		}

		.cta-content h2 {
			font-size: 2rem;
		}

		.auth-links {
			flex-direction: column;
			align-items: center;
		}

		.btn-large {
			width: 100%;
			max-width: 300px;
		}
	}
</style>