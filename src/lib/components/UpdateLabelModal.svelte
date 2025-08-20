<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import FormInput from './FormInput.svelte';
	import { onMount } from 'svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { deleteLabel, type LabelModel } from '$lib';

    interface labelSettings {
        title: string
        description: string
        color: string
    } 
	
	let {isOpen = false, labelId, title, description, color = $bindable()} = $props()

    if (color === undefined) {
        color = "#00ff00"
    }

	const dispatch = createEventDispatcher();
	
	let isLoading = $state(false);
	let error = $state('');
	let showDeleteConfirm = $state(false);

	let oldSettings: labelSettings

	onMount(() => {
		oldSettings = {title, description, color}
	})

	function closeModal(newSetting: labelSettings | undefined = undefined) {
		let s = newSetting ? newSetting : oldSettings
        title = s.title
        description = s.description
        color = s.color
        oldSettings = {title, description, color}

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
		await deleteLabel(labelId)

		dispatch('labelDeleted', labelId);
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
			let s: labelSettings = {title, description, color}

			let label: LabelModel = {id: labelId, title: title, description: description, color: color}
			dispatch("labelUpdated", label)
			closeModal(s)
		} catch(err) {
			console.error('Error updating box:', err)
			error = err instanceof Error ? err.message : 'Failed to update box'
		} finally {
			isLoading = false
		}
	}

	// Clear error when user starts typing
	$effect(() => {
        if (title && error) {
            error = '';
        }
    })

    const colorPresets = [
		'#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
		'#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
	];

	function selectPresetColor(presetColor: string) {
		color = presetColor
	}
</script>

<Modal {isOpen} title="Update Label" size="medium" on:close={() => closeModal()}>
	<form onsubmit={handleSubmit} class="create-label-form">
		{#if !showDeleteConfirm}
			<div class="form-group">
				<FormInput
					label="Update Label Title"
					type="text"
					placeholder="Enter label title..."
					bind:value={title}
					disabled={isLoading}
					required
				/>

                <FormInput
                    label="Label description"
                    type="text"
                    placeholder="Enter label description..."
                    bind:value={description}
                    disabled={isLoading}
                />

                <div class="color-section">
                    <span class="color-label">Label Color</span>

                    <div class="color-presets">
                        <span class="presets-label">Quick colors:</span>
                        <div class="preset-colors">
                            {#each colorPresets as preset}
                                <button
                                    type="button"
                                    class="preset-color"
                                    class:active={color === preset}
                                    style="background-color: {preset};"
                                    onclick={() => selectPresetColor(preset)}
                                    title="Select {preset}"
                                    aria-label="Select color {preset}"
                                ></button>
                            {/each}
                        </div>
                    </div>
                    <div class="color-picker-container">
                        <span class="picker-label">Custom color:</span>
                        <ColorPicker
                            hex={color}
                            position="responsive"
                            label="Choose a custom color"
                        />
                    </div>
                </div>
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
					⚠️ This action is <strong>permanent</strong>.
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
							Delete Label
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
	.picker-label {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

    .color-picker-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.create-label-form {
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

    .color-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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

    	.create-label-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.color-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.color-label {
		font-weight: 600;
		color: #374151;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.color-presets {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.presets-label,
	.picker-label {
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 500;
	}

	.preset-colors {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.preset-color {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s;
	}

	.preset-color:hover {
		transform: scale(1.1);
		border-color: #374151;
	}

	.preset-color.active {
		transform: scale(1.1);
		border-color: #374151;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
	}

	.color-picker-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
</style>
