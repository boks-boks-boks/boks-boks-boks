<script lang="ts">
	import type { LabelModel } from '$lib/api';
	import Label from './Label.svelte';
	import { createEventDispatcher } from 'svelte';
	import { translateStore } from '$lib/strings';

	interface Props {
		isOpen: boolean;
		availableLabels: LabelModel[];
		selectedLabels: LabelModel[];
	}

	const dispatch = createEventDispatcher();

	let { isOpen = false, availableLabels = [], selectedLabels = [] }: Props = $props();
	let dropdownElement = $state<HTMLDivElement>();
	let shouldPositionBelow = $state(false);

	function isLabelSelected(label: LabelModel): boolean {
		return selectedLabels.some(selected => selected.id === label.id);
	}

	function toggleLabel(label: LabelModel) {
		if (isLabelSelected(label)) {
			// Remove label from selection
			const updatedLabels = selectedLabels.filter(selected => selected.id !== label.id);
			dispatch('labelsChanged', updatedLabels);
		} else {
			// Add label to selection
			const updatedLabels = [...selectedLabels, label];
			dispatch('labelsChanged', updatedLabels);
		}
	}

	function handleClickOutside(event: MouseEvent | TouchEvent) {
		const target = event.target as HTMLElement;
		const dropdown = document.querySelector('.label-picker-dropdown');
		const button = document.querySelector('.add-label-container .action-btn');
		
		if (dropdown && !dropdown.contains(target) && button && !button.contains(target)) {
			console.log('Clicking outside detected, closing dropdown');
			dispatch('close');
		}
	}

	function checkPositioning() {
		if (!dropdownElement) return;
		
		const button = document.querySelector('.add-label-container .action-btn') as HTMLElement;
		if (!button) return;

		const buttonRect = button.getBoundingClientRect();
		const dropdownHeight = 400; // Approximate dropdown height
		const spaceAbove = buttonRect.top;
		const spaceBelow = window.innerHeight - buttonRect.bottom;
		
		// On medium mobile screens (481px - 640px), check if there's enough space above
		const isMediumMobile = window.innerWidth <= 640 && window.innerWidth > 480;
		
		if (isMediumMobile) {
			shouldPositionBelow = spaceAbove < dropdownHeight && spaceBelow > spaceAbove;
		} else {
			shouldPositionBelow = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			// Check positioning after a small delay to ensure elements are rendered
			setTimeout(() => {
				checkPositioning();
				document.addEventListener('click', handleClickOutside);
				document.addEventListener('touchstart', handleClickOutside);
			}, 10);
		} else {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('touchstart', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('touchstart', handleClickOutside);
		};
	});
</script>

