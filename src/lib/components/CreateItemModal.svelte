<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import FormInput from './FormInput.svelte';
	import { createItem, type Item } from '$lib/api';
	
	export let isOpen = false;
	export let boxId: string;
	
	const dispatch = createEventDispatcher();
	
	let title = '';
	let amount = '1';
	let isLoading = false;
	let error = '';
	
	function closeModal() {
		// Reset form when closing
		title = '';
		amount = '1';
		error = '';
		isLoading = false;
		dispatch('close');
	}
	
	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (!title.trim()) {
			error = 'Item title is required';
			return;
		}
		
		const amountNum = parseInt(amount, 10);
		if (isNaN(amountNum) || amountNum < 1) {
			error = 'Amount must be a valid number of at least 1';
			return;
		}
		
		isLoading = true;
		error = '';
		
		try {
			const newItem = await createItem(boxId, { 
				title: title.trim(), 
				amount: amountNum 
			});
			
			// Dispatch success event with the new item data
			dispatch('itemCreated', newItem);
			
			// Close modal and reset form
			closeModal();
		} catch (err) {
			console.error('Error creating item:', err);
			error = err instanceof Error ? err.message : 'Failed to create item';
		} finally {
			isLoading = false;
		}
	}

	// Clear error when user starts typing
	$: if ((title || amount !== '1') && error) {
		error = '';
	}
</script>

<Modal {isOpen} title="Add New Item" size="medium" on:close={closeModal}>
	<form on:submit={handleSubmit} class="create-item-form">
		<div class="form-group">
			<FormInput
				label="Item Title"
				type="text"
				placeholder="Enter item name..."
				bind:value={title}
				disabled={isLoading}
				required
			/>
		</div>
		
		<div class="form-group">
			<FormInput
				label="Amount"
				type="number"
				placeholder="Enter quantity..."
				bind:value={amount}
				disabled={isLoading}
				required
			/>
		</div>
		
		{#if error}
			<div class="error-message">
				{error}
			</div>
		{/if}
		
		<div class="form-actions">
			<Button
				type="button"
				variant="secondary"
				on:click={closeModal}
				disabled={isLoading}
			>
				Cancel
			</Button>
			<Button
				type="submit"
				variant="primary"
				disabled={isLoading || !title.trim() || !amount || parseInt(amount, 10) < 1}
			>
				{isLoading ? 'Adding...' : 'Add Item'}
			</Button>
		</div>
	</form>
</Modal>

<style>
	.create-item-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
	}
	
	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1rem;
	}
	
	@media (max-width: 640px) {
		.form-actions {
			flex-direction: column-reverse;
		}
	}
</style>
