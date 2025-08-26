<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import FormInput from './FormInput.svelte';
	import { createBox, type Box } from '$lib/api';
	import { translateStore } from '$lib/strings';
	
	export let isOpen = false;
	
	const dispatch = createEventDispatcher();
	
	let title = '';
	let isLoading = false;
	let error = '';
	
	function closeModal() {
		// Reset form when closing
		title = '';
		error = '';
		isLoading = false;
		dispatch('close');
	}
	
	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (!title.trim()) {
			error = $translateStore('box_title_required');
			return;
		}
		
		isLoading = true;
		error = '';
		
		try {
			const newBox = await createBox({ title: title.trim() });
			
			// Dispatch success event with the new box data
			dispatch('boxCreated', newBox);
			
			// Close modal and reset form
			closeModal();
		} catch (err) {
			console.error('Error creating box:', err);
			error = err instanceof Error ? err.message : $translateStore('failed_create_box');
		} finally {
			isLoading = false;
		}
	}

	// Clear error when user starts typing
	$: if (title && error) {
		error = '';
	}
</script>

<Modal {isOpen} title={$translateStore('create_new_box')} size="medium" on:close={closeModal}>
	<form on:submit={handleSubmit} class="create-box-form">
		<div class="form-group">
			<FormInput
				label={$translateStore('box_title')}
				type="text"
				placeholder={$translateStore('enter_box_title')}
				bind:value={title}
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
				{$translateStore('cancel')}
			</Button>
			<Button
				type="submit"
				variant="primary"
				disabled={isLoading || !title.trim()}
			>
				{isLoading ? $translateStore('creating') : $translateStore('create_box')}
			</Button>
		</div>
	</form>
</Modal>

<style>
	.create-box-form {
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
