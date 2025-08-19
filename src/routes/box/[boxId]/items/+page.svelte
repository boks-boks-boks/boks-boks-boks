<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { isAuthenticated, currentUser } from '$lib/stores/auth';
	import { getBoxItems, getBoxes, type Item, type Box } from '$lib/api';
	import { Button, Card, Alert, LabelList } from '$lib';
	import CreateItemModal from '$lib/components/CreateItemModal.svelte';
	import UpdateBoxModal from '$lib/components/UpdateBoxModal.svelte';
	import UpdateItemModal from '$lib/components/UpdateItemModal.svelte';

	$: boxId = $page.params.boxId;

	let items: Item[] = [];
	let box: Box | null = null;
	let loading = false;
	let error = '';
	let hasLoaded = false;
	let loadingPromise: Promise<void> | null = null; // Track loading promise
	let showCreateModal = false;
	let showUpdateModal = false;
	let showItemUpdateModal = false;
	let modifiedItem: Item | null = null

	async function loadBoxItems() {
		if (!$isAuthenticated) {
			goto('/login');
			return;
		}

		if (loadingPromise) {
			console.log('Already loading items, waiting for existing request...');
			return loadingPromise; // Return existing promise if already loading
		}

		loading = true;
		error = '';

		loadingPromise = (async () => {
			try {
				console.log('Loading items for box:', boxId);
				// Fetch items from the API
				const itemsResponse = await getBoxItems(boxId);
				console.log('Items response:', itemsResponse);
				items = itemsResponse || []; // Ensure it's always an array

				// Try to get the box title by fetching all boxes and finding the matching one
				let boxTitle = `Box ${boxId.slice(0, 8)}...`; // Default fallback
				try {
					const allBoxes = await getBoxes();
					const foundBox = allBoxes.find(b => b.id === boxId);
					if (foundBox) {
						boxTitle = foundBox.title;
					}
				} catch (boxError) {
					console.warn('Could not fetch box details:', boxError);
					// Continue with fallback title
				}
				
				// Create box object with the title and items
				box = {
					id: boxId,
					title: boxTitle,
					items: items
				};
				
				console.log('Final box object:', box);
				console.log('Items length:', items.length);
				hasLoaded = true;
			} catch (err) {
				console.error('Failed to load box items:', err);
				error = 'Failed to load box items. The box might not exist or you might not have permission to view it.';
			} finally {
				loading = false;
				loadingPromise = null; // Clear the promise
			}
		})();
		
		return loadingPromise;
	}

	onMount(() => {
		loadBoxItems();
	});

	// Watch for boxId changes (navigation between different boxes)
	let previousBoxId = '';
	$: if (boxId && boxId !== previousBoxId) {
		console.log('Box ID changed from', previousBoxId, 'to', boxId);
		previousBoxId = boxId;
		hasLoaded = false;
		box = null;
		items = [];
		error = '';
		if ($isAuthenticated) {
			loadBoxItems();
		}
	}

	function formatAmount(amount?: number): string {
		if (amount === undefined) return 'Unknown quantity';
		return amount === 1 ? '1 item' : `${amount} items`;
	}

	function openUpdateModal() {
		showUpdateModal = true
	}

	function closeUpdateModal() {
		showUpdateModal = false
	}

	function handleBoxDeleted(event: CustomEvent<Box>) {
		event.preventDefault()

		goto("/")
	}

	function handleBoxUpdated(event: CustomEvent<string>) {
		const newTitle = event.detail

		box!.title = newTitle

		closeUpdateModal()
	}

	function openCreateModal() {
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
	}

	function handleItemCreated(event: CustomEvent<Item>) {
		const newItem = event.detail;
		console.log('New item created:', newItem);
		
		// Add the new item to the list
		items = [...items, newItem];
		
		// Update the box stats if we have a box object
		if (box) {
			box = {
				...box,
				items: [...items]
			};
		}
		
		// Close the modal
		closeCreateModal();
	}

	function openItemUpdateModal(item: Item) {
		showItemUpdateModal = true
		modifiedItem = item
	}

	function closeItemUpdateModal() {
		showItemUpdateModal = false
		modifiedItem = null
	}

	function handleItemDeleted(event: CustomEvent<string>) {
		const deletedId = event.detail

		items = items.filter(item => item.id !== deletedId);
	}

	function hanldeItemUpdated(event: CustomEvent<Item>) {
		const newItem = event.detail

		console.log(newItem)

		const updatedIndex = items.findIndex(e => e.id == newItem.id)
		items[updatedIndex] = newItem

		closeItemUpdateModal()
	}
