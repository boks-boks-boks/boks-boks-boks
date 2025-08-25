<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import FormInput from './FormInput.svelte';
	import { type LabelModel, type Item, deleteItem, updateItem, getLabel } from '$lib/api';
	import LabelPicker from './LabelPicker.svelte';
	import { userLabels, setLabels } from '$lib/stores/labels';
	import Label from './Label.svelte';
	import { translateStore } from '$lib/strings';

	interface Props {
		isOpen: boolean
		item: Item
		boxId: string
	}
	
	let {isOpen = false, item, boxId}: Props = $props()

	let labels = $state<LabelModel[]>([]);
	let selectLabels = $state<LabelModel[]>(item.labels || []);

	const dispatch = createEventDispatcher();
	
	let isLoading = $state(false);
	let error = $state('');
	let showDeleteConfirm = $state(false);

	let editTitle = $state(item.title);
	let editAmount = $state(item.amount);
	let amountStr = $derived(String(editAmount));

	let isLabelPickerOpen = $state(false)

	function toggleLabelPicker() {
		isLabelPickerOpen = !isLabelPickerOpen
	}

	function resetModal() {
		error = '';
		isLoading = false;
		showDeleteConfirm = false;
		// Reset form values to original item values
		editTitle = item.title;
		editAmount = item.amount;
		selectLabels = item.labels || [];
	}

	function closeModal() {
		resetModal()
		dispatch("close")
	}

	function promptDeleteItem(event: Event) {
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
		await deleteItem(boxId, item.id)

		dispatch('itemDeleted', item.id);
		resetModal();
		} catch (err) {
			console.error('Error deleting item:', err)
			error = err instanceof Error ? err.message : $translateStore('failed_delete_item')
		} finally {
			isLoading = false
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true

		try {
			const newItem = await updateItem(boxId, {"id": item.id, "title": editTitle, "amount": parseInt(amountStr), "labels": selectLabels})

			resetModal()
			dispatch("itemUpdated", newItem)
		} catch(err) {
			console.error('Error updating box:', err)
			error = err instanceof Error ? err.message : $translateStore('failed_update_item')
		} finally {
			isLoading = false
		}
	}

	function handleLabelsChanged(event: CustomEvent<LabelModel[]>) {
		selectLabels = event.detail
	}

	function handleLabelPickerClose() {
		isLabelPickerOpen = false
	}

	$effect(() => {
		if($userLabels == null) {
            getLabel().then(l => {
                setLabels(l)
                labels = $userLabels!
            })
        } else {
            labels = $userLabels!
        }
	})

	$effect(() => {
		if (item) {
			editTitle = item.title;
			editAmount = item.amount;
			selectLabels = item.labels || [];
			// Clear error when item changes
			if (error) {
				error = '';
			}
		}
	})
</script>

<Modal {isOpen} title={$translateStore('update_item')} size="medium" on:close={() => closeModal()}>
	<form onsubmit={handleSubmit} class="create-box-form">
		{#if !showDeleteConfirm}
			<div class="form-group">
				<FormInput
					label={$translateStore('update_item_title')}
					type="text"
					placeholder={$translateStore('enter_box_title')}
					bind:value={editTitle}
					disabled={isLoading}
					required
				/>
			</div>

            <div class="form-group">
                <FormInput
                    label={$translateStore('amount')}
                    type="number"
                    placeholder={$translateStore('enter_quantity')}
                    bind:value={amountStr}
                    disabled={isLoading}
                    required
                />
            </div>

			<div class="add-label-container">
				<p>{$translateStore('labels')}</p>
				<button onclick={(e) => { e.stopPropagation(); toggleLabelPicker(); }} class="action-btn" title={$translateStore('add_labels')} type="button" disabled={isLoading}>
					⚙️
				</button>
				<LabelPicker 
					isOpen={isLabelPickerOpen}
					availableLabels={labels}
					selectedLabels={selectLabels}
					on:labelsChanged={handleLabelsChanged}
					on:close={handleLabelPickerClose}
				/>
			</div>
			<div class="selected-labels-container">
				{#if selectLabels.length > 0}
					{#each selectLabels as label}
						<Label size="small" color={label.color}>{label.title}</Label>
					{/each}
				{:else}
					<p class="placeholder-text">{$translateStore('no_label_associated')}</p>
				{/if}
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
					{$translateStore('delete_item_confirmation')}
				</p>
				<div class="confirm-actions">
					<Button
						variant="critical"
						on:click={confirmDelete}
						disabled={isLoading}
					>
						{$translateStore('yes_delete_it')}
					</Button>
					<Button
						variant="secondary"
						on:click={cancelDeletePrompt}
						disabled={isLoading}
					>
						{$translateStore('cancel')}
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
						{$translateStore('cancel')}
					</Button>
				</div>

				<div class="right-buttons">
					
						<Button
							type="button"
							variant="critical"
							on:click={promptDeleteItem}
							disabled={isLoading}
						>
							{$translateStore('delete_item')}
						</Button>
					

					<Button
						type="submit"
						variant="primary"
						disabled={isLoading || !editTitle.trim()}
					>
						{isLoading ? $translateStore('saving') : $translateStore('save_changes')}
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
		gap: 1rem;
	}

	.add-label-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 1;
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

	.selected-labels-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		min-height: 2rem;
		align-items: center;
		margin: 0.5rem 0;
	}

	.placeholder-text {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
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

 	.action-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: all 0.2s;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        touch-action: manipulation; /* Improves touch responsiveness */
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
