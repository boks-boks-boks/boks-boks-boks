<script lang="ts">
	import type { Box } from '../api';
	import Card from './Card.svelte';
	
	export let box: Box;
	export let href: string = '';
	
	// Calculate item count - handle case where items might not be loaded
	$: itemCount = box.items?.length ?? 0;
</script>

<a {href} class="box-card-link">
	<Card shadow="medium" hover>
		<div class="box-card">
			<div class="box-icon">📦</div>
			<div class="box-content">
				<h3 class="box-title">{box.title}</h3>
				<p class="box-stats">
					Click to view items
				</p>
			</div>
			<div class="box-arrow">→</div>
		</div>
	</Card>
</a>

<style>
	.box-card-link {
		text-decoration: none;
		color: inherit;
		display: block;
		transition: transform 0.2s ease;
	}
	
	.box-card-link:hover {
		transform: translateY(-2px);
	}
	
	.box-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem;
	}
	
	.box-icon {
		font-size: 2rem;
		opacity: 0.8;
	}
	
	.box-content {
		flex: 1;
		min-width: 0;
	}
	
	.box-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.box-stats {
		margin: 0.25rem 0 0 0;
		font-size: 0.875rem;
		color: #6b7280;
	}
	
	.box-arrow {
		color: #9ca3af;
		font-size: 1.25rem;
		font-weight: bold;
		transition: color 0.2s ease, transform 0.2s ease;
	}
	
	.box-card-link:hover .box-arrow {
		color: #3b82f6;
		transform: translateX(4px);
	}
	
	@media (max-width: 768px) {
		.box-card {
			padding: 0.25rem;
		}
		
		.box-icon {
			font-size: 1.5rem;
		}
		
		.box-title {
			font-size: 1rem;
		}
	}
</style>
