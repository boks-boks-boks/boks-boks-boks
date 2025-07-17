<script>
	import { isAuthenticated } from '$lib';
	import { goto } from '$app/navigation';
	import { Button, FeatureCard } from '$lib';
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
				<Button variant="primary" size="large">
					Manage Your Boxes
				</Button>
			</div>
			<div class="welcome-message">
				<p class="authenticated-text">Welcome back! You are logged in and ready to organize.</p>
			</div>
		{:else}
			<div class="hero-actions">
				<Button variant="primary" size="large" on:click={() => goto('/login')}>
					Get Started
				</Button>
				<Button variant="secondary" size="large" on:click={() => goto('/register')}>
					Sign Up
				</Button>
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
		<FeatureCard 
			icon="📋"
			title="Detailed Inventory"
			description="Keep comprehensive records of all items in each box with descriptions, categories, and photos."
		/>
		<FeatureCard 
			icon="🔍"
			title="Smart Search"
			description="Quickly find any item across all your boxes with our powerful search and filtering system."
		/>
		<FeatureCard 
			icon="📊"
			title="Organization Tools"
			description="Categorize boxes by room, type, or custom labels to maintain perfect organization."
		/>
		<FeatureCard 
			icon="🏷️"
			title="Label System"
			description="Generate printable labels and QR codes to physically mark your boxes for easy identification."
		/>
	</div>
</div>

{#if !$isAuthenticated}
	<div class="cta-section">
		<div class="cta-content">
			<h2>Ready to Get Organized?</h2>
			<p>Join thousands of users who have transformed their storage with Boks-Boks-Boks</p>
			<div class="auth-links">
				<Button variant="primary" size="large" href="/login">
					Login
				</Button>
				<Button variant="secondary" size="large" href="/register">
					Register
				</Button>
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
	}
</style>