<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated, currentUser } from '$lib';
	import { goto } from '$app/navigation';
	import { Button, FeatureCard, BoxCard, Alert, ItemSearch } from '$lib';
	import CreateBoxModal from '$lib/components/CreateBoxModal.svelte';
	import { getBoxes, type Box } from '$lib/api';

	let boxes: Box[] = [];
	let loading = false;
	let error = '';
	let loadingPromise: Promise<void> | null = null; // Track loading promise to prevent duplicates
	let showCreateModal = false;

	function openCreateModal() {
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
	}

	function handleBoxCreated(event: CustomEvent<Box>) {
		const newBox = event.detail;
		console.log('New box created:', newBox);
		
		// Add the new box to the beginning of the list
		boxes = [newBox, ...boxes];
		
		// Close the modal
		closeCreateModal();
	}

	function handleSearchBoxSelect(event: CustomEvent<{ box: any }>) {
		const box = event.detail.box;
		console.log('Box selected from search:', box);
		// Navigate to the box page
		goto(`/box/${box.id}/items`);
	}

	function handleSearchInput(event: CustomEvent<{ query: string }>) {
		// Optional: You can track search queries here
		console.log('Search query:', event.detail.query);
	}

	async function loadBoxes() {
		if (!$isAuthenticated) return;
		
		if (loadingPromise) {
			console.log('Already loading boxes, waiting for existing request...');
			return loadingPromise; // Return existing promise if already loading
		}
		
		loading = true;
		error = '';
		
		loadingPromise = (async () => {
			try {
				console.log('Loading boxes...');
				const response = await getBoxes();
				console.log('Boxes response:', response);
				boxes = response || []; // Ensure it's always an array
				console.log('Boxes length:', boxes.length);
			} catch (err) {
				console.error('Failed to load boxes:', err);
				error = 'Failed to load your boxes. Please try again.';
				boxes = []; // Ensure empty array on error
			} finally {
				loading = false;
				loadingPromise = null; // Clear the promise
			}
		})();
		
		return loadingPromise;
	}

	onMount(() => {
		if ($isAuthenticated) {
			loadBoxes();
		}
	});

	// Watch for authentication changes, but prevent multiple calls
	let hasLoadedOnce = false;
	$: if ($isAuthenticated && !hasLoadedOnce && !loading) {
		hasLoadedOnce = true;
		loadBoxes();
	}
</script>

<svelte:head>
	<title>Boks-Boks-Boks - Storage Management System</title>
	<meta name="description" content="Organize and manage your storage boxes efficiently" />
</svelte:head>

