<script lang="ts">
	import { isAuthenticated, currentUser, accessToken } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { Button, Card, ItemSearch } from '$lib';
    import { onMount } from 'svelte';
	import { getBoxIdContainItemTitle, type Box } from '$lib';
	import { goto } from '$app/navigation';

	interface BoxWithMatch extends Box {
		matchingItemsCount: number;
		matchingItems: string[];
	}

	let localStorageToken = '';
	let localStorageUser = '';
	let selectedBox: BoxWithMatch | null = null;

	if (browser) {
		localStorageToken = localStorage.getItem('auth_token') || 'Not found';
		localStorageUser = localStorage.getItem('current_user') || 'Not found';
	}

	function clearAll() {
		if (browser) {
			localStorage.clear();
			location.reload();
		}
	}

	function handleBoxSelect(event: CustomEvent<{ box: BoxWithMatch }>) {
		selectedBox = event.detail.box;
		console.log('Selected box:', selectedBox);
	}

	function handleSearchInput(event: CustomEvent<{ query: string }>) {
		console.log('Search query:', event.detail.query);
	}

	function handleSearchClear() {
		selectedBox = null;
		console.log('Search cleared');
	}

	function navigateToBox() {
		if (selectedBox) {
			goto(`/box/${selectedBox.id}/items`);
		}
	}

	onMount(async () => {
		const boxIds = await getBoxIdContainItemTitle("test2")
		console.log(boxIds)
	})
</script>

<svelte:head>
	<title>Debug Auth State - Boks-Boks-Boks</title>
</svelte:head>

<Card>
	<h1>Authentication Debug Page</h1>
	
	<div class="debug-section">
		<h2>Item Search Engine</h2>
		<p class="section-description">Search for items across all your boxes. This search shows which boxes contain matching items, perfect for quickly finding where your things are stored.</p>
		<ItemSearch
			placeholder="Search for items in your boxes..."
			on:select={handleBoxSelect}
			on:input={handleSearchInput}
			on:clear={handleSearchClear}
			maxResults={6}
		/>
		
		{#if selectedBox}
			<div class="selected-item">
				<h3>📦 Box Found: {selectedBox.title}</h3>
				<div class="item-details">
					<p><strong>Box ID:</strong> <code>{selectedBox.id}</code></p>
					<p><strong>Matching Items:</strong> {selectedBox.matchingItemsCount} item{selectedBox.matchingItemsCount > 1 ? 's' : ''}</p>
					<div class="matching-items-list">
						<p><strong>Items found:</strong></p>
						<ul>
							{#each selectedBox.matchingItems as itemName}
								<li>{itemName}</li>
							{/each}
							{#if selectedBox.matchingItemsCount > selectedBox.matchingItems.length}
								<li class="more-items">... and {selectedBox.matchingItemsCount - selectedBox.matchingItems.length} more items</li>
							{/if}
						</ul>
					</div>
					<div class="box-actions">
						<Button variant="primary" size="medium" on:click={navigateToBox}>
							View Box Contents
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="debug-section">
		<h2>Svelte Stores</h2>
		<p><strong>isAuthenticated:</strong> {$isAuthenticated}</p>
		<p><strong>accessToken:</strong> {$accessToken || 'null'}</p>
		<p><strong>currentUser:</strong> {JSON.stringify($currentUser) || 'null'}</p>
	</div>

	<div class="debug-section">
		<h2>LocalStorage</h2>
		<p><strong>auth_token:</strong> {localStorageToken}</p>
		<p><strong>current_user:</strong> {localStorageUser}</p>
	</div>

	<div class="debug-section">
		<h2>Actions</h2>
		<Button on:click={clearAll} variant="secondary">
			Clear All Data & Reload
		</Button>
		<Button href="/" variant="primary">
			Back to Home
		</Button>
	</div>
</Card>

<style>
	.debug-section {
		margin: 2rem 0;
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: #f9fafb;
	}

	.debug-section h2 {
		margin-top: 0;
		color: #1f2937;
	}

	.debug-section p {
		margin: 0.5rem 0;
		font-family: monospace;
		background: white;
		padding: 0.5rem;
		border-radius: 4px;
		word-break: break-all;
	}

	.section-description {
		font-family: inherit !important;
		color: #6b7280 !important;
		background: transparent !important;
		padding: 0 !important;
		font-style: italic;
		margin-bottom: 1rem !important;
	}

	.selected-item {
		margin-top: 1.5rem;
		padding: 1rem;
		background: white;
		border-radius: 8px;
		border: 1px solid #d1d5db;
	}

	.selected-item h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #1f2937;
		font-size: 1.1rem;
	}

	.item-details p {
		margin: 0.75rem 0;
		font-family: inherit;
		background: transparent;
		padding: 0;
	}

	.item-details code {
		background: #f3f4f6;
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		font-size: 0.875rem;
		color: #374151;
	}

	.matching-items-list {
		margin: 1rem 0;
	}

	.matching-items-list ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.matching-items-list li {
		margin: 0.25rem 0;
		color: #374151;
	}

	.more-items {
		color: #6b7280;
		font-style: italic;
	}

	.box-actions {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}
</style>
