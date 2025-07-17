<script>
	export let icon;
	export let title;
	export let description;
</script>

<div class="feature-card">
	<div class="feature-icon">{icon}</div>
	<h3 class="feature-title">{title}</h3>
	<p class="feature-description">{description}</p>
</div>

<style>
	.feature-card {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-title {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}

	.feature-description {
		margin: 0;
		color: #6b7280;
		line-height: 1.6;
	}
</style>
