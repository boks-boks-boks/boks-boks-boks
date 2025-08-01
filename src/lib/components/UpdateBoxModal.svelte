<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import FormInput from './FormInput.svelte';
	import { onMount } from 'svelte';
	import { deleteBox, updateBox } from '$lib/api';
	
	export let isOpen = false;
	export let boxId: string;
	export let title: string;

	const dispatch = createEventDispatcher();
	
	let isLoading = false;
	let error = '';
	let showDeleteConfirm = false;
	let oldTitle: string

	onMount(() => {
		oldTitle = title
	})

	function closeModal(newTitle: string | undefined = undefined) {
		title = newTitle ? newTitle : oldTitle
		oldTitle = title
		error = '';
		isLoading = false;
		showDeleteConfirm = false;
		dispatch('close');
	}

	function promptDeleteBox(event: Event) {
		event.preventDefault();
		showDeleteConfirm = true;
	}

	function cancelDeletePrompt() {
		showDeleteConfirm = false;
	}

	async function confirmDelete(event: Event) {
		event.preventDefault();
		isLoading = true;

    try {
		await deleteBox(boxId)

		dispatch('boxDeleted');
		closeModal();
		} catch (err) {
			console.error('Error deleting box:', err)
			error = err instanceof Error ? err.message : 'Failed to delete box'
		} finally {
			isLoading = false
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true

		try {
			await updateBox({"id": boxId, "title": title})
			
			dispatch("boxUpdated", title)
			closeModal(title)
		} catch(err) {
			console.error('Error updating box:', err)
			error = err instanceof Error ? err.message : 'Failed to update box'
		} finally {
			isLoading = false
		}
	}

	// Clear error when user starts typing
	$: if (title && error) {
		error = '';
	}
</script>

<Modal {isOpen} title="Update Box" size="medium" on:close={() => closeModal()}>
	<form on:submit={handleSubmit} class="create-box-form">
		{#if !showDeleteConfirm}
			<div class="form-group">
				<FormInput
					label="Update Box Title"
					type="text"
					placeholder="Enter box title..."
					bind:value={title}
					disabled={isLoading}
					required
				/>
			</div>
		{/if}


		{#if error}
			<div class="error-message">
				{error}
			</div>
		{/if}

		{#if showDeleteConfirm}
			<div class="delete-confirmation">
				<p class="warning-text">
					⚠️ This action is <strong>permanent</strong> and will delete the box and all its contents.
					Are you sure you want to proceed?
				</p>
				<div class="confirm-actions">
					<Button
						variant="critical"
						on:click={confirmDelete}
						disabled={isLoading}
					>
						Yes, delete it
					</Button>
					<Button
						variant="secondary"
						on:click={cancelDeletePrompt}
						disabled={isLoading}
					>
						Cancel
					</Button>
				</div>
			</div>
		{/if}

		{#if !showDeleteConfirm}
			<div class="form-actions">
				<div class="left-button">
					<Button
						type="button"
						variant="secondary"
						on:click={() => closeModal()}
						disabled={isLoading}
					>
						Cancel
					</Button>
				</div>

				<div class="right-buttons">
					
						<Button
							type="button"
							variant="critical"
							on:click={promptDeleteBox}
							disabled={isLoading}
						>
							Delete Box
						</Button>
					

					<Button
						type="submit"
						variant="primary"
						disabled={isLoading || !title.trim()}
					>
						{isLoading ? 'Saving...' : 'Save Changes'}
					</Button>
				</div>
			</div>
		{/if}
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

	.delete-confirmation {
		background: #fef2f2;
		border: 1px solid #fecaca;
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.warning-text {
		color: #b91c1c;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.confirm-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.form-actions {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1rem;
	}

	.right-buttons {
		display: flex;
		gap: 0.75rem;
	}

	@media (max-width: 640px) {
		.form-actions {
			flex-direction: row;
			align-items: stretch;
		}

		.right-buttons,
		.left-button {
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
	}

	@media (max-width: 375px) {
		.form-actions {
			gap: 10px;
			margin-left: -5px;
		}
	}
</style>
