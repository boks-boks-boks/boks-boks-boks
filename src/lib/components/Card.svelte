<script>
	export let padding = 'large'; // 'small', 'medium', 'large'
	export let shadow = 'medium'; // 'small', 'medium', 'large'
	export let height = 'auto'; // 'auto', 'min'
	export let hover = false;
</script>

<div 
	class="card card-padding-{padding} card-shadow-{shadow} card-height-{height}"
	class:card-hover={hover}
>
	<slot />
</div>

<style>
	.card {
		background: white;
		border-radius: 12px;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.card-height-min {
		min-height: 147px;
	}

	.card-padding-small {
		padding: 1rem;
	}

	.card-padding-medium {
		padding: 2rem;
	}

	.card-padding-large {
		padding: 3rem;
	}

	.card-shadow-small {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.card-shadow-medium {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.card-shadow-large {
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
	}

	.card-hover:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}
</style>
