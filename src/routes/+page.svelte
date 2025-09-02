<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib';
	import { goto } from '$app/navigation';
	import { Button, FeatureCard, BoxCard, Alert, ItemSearch, getUserProfile } from '$lib';
	import CreateBoxModal from '$lib/components/CreateBoxModal.svelte';
	import { getBoxes, type Box } from '$lib/api';
	import { translateStore } from '$lib/strings';

	interface Props {
		data: any
	}
	
	let { data }: Props = $props()
	
	let serverIsAuthenticated = $derived(data?.isAuthenticated ?? false);
	let authState = $derived(serverIsAuthenticated || $isAuthenticated);

	let boxes: Box[] = $state([]);
	let loading = $state(true); 
	let error = $state('');
	let loadingPromise: Promise<void> | null = null;
	let showCreateModal = $state(false);
	let hasInitialized = $state(false);
	let username: string | null = $state(null)

	function openCreateModal() {
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
	}

	function handleBoxCreated(event: CustomEvent<Box>) {
		const newBox = event.detail;
		console.debug('New box created:', newBox);
		
		// Add the new box to the beginning of the list
		boxes = [newBox, ...boxes];
		
		// Close the modal
		closeCreateModal();
	}

	function handleSearchBoxSelect(event: CustomEvent<{ box: any }>) {
		const box = event.detail.box;
		console.debug('Box selected from search:', box);
		// Navigate to the box page
		goto(`/box/${box.id}/items`);
	}

	function handleSearchInput(event: CustomEvent<{ query: string }>) {
		// Optional: You can track search queries here
		console.debug('Search query:', event.detail.query);
	}

	async function loadBoxes() {
		if (!authState) {
			// If not authenticated, set loading to false and return
			loading = false;
			hasInitialized = true;
			return;
		}
		
		if (loadingPromise) {
			console.debug('Already loading boxes, waiting for existing request...');
			return loadingPromise; // Return existing promise if already loading
		}
		
		loading = true;
		error = '';
		
		loadingPromise = (async () => {
			try {
				console.debug('Loading boxes...');
				const response = await getBoxes();
				console.debug('Boxes response:', response);
				boxes = response || []; // Ensure it's always an array
				console.debug('Boxes length:', boxes.length);
			} catch (err) {
				console.error('Failed to load boxes:', err);
				error = $translateStore('failed_load_boxes');
				boxes = []; // Ensure empty array on error
			} finally {
				loading = false;
				hasInitialized = true;
				loadingPromise = null;
			}
		})();
		
		return loadingPromise;
	}

	$effect(() => {
		if (authState && !hasInitialized) {
			loadBoxes();
		} else if (!authState && !hasInitialized) {
			loading = false;
			hasInitialized = true;
		}

		if (!username && $isAuthenticated) {
			getUserProfile().then(userProfile => {
				username = userProfile.username
			})
		}
	})
</script>

<svelte:head>
	<title>Boks-Boks-Boks - Storage Management System</title>
	<meta name="description" content="Organize and manage your storage boxes efficiently" />
</svelte:head>

{#if authState}
	<!-- User Dashboard -->
	<div class="dashboard">
	{#if !loading}
		<div class="dashboard-header">
			<div class="header-content">
				<h1 class="dashboard-title">
					{$translateStore('welcome_back_dashboard')} <span class="user-name">{username || $translateStore('user_default')}</span>! 👋
				</h1>
				<p class="dashboard-subtitle">{$translateStore('manage_storage_subtitle')}</p>
			</div>
			<div class="header-actions">
				<ItemSearch 
					placeholder={$translateStore('find_items_placeholder')}
					on:select={handleSearchBoxSelect}
					on:input={handleSearchInput}
					maxResults={5}
				/>
			</div>
		</div>
	{/if}

		{#if loading}
			<div class="loading-state">
				<div class="loading-spinner"></div>
				<p>{$translateStore('loading_boxes')}</p>
			</div>
		{:else if error}
			<Alert type="error">{error}</Alert>
		{:else if boxes.length > 0}
			<div class="boxes-section">
				<div class="section-header">
					<h2>{$translateStore('your_boxes')} ({boxes.length})</h2>
					<Button variant="primary" size="medium" on:click={openCreateModal}>
						{$translateStore('add_new_box')}
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
					<h3>{$translateStore('welcome_storage_manager')}</h3>
					<p>{$translateStore('no_boxes_yet')}</p>
					<div class="empty-actions">
						<Button variant="primary" size="large" on:click={openCreateModal}>
							<span class="button-icon">+</span>
							{$translateStore('create_first_box')}
						</Button>
					</div>
					<div class="getting-started">
						<h4>{$translateStore('getting_started')}</h4>
						<ul class="steps-list">
							<li>{$translateStore('step_create_box')}</li>
							<li>{$translateStore('step_add_items')}</li>
							<li>{$translateStore('step_organize')}</li>
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
				{$translateStore('hero_title_prefix')} <span class="brand-gradient">{$translateStore('brand')}</span>
			</h1>
			<p class="hero-description">
				{$translateStore('hero_description')}
			</p>
			
			<div class="hero-actions">
				<Button variant="primary" size="large" on:click={() => goto('/login')}>
					{$translateStore('get_started')}
				</Button>
				<Button variant="secondary" size="large" on:click={() => goto('/register')}>
					{$translateStore('sign_up')}
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
		<h2 class="features-title">{$translateStore('why_choose')}</h2>
		<div class="features-grid">
			<FeatureCard 
				icon="📋"
				title={$translateStore('feature_inventory_title')}
				description={$translateStore('feature_inventory_desc')}
			/>
			<FeatureCard 
				icon="🔍"
				title={$translateStore('feature_search_title')}
				description={$translateStore('feature_search_desc')}
			/>
			<FeatureCard 
				icon="📊"
				title={$translateStore('feature_org_title')}
				description={$translateStore('feature_org_desc')}
			/>
			<FeatureCard 
				icon="🏷️"
				title={$translateStore('feature_label_title')}
				description={$translateStore('feature_label_desc')}
			/>
		</div>
	</div>

	<div class="cta-section">
		<div class="cta-content">
			<h2>{$translateStore('cta_title')}</h2>
			<p>{$translateStore('cta_desc')}</p>
			<div class="auth-links">
				<Button variant="primary" size="large" href="/login">
					{$translateStore('login')}
				</Button>
				<Button variant="secondary" size="large" href="/register">
					{$translateStore('register')}
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

		.hero-content {
			max-width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			padding: 1rem 3rem;
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

		.box-icons {
			flex-direction: row;
			justify-content: center;
			flex-wrap: wrap;
		}
	}

	@media (max-width: 480px) {
		.boxes-grid {
			grid-template-columns: 1fr;
		}
		
		.dashboard-title {
			font-size: 1.75rem;
		}

		.box-icons {
			flex-direction: column;
			justify-content: center;
		}

		.hero-content {
			padding: 0;
		}
	}
</style>