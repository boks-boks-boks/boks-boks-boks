<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let variant: 'primary' | 'secondary' | 'critical' = 'primary';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let disabled = false;
	export let fullWidth = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let href: string | null = null;

	function handleClick(event: Event) {
		if (!disabled) {
			dispatch('click', event);
		}
	}

	$: classes = [
		'btn',
		`btn-${variant}`,
		`btn-${size}`,
		fullWidth ? 'btn-full' : '',
		disabled ? 'btn-disabled' : ''
	].filter(Boolean).join(' ');
</script>

{#if href}
	<a {href} class={classes} class:disabled on:click={handleClick}>
		<slot />
	</a>
{:else}
	<button type={type} class={classes} {disabled} on:click={handleClick}>
		<slot />
	</button>
{/if}

<style>
	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		text-align: center;
		transition: all 0.2s ease;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		font-family: inherit;
		line-height: 1;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover:not(:disabled):not(.disabled) {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.btn-secondary {
		background: white;
		color: #3b82f6;
		border: 2px solid #3b82f6;
	}

	.btn-secondary:hover:not(:disabled):not(.disabled) {
		background: #3b82f6;
		color: white;
		transform: translateY(-1px);
	}

	.btn-critical {
		background: #dc2626;
		color: white;
	}

	.btn-critical:hover:not(:disabled):not(.btn.disabled) {
		background: #c00e0e;
		transform: translateY(-1px);
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.btn-medium {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
	}

	.btn-large {
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	.btn-full {
		width: 100%;
	}

	.btn:disabled,
	.btn.disabled {
		background: #9ca3af;
		color: white;
		cursor: not-allowed;
		transform: none;
		border-color: #9ca3af;
	}

	.btn-secondary:disabled,
	.btn-secondary.disabled {
		background: #f3f4f6;
		color: #9ca3af;
		border-color: #d1d5db;
	}
</style>
