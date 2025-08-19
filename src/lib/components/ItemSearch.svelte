<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getBoxes, getBoxItems, type Item, type Box } from '$lib/api';
	import { debounce } from '$lib/utils';

	export let placeholder = 'Search items across all boxes...';
	export let showResults = true;
	export let maxResults = 6;

	interface BoxWithMatch extends Box {
		matchingItemsCount: number;
		matchingItems: string[];
	}

	const dispatch = createEventDispatcher<{
		input: { query: string };
		select: { box: BoxWithMatch };
		clear: void;
	}>();

	let searchQuery = '';
	let searchResults: BoxWithMatch[] = [];
	let isLoading = false;
	let isDropdownOpen = false;
	let searchInput: HTMLInputElement;

	// Debounced search function
	const debouncedSearch = debounce(async (query: string) => {
		if (!query.trim() || query.length < 1) {
			searchResults = [];
			isDropdownOpen = false;
			return;
		}

		isLoading = true;
		try {
			// Get all boxes
			const boxes = await getBoxes();
			const boxMatches: BoxWithMatch[] = [];

			// For each box, check if it contains matching items
			for (const box of boxes) {
				try {
					const items = await getBoxItems(box.id);
					const matchingItems = items.filter(item =>
						item.title.toLowerCase().includes(query.toLowerCase())
					);

					if (matchingItems.length > 0) {
						boxMatches.push({
							...box,
							matchingItemsCount: matchingItems.length,
							matchingItems: matchingItems.map(item => item.title).slice(0, 3)
						});
					}
				} catch (error) {
					console.error(`Error fetching items for box ${box.id}:`, error);
				}
			}

			// Sort by number of matches (most matches first)
			boxMatches.sort((a, b) => b.matchingItemsCount - a.matchingItemsCount);

			searchResults = boxMatches.slice(0, maxResults);
			isDropdownOpen = showResults && searchQuery.trim().length >= 1;
		} catch (error) {
			console.error('Search error:', error);
			searchResults = [];
			isDropdownOpen = showResults && searchQuery.trim().length >= 1;
		} finally {
			isLoading = false;
		}
	}, 400);

	function handleInput() {
		debouncedSearch(searchQuery);
		dispatch('input', { query: searchQuery });
	}

	function handleBoxSelect(box: BoxWithMatch) {
		searchQuery = '';
		isDropdownOpen = false;
		dispatch('select', { box });
	}

	function handleFocus() {
		if (searchQuery.trim().length >= 1) {
			isDropdownOpen = true;
		}
	}

	function handleBlur() {
		// Delay closing to allow for click events
		setTimeout(() => {
			isDropdownOpen = false;
		}, 200);
	}

	function clearSearch() {
		searchQuery = '';
		searchResults = [];
		isDropdownOpen = false;
		dispatch('clear');
		searchInput?.focus();
	}
</script>

<div class="search-container">
	<div class="search-input-wrapper">
		<div class="search-icon">
			<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
			</svg>
		</div>
		<input
			bind:this={searchInput}
			bind:value={searchQuery}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			type="text"
			{placeholder}
			class="search-input"
			class:loading={isLoading}
		/>
		{#if isLoading}
			<div class="loading-spinner">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
					<circle cx="12" cy="12" r="10" stroke="#e5e7eb" stroke-width="2"/>
					<path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</div>
		{:else if searchQuery}
			<button on:click={clearSearch} class="clear-button" title="Clear search" aria-label="Clear search">
				<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
		{/if}
	</div>

	{#if isDropdownOpen && showResults}
		<div class="search-results">
			{#each searchResults as box (box.id)}
				<button
					class="search-result-item"
					on:click={() => handleBoxSelect(box)}
				>
					<div class="box-info">
						<div class="box-header">
							<span class="box-icon">📦</span>
							<div class="box-details">
								<div class="box-title">{box.title}</div>
								<div class="match-count">
									{box.matchingItemsCount} item{box.matchingItemsCount > 1 ? 's' : ''} found
								</div>
							</div>
						</div>
						<div class="matching-items">
							{#each box.matchingItems as itemName, index}
								<span class="item-preview">{itemName}</span>
								{#if index < box.matchingItems.length - 1 && index < 2}, {/if}
							{/each}
							{#if box.matchingItemsCount > 3}
								<span class="more-items">... and {box.matchingItemsCount - 3} more</span>
							{/if}
						</div>
					</div>
				</button>
			{:else}
				<div class="no-results">
					<div class="no-results-content">
						<div class="no-results-title">No matches found</div>
						<div class="no-results-text">
							No boxes contain items matching "<strong>{searchQuery}</strong>"
						</div>
						<div class="no-results-suggestions">
							<div class="suggestion-text">Try searching for:</div>
							<div class="suggestions">
								<span class="suggestion">• Different keywords</span>
								<span class="suggestion">• Partial item names</span>
								<span class="suggestion">• Common item categories</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search-container {
		position: relative;
		width: 100%;
		max-width: 400px;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 2.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		font-size: 0.95rem;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
		font-family: inherit;
		background: white;
	}

	.search-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.search-input.loading {
		padding-right: 2.75rem;
	}

	.search-input::placeholder {
		color: #9ca3af;
		font-size: 0.9rem;
	}

	.search-icon {
		position: absolute;
		left: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		color: #6b7280;
		z-index: 1;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-spinner {
		position: absolute;
		right: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		animation: spin 1s linear infinite;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.clear-button {
		position: absolute;
		right: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: #6b7280;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease;
	}

	.clear-button:hover {
		color: #374151;
	}

	.search-results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		max-height: 300px;
		overflow-y: auto;
		z-index: 50;
		margin-top: 0.25rem;
	}

	.search-result-item {
		width: 100%;
		padding: 0.875rem;
		border: none;
		background: white;
		text-align: left;
		cursor: pointer;
		border-bottom: 1px solid #f3f4f6;
		transition: background-color 0.2s ease;
	}

	.search-result-item:hover {
		background-color: #f8fafc;
	}

	.search-result-item:last-child {
		border-bottom: none;
	}

	.box-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.box-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.box-icon {
		font-size: 1.25rem;
		opacity: 0.8;
	}

	.box-details {
		flex: 1;
	}

	.box-title {
		font-weight: 600;
		color: #1f2937;
		font-size: 0.95rem;
		margin-bottom: 0.125rem;
	}

	.match-count {
		font-size: 0.8rem;
		color: #3b82f6;
		font-weight: 500;
	}

	.matching-items {
		font-size: 0.8rem;
		color: #6b7280;
		line-height: 1.4;
		margin-left: 2rem;
	}

	.item-preview {
		font-style: italic;
	}

	.more-items {
		color: #9ca3af;
		font-weight: 500;
	}

	.no-results {
		padding: 2rem 1.5rem;
		text-align: center;
	}

	.no-results-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.no-results-title {
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.25rem;
	}

	.no-results-text {
		font-size: 0.9rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.no-results-suggestions {
		background: #f8fafc;
		border-radius: 6px;
		padding: 1rem;
		width: 100%;
		max-width: 280px;
	}

	.suggestion-text {
		font-size: 0.8rem;
		font-weight: 500;
		color: #4b5563;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.suggestions {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: left;
	}

	.suggestion {
		font-size: 0.75rem;
		color: #6b7280;
		line-height: 1.4;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.search-container {
			max-width: 100%;
		}
		
		.search-input {
			font-size: 16px; /* Prevent zoom on iOS */
		}
	}
</style>
