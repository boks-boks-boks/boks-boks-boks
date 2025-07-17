<script>
	export let label;
	export let type = 'text';
	export let value = '';
	export let placeholder = '';
	export let disabled = false;
	export let required = false;
	export let id = '';
	export let error = '';
</script>

<div class="form-group">
	{#if label}
		<label for={id} class="form-label">{label}</label>
	{/if}
	<input
		{id}
		{type}
		{placeholder}
		{disabled}
		{required}
		bind:value
		class="form-input"
		class:error
	/>
	{#if error}
		<div class="form-error">{error}</div>
	{/if}
</div>

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-label {
		display: block;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.form-input {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
		font-family: inherit;
	}

	.form-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-input:disabled {
		background-color: #f9fafb;
		cursor: not-allowed;
	}

	.form-input::placeholder {
		color: #9ca3af;
	}

	.form-input.error {
		border-color: #dc2626;
	}

	.form-input.error:focus {
		border-color: #dc2626;
		box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
	}

	.form-error {
		color: #dc2626;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
