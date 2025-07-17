<script>
	export let type = 'info'; // 'success', 'error', 'warning', 'info'
	export let dismissible = false;
	export let show = true;

	function dismiss() {
		show = false;
	}
</script>

{#if show}
	<div class="alert alert-{type}">
		<slot />
		{#if dismissible}
			<button class="alert-dismiss" on:click={dismiss}>×</button>
		{/if}
	</div>
{/if}

<style>
	.alert {
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		font-weight: 500;
		position: relative;
		border: 1px solid;
	}

	.alert-success {
		background: #f0fdf4;
		color: #166534;
		border-color: #bbf7d0;
	}

	.alert-error {
		background: #fef2f2;
		color: #dc2626;
		border-color: #fecaca;
	}

	.alert-warning {
		background: #fffbeb;
		color: #d97706;
		border-color: #fed7aa;
	}

	.alert-info {
		background: #eff6ff;
		color: #1d4ed8;
		border-color: #bfdbfe;
	}

	.alert-dismiss {
		position: absolute;
		top: 0.5rem;
		right: 0.75rem;
		background: none;
		border: none;
		font-size: 1.25rem;
		font-weight: bold;
		cursor: pointer;
		color: inherit;
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}

	.alert-dismiss:hover {
		opacity: 1;
	}
</style>