{#if isOpen}
	<div 
		class="label-picker-dropdown" 
		class:position-below={shouldPositionBelow}
		bind:this={dropdownElement}
	>
		<div class="dropdown-header">
			<h4>{$translateStore('select_labels')}</h4>
			<span class="label-count">{selectedLabels.length} {$translateStore('labels_selected')}</span>
		</div>
		
		<div class="dropdown-content">
			{#if availableLabels.length === 0}
				<div class="empty-state">
					<p>{$translateStore('no_labels_available')}</p>
					<span class="empty-subtitle">{$translateStore('create_labels_first')}</span>
				</div>
			{:else}
				{#each availableLabels as label}
					<div class="label-option" role="button" tabindex="0" onclick={() => toggleLabel(label)} onkeydown={(e) => e.key === 'Enter' && toggleLabel(label)}>
						<div class="checkbox-container">
							<input 
								type="checkbox" 
								checked={isLabelSelected(label)}
								onchange={() => toggleLabel(label)}
								class="label-checkbox"
							/>
						</div>
						<div class="label-preview">
							<Label size="small" color={label.color}>{label.title}</Label>
						</div>
						{#if label.description}
							<span class="label-description">{label.description}</span>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		{#if availableLabels.length > 0}
			<div class="dropdown-footer">
				<button 
					type="button" 
					class="clear-btn" 
					onclick={() => dispatch('labelsChanged', [])}
					disabled={selectedLabels.length === 0}
				>
					{$translateStore('clear_all')}
				</button>
				<button 
					type="button" 
					class="done-btn" 
					onclick={() => dispatch('close')}
				>
					{$translateStore('done')}
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.label-picker-dropdown {
		position: absolute;
		left: 0;
		right: 0;
		margin-bottom: 12rem;
		margin-left: 1.5rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		border: 1px solid #e5e7eb;
		z-index: 1100;
		min-width: 320px;
		max-width: 400px;
		max-height: 400px;
		display: flex;
		flex-direction: column;
		animation: slideUp 0.2s ease-out;
	}

	.label-picker-dropdown.position-below {
		bottom: auto;
		top: 100%;
		margin-bottom: 0;
		margin-top: 0.5rem;
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dropdown-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #f3f4f6;
		background: #f9fafb;
		border-radius: 12px 12px 0 0;
	}

	.dropdown-header h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
	}

	.label-count {
		font-size: 0.875rem;
		color: #6b7280;
		background: #e5e7eb;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-weight: 500;
	}

	.dropdown-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem 0;
		max-height: 280px;
	}

	.empty-state {
		text-align: center;
		padding: 2rem 1.25rem;
		color: #6b7280;
	}

	.empty-state p {
		margin: 0 0 0.5rem 0;
		font-weight: 500;
		color: #374151;
	}

	.empty-subtitle {
		font-size: 0.875rem;
		color: #9ca3af;
	}

	.label-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		cursor: pointer;
		transition: background-color 0.15s ease;
		border: none;
		background: none;
		outline: none;
	}

	.label-option:hover {
		background: #f9fafb;
	}

	.label-option:focus {
		background: #f3f4f6;
		outline: 2px solid #3b82f6;
		outline-offset: -2px;
	}

	.checkbox-container {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.label-checkbox {
		width: 1rem;
		height: 1rem;
		border-radius: 0.25rem;
		border: 2px solid #d1d5db;
		background: white;
		cursor: pointer;
		transition: all 0.15s ease;
		accent-color: #3b82f6;
	}

	.label-checkbox:checked {
		background: #3b82f6;
		border-color: #3b82f6;
	}

	.label-checkbox:hover {
		border-color: #9ca3af;
	}

	.label-preview {
		flex-shrink: 0;
	}

	.label-description {
		font-size: 0.875rem;
		color: #6b7280;
		flex: 1;
		margin-left: 0.5rem;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.dropdown-footer {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-top: 1px solid #f3f4f6;
		background: #f9fafb;
		border-radius: 0 0 12px 12px;
	}

	.clear-btn,
	.done-btn {
		flex: 1;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-weight: 600;
		text-align: center;
		transition: all 0.2s ease;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-family: inherit;
		line-height: 1;
	}

	.clear-btn {
		background: white;
		color: #6b7280;
		border: 2px solid #e5e7eb;
	}

	.clear-btn:hover:not(:disabled) {
		background: #f9fafb;
		border-color: #d1d5db;
		color: #374151;
	}

	.clear-btn:disabled {
		background: #f9fafb;
		color: #d1d5db;
		border-color: #f3f4f6;
		cursor: not-allowed;
	}

	.done-btn {
		background: #3b82f6;
		color: white;
		border: 2px solid #3b82f6;
	}

	.done-btn:hover {
		background: #2563eb;
		border-color: #2563eb;
		transform: translateY(-1px);
	}

	@media (max-width: 640px) and (min-width: 481px) {
		.label-picker-dropdown {
			position: fixed;
			top: 20%;
			left: 45%;
			transform: translateX(-50%);
			min-width: 420px;
			max-width: calc(100vw - 2rem);
			animation: slideUpMobile 0.25s ease-out;
		}

		.label-picker-dropdown.position-below {
			animation: slideDownMobile 0.25s ease-out;
		}

		@keyframes slideUpMobile {
			from {
				opacity: 0;
				transform: translateX(-50%) translateY(10px);
			}
			to {
				opacity: 1;
				transform: translateX(-50%) translateY(0);
			}
		}

		@keyframes slideDownMobile {
			from {
				opacity: 0;
				transform: translateX(-50%) translateY(-10px);
			}
			to {
				opacity: 1;
				transform: translateX(-50%) translateY(0);
			}
		}

		.dropdown-header,
		.dropdown-footer {
			padding: 1rem;
		}

		.label-option {
			padding: 1rem;
		}

		.dropdown-content {
			max-height: calc(80vh - 140px);
		}

		.clear-btn,
		.done-btn {
			padding: 1rem;
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.label-picker-dropdown {
			position: fixed;
			top: 50%;
			left: 43%;
			transform: translate(-50%, -50%);
			bottom: auto;
			right: auto;
			margin-bottom: 0;
			width: calc(100vw - 2rem);
			max-width: 350px;
			max-height: 80vh;
			border-radius: 12px;
			animation: slideInCenter 0.25s ease-out;
		}

		@keyframes slideInCenter {
			from {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0.95);
			}
			to {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
		}

		.dropdown-footer {
			flex-direction: column;
			gap: 0.5rem;
		}

		.clear-btn,
		.done-btn {
			width: 100%;
		}
	}
</style>
