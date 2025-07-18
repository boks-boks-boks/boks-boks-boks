<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	
	export let isOpen = false;
	export let title = '';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	
	const dispatch = createEventDispatcher();
	
	function closeModal() {
		dispatch('close');
	}
	
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="modal-backdrop" 
		transition:fade={{ duration: 200 }}
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		tabindex="-1"
	>
		<div 
			class="modal-container {size}"
			transition:scale={{ duration: 200, start: 0.95 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="modal-header">
				<h2 id="modal-title" class="modal-title">{title}</h2>
				<button 
					class="modal-close" 
					on:click={closeModal}
					aria-label="Close modal"
				>
					✕
				</button>
			</div>
			
			<div class="modal-content">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}
	
	.modal-container {
		background: white;
		border-radius: 0.75rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	
	.modal-container.small {
		max-width: 400px;
	}
	
	.modal-container.medium {
		max-width: 500px;
	}
	
	.modal-container.large {
		max-width: 700px;
	}
	
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}
	
	.modal-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}
	
	.modal-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #6b7280;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
	}
	
	.modal-close:hover {
		background: #f3f4f6;
		color: #374151;
	}
	
	.modal-content {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}
	
	@media (max-width: 640px) {
		.modal-backdrop {
			padding: 0.5rem;
		}
		
		.modal-container {
			max-width: none;
			width: 100%;
		}
		
		.modal-header,
		.modal-content {
			padding: 1rem;
		}
		
		.modal-title {
			font-size: 1.125rem;
		}
	}
</style>
