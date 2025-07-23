<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import FormInput from './FormInput.svelte';
    import ColorPicker from 'svelte-awesome-color-picker';
	import { type CreateLabelRequest, createLabel } from '$lib/api';

	interface Props {
		isOpen: boolean;
	}

	let { isOpen = false }: Props = $props();
	
	const dispatch = createEventDispatcher();
	
    let description = $state('');
	let title = $state('');
	let isLoading = $state(false);
	let error = $state('');

    let hex = $state("#3b82f6");
    let rgb = $state({
		r: 59,
		g: 130,
		b: 246,
		a: 1
	});
    let hsv = $state({
		h: 217,
		s: 76,
		v: 96,
		a: 1
	});
    let color = $state<any>(null);

	// Derived validation
	let isFormValid = $derived(title.trim().length > 0 && description.trim().length > 0);

	function closeModal() {
		// Reset form when closing
		title = '';
		description = '';
		error = '';
		isLoading = false;
		hex = "#3b82f6";
		dispatch('close');
	}
	
	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (!isFormValid) {
			error = 'Both title and description are required';
			return;
		}
		
		isLoading = true;
		error = '';
		
		try {
			const newLabel: CreateLabelRequest = {
				title: title.trim(),
				description: description.trim(),
				color: hex
			};

			const onDbLabel = await createLabel(newLabel)
			
			dispatch('labelCreated', newLabel);
			
			// Close modal and reset form
			closeModal();
		} catch (err) {
			console.error('Error creating label:', err);
			error = err instanceof Error ? err.message : 'Failed to create label';
		} finally {
			isLoading = false;
		}
	}

	// Clear error when user starts typing
	$effect(() => {
		if ((title || description) && error) {
			error = '';
		}
	});

	// Predefined color options
	const colorPresets = [
		'#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
		'#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
	];

	function selectPresetColor(presetColor: string) {
		hex = presetColor;
		// Convert hex to rgb for the color picker
		const r = parseInt(presetColor.slice(1, 3), 16);
		const g = parseInt(presetColor.slice(3, 5), 16);
		const b = parseInt(presetColor.slice(5, 7), 16);
		rgb = { r, g, b, a: 1 };
	}
</script>

<Modal {isOpen} title="Create New Label" size="medium" on:close={() => closeModal()}>
	<form onsubmit={handleSubmit} class="create-label-form">
		<div class="form-group">
			<FormInput
				label="Label title"
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
				required
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
								class:active={hex === preset}
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
						bind:hex
						bind:rgb
						bind:hsv
						bind:color
						position="responsive"
						label="Choose a custom color"
					/>
				</div>
			</div>

			<div id="portal"></div>
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
				disabled={isLoading || !isFormValid}
			>
				{isLoading ? 'Creating...' : 'Create Label'}
			</Button>
		</div>
	</form>
</Modal>

<style>
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
	
	@media (max-width: 768px) {
		.create-label-form {
			gap: 1.25rem;
		}

		.form-group {
			gap: 0.875rem;
		}

		.preset-colors {
			gap: 0.375rem;
		}

		.preset-color {
			width: 28px;
			height: 28px;
		}

		.color-section {
			gap: 0.875rem;
		}
	}
	
	@media (max-width: 640px) {
		.form-actions {
			flex-direction: column-reverse;
			gap: 0.75rem;
		}

		.preset-colors {
			justify-content: flex-start;
			gap: 0.5rem;
		}

		.preset-color {
			width: 32px;
			height: 32px;
		}

		.create-label-form {
			gap: 1rem;
		}

		.form-group {
			gap: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.preset-colors {
			justify-content: center;
		}

		.color-section {
			gap: 0.75rem;
		}

		.form-actions {
			gap: 0.5rem;
		}

		.error-message {
			padding: 0.5rem;
			font-size: 0.8rem;
		}
	}
</style>