</script>

<svelte:head>
	<title>{box?.title || 'Box Items'} - Boks-Boks-Boks</title>
</svelte:head>

<div class="box-items-container">
	{#if loading}
		<Card>
			<div class="loading-state">
				<div class="loading-spinner"></div>
				<p>Loading box contents...</p>
			</div>
		</Card>
	{:else if error}
		<Alert type="error">{error}</Alert>
		<div class="actions">
			<Button href="/" variant="secondary">
				← Back to Home
			</Button>
		</div>
	{:else if box}
		<!-- Box Header -->
		<div class="box-header">
			<div class="breadcrumbs">
				<a href="/" class="breadcrumb-link">Home</a>
				<span class="breadcrumb-separator">›</span>
				<span class="breadcrumb-current">{box.title}</span>
			</div>
			
			<Card shadow="large">
				<div class="box-info">
					<div class="box-title-section">
						<div class="box-icon">📦</div>
						<div>
							<h1 class="box-title">{box.title}</h1>
							<p class="box-stats">
								{items.length} {items.length === 1 ? 'item' : 'items'} stored
							</p>
						</div>
					</div>
					<div class="box-actions">
						<Button variant="primary" size="medium" on:click={openCreateModal}>
							+ Add Item
						</Button>
						<Button variant="secondary" size="medium" on:click={openUpdateModal}>
							Edit Box
						</Button>
					</div>
				</div>
			</Card>
		</div>

		<!-- Items List -->
		{#if items.length > 0}
			<div class="items-section">
				<h2 class="section-title">Items in this box</h2>
				<div class="items-grid">
					{#each items as item (item.id)}
						<button
							type="button"
							class="item-card-btn"
							on:click={() => openItemUpdateModal(item)}
							aria-label="Edit item"
						>
							<Card padding="medium" hover>
								<div class="item-card">
									<div class="top-item-row">
										<div class="item-icon">📋</div>
										<div class="item-content">
											<h3 class="item-title">{item.title}</h3>
											<p class="item-amount">{formatAmount(item.amount)}</p>
										</div>
										<div class="item-arrow">→</div>
									</div>
									<div class="label-container">
										{#if item.labels && item.labels.length > 0}
											<LabelList labels={item.labels} size="small" />
										{/if}
									</div>
								</div>
							</Card>
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="empty-items-state">
				<div class="empty-content">
					<div class="empty-icon">📋</div>
					<h3>This box is empty</h3>
					<p>No items have been added to "<strong>{box.title}</strong>" yet. Start organizing by adding your first item to keep track of what's stored in this box.</p>
					<div class="empty-actions">
						<Button variant="primary" size="large" on:click={openCreateModal}>
							<span class="button-icon">+</span>
							Add Your First Item
						</Button>
						<Button variant="secondary" size="medium" href="/">
							← Back to All Boxes
						</Button>
					</div>
					<div class="item-suggestions">
						<h4>💡 Quick tips:</h4>
						<ul class="tips-list">
							<li>🏷️ Give items descriptive names (e.g., "Winter Coat - Black", "Coffee Maker - Breville")</li>
							<li>📊 Track quantities to know exactly what you have</li>
							<li>🔍 Use consistent naming for easier searching later</li>
						</ul>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<!-- Create Item Modal -->
<CreateItemModal
	isOpen={showCreateModal} 
	{boxId}
	on:close={closeCreateModal}
	on:itemCreated={handleItemCreated}
/>

<!-- Update Box Modal-->
{#if box}
<UpdateBoxModal
	isOpen={showUpdateModal}
	{boxId}
	title={box.title}
	on:close={closeUpdateModal}
	on:boxDeleted={handleBoxDeleted}
	on:boxUpdated={handleBoxUpdated}
/>
{/if}

{#if modifiedItem}
<UpdateItemModal
	isOpen={showItemUpdateModal}
	item={modifiedItem}
	boxId={boxId}
	on:close={closeItemUpdateModal}
	on:itemDeleted={handleItemDeleted}
	on:itemUpdated={hanldeItemUpdated}
/>
{/if}


<style>
	.box-items-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
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

	.item-arrow {
		color: #9ca3af;
		font-size: 1.25rem;
		font-weight: bold;
		transition: color 0.2s ease, transform 0.2s ease;
	}
	
	.item-card-btn:hover .item-arrow {
		color: #3b82f6;
		transform: translateX(4px);
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.breadcrumbs {
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.breadcrumb-link {
		color: #3b82f6;
		text-decoration: none;
	}

	.breadcrumb-link:hover {
		text-decoration: underline;
	}

	.breadcrumb-separator {
		margin: 0 0.5rem;
	}

	.breadcrumb-current {
		color: #1f2937;
		font-weight: 500;
	}

	.box-header {
		margin-bottom: 2rem;
	}

	.box-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.box-title-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.box-icon {
		font-size: 3rem;
		opacity: 0.8;
	}

	.box-title {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
	}

	.box-stats {
		margin: 0.25rem 0 0 0;
		color: #6b7280;
		font-size: 1rem;
	}

	.box-actions {
		display: flex;
		gap: 0.75rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 1.5rem 0;
	}

	.items-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.item-card {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 1.1rem;
	}

	.item-icon {
		font-size: 1.5rem;
		opacity: 0.7;
	}

	.item-content {
		flex: 1;
		min-width: 0;
	}

	.item-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-amount {
		margin: 0.25rem 0 0 0;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.action-button {
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s ease;
	}

	.action-button:hover {
		background-color: #f3f4f6;
	}

	.top-item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
		width: 100%;
	}

	.label-container {
		display: flex;
		gap: 10px;
		justify-content: start;
		width: 100%;
	}

	.empty-items-state {
		background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
		border-radius: 1rem;
		padding: 3rem 2rem;
		text-align: center;
		margin: 2rem 0;
		border: 2px dashed #d8b4fe;
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
	
	.empty-items-state .empty-icon {
		font-size: 4.5rem;
		margin-bottom: 1.5rem;
		opacity: 0.8;
	}

	.empty-items-state h3 {
		font-size: 1.75rem;
		font-weight: 700;
		color: #581c87;
		margin: 0 0 1rem 0;
	}

	.empty-items-state p {
		font-size: 1.125rem;
		color: #7c3aed;
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}

	.empty-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.button-icon {
		font-size: 1.2rem;
		margin-right: 0.5rem;
	}

	.item-suggestions {
		background: white;
		border-radius: 0.75rem;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		text-align: left;
	}

	.item-suggestions h4 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #374151;
		margin: 0 0 1rem 0;
		text-align: center;
	}

	.tips-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.tips-list li {
		padding: 0.75rem 0;
		font-size: 0.95rem;
		color: #4b5563;
		border-bottom: 1px solid #f3f4f6;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		line-height: 1.5;
	}

	.tips-list li:last-child {
		border-bottom: none;
	}

	.item-card-btn {
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		width: 100%;
		text-align: inherit;
	}

	@media (max-width: 768px) {
		.box-items-container {
			padding: 0.5rem;
		}

		.box-info {
			flex-direction: column;
			align-items: stretch;
			gap: 1.5rem;
		}

		.box-title-section {
			justify-content: center;
			text-align: center;
		}

		.box-actions {
			justify-content: center;
		}

		.items-grid {
			grid-template-columns: 1fr;
		}

		.box-title {
			font-size: 1.75rem;
		}
		
		.empty-items-state {
			padding: 2rem 1rem;
			margin: 1rem 0;
		}
		
		.empty-items-state .empty-icon {
			font-size: 3.5rem;
		}
		
		.empty-items-state h3 {
			font-size: 1.5rem;
		}
		
		.empty-items-state p {
			font-size: 1rem;
		}
		
		.empty-actions {
			flex-direction: column;
			gap: 0.75rem;
		}
		
		.item-suggestions {
			padding: 1.5rem;
		}
		
		.item-suggestions h4 {
			font-size: 1rem;
		}
		
		.tips-list li {
			font-size: 0.875rem;
			padding: 0.5rem 0;
		}
	}

	@media (max-width: 480px) {
		.box-actions {
			flex-direction: column;
		}

		.item-card {
			padding: 0.25rem;
		}

		.action-button {
			padding: 0.375rem;
			font-size: 0.875rem;
		}
	}
</style>