{#if $isAuthenticated}
	<!-- User Dashboard -->
	<div class="dashboard">
		<div class="dashboard-header">
			<div class="header-content">
				<h1 class="dashboard-title">
					Welcome back, <span class="user-name">{$currentUser?.username || 'User'}</span>! 👋
				</h1>
				<p class="dashboard-subtitle">Manage your storage boxes and keep track of your belongings</p>
			</div>
			<div class="header-actions">
				<ItemSearch 
					placeholder="Find items in your boxes..."
					on:select={handleSearchBoxSelect}
					on:input={handleSearchInput}
					maxResults={5}
				/>
			</div>
		</div>

		{#if loading}
			<div class="loading-state">
				<div class="loading-spinner"></div>
				<p>Loading your boxes...</p>
			</div>
		{:else if error}
			<Alert type="error">{error}</Alert>
		{:else if boxes.length > 0}
			<div class="boxes-section">
				<div class="section-header">
					<h2>Your Boxes ({boxes.length})</h2>
					<Button variant="primary" size="medium" on:click={openCreateModal}>
						+ Add New Box
					</Button>
				</div>
				<div class="boxes-grid">
					{#each boxes as box (box.id)}
						<BoxCard {box} href="/box/{box.id}/items" />
					{/each}
				</div>
			</div>
		{:else}
			<!-- Empty state when user has no boxes -->
			<div class="empty-boxes-state">
				<div class="empty-content">
					<div class="empty-icon">📦</div>
					<h3>Welcome to your storage manager!</h3>
					<p>You don't have any boxes yet. Start organizing by creating your first storage box to keep track of your belongings.</p>
					<div class="empty-actions">
						<Button variant="primary" size="large" on:click={openCreateModal}>
							<span class="button-icon">+</span>
							Create Your First Box
						</Button>
					</div>
					<div class="getting-started">
						<h4>Getting started is easy:</h4>
						<ul class="steps-list">
							<li>📦 Create a box (e.g., "Kitchen Items", "Winter Clothes")</li>
							<li>📝 Add items to your box with quantities</li>
							<li>🔍 Search and organize your belongings effortlessly</li>
						</ul>
					</div>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<!-- Landing Page for Unauthenticated Users -->
	<div class="hero">
		<div class="hero-content">
			<h1 class="hero-title">
				Welcome to <span class="brand-gradient">Boks-Boks-Boks</span>
			</h1>
			<p class="hero-description">
				Your comprehensive solution for organizing and managing storage boxes. 
				Keep track of your belongings, categorize items, and never lose track of your stored items again.
			</p>
			
			<div class="hero-actions">
				<Button variant="primary" size="large" on:click={() => goto('/login')}>
					Get Started
				</Button>
				<Button variant="secondary" size="large" on:click={() => goto('/register')}>
					Sign Up
				</Button>
			</div>
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

<!-- Create Box Modal -->
<CreateBoxModal 
	isOpen={showCreateModal} 
	on:close={closeCreateModal}
	on:boxCreated={handleBoxCreated}
/>

<style>
	/* Dashboard Styles */
	.dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 0;
	}
	
	.dashboard-header {
		margin-bottom: 3rem;
	}

	.header-content {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header-actions {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}
	
	.dashboard-title {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: #1f2937;
	}
	
	.user-name {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.dashboard-subtitle {
		font-size: 1.125rem;
		color: #6b7280;
		margin: 0;
	}
	
	.loading-state {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f4f6;
		border-top: 4px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem auto;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.boxes-section {
		margin-bottom: 3rem;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
	
	.section-header h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}
	
	.boxes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		max-width: 100%;
	}
	
	.empty-boxes-state {
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		border-radius: 1rem;
		padding: 4rem 2rem;
		text-align: center;
		margin: 2rem 0;
		border: 2px dashed #cbd5e1;
	}
	
	.empty-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.6;
	}

	.empty-boxes-state .empty-icon {
		font-size: 5rem;
		margin-bottom: 1.5rem;
		opacity: 0.8;
	}

	.empty-boxes-state h3 {
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.empty-boxes-state p {
		font-size: 1.125rem;
		color: #4b5563;
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}

	.empty-actions {
		margin-bottom: 3rem;
	}

	.button-icon {
		font-size: 1.2rem;
		margin-right: 0.5rem;
	}

	.getting-started {
		background: white;
		border-radius: 0.75rem;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		text-align: left;
	}

	.getting-started h4 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #374151;
		margin: 0 0 1rem 0;
		text-align: center;
	}

	.steps-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.steps-list li {
		padding: 0.75rem 0;
		font-size: 1rem;
		color: #4b5563;
		border-bottom: 1px solid #f3f4f6;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.steps-list li:last-child {
		border-bottom: none;
	}

	/* Landing Page Styles */
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
		/* Dashboard Mobile Styles */
		.dashboard {
			padding: 1rem 0;
		}

		.header-content {
			margin-bottom: 1.5rem;
		}

		.header-actions {
			margin-bottom: 0.5rem;
		}
		
		.dashboard-title {
			font-size: 2rem;
		}
		
		.dashboard-subtitle {
			font-size: 1rem;
		}
		
		.section-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}
		
		.boxes-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
		
		.empty-boxes-state {
			padding: 2rem 1rem;
			margin: 1rem 0;
		}
		
		.empty-boxes-state .empty-icon {
			font-size: 4rem;
		}
		
		.empty-boxes-state h3 {
			font-size: 1.75rem;
		}
		
		.empty-boxes-state p {
			font-size: 1rem;
		}
		
		.getting-started {
			padding: 1.5rem;
		}
		
		.getting-started h4 {
			font-size: 1.125rem;
		}
		
		.steps-list li {
			font-size: 0.875rem;
			padding: 0.5rem 0;
		}

		/* Landing Page Mobile Styles */
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

	@media (max-width: 480px) {
		.boxes-grid {
			grid-template-columns: 1fr;
		}
		
		.dashboard-title {
			font-size: 1.75rem;
		}
	}
</style>