<script lang="ts">
    import Label from "$lib/components/Label.svelte";
    import LableTableEntry from "$lib/components/LableTableEntry.svelte";
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    
    let mockedLables = [
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
    ]
</script>

<svelte:head>
	<title>{'Labels'} - Boks-Boks-Boks</title>
</svelte:head>

<div class="box-header">
    <div class="breadcrumbs">
        <a href="/" class="breadcrumb-link">Home</a>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">Labels</span>
    </div>
    
    <Card shadow="large">
        <div class="box-info">
            <div class="box-title-section">
                <div class="box-icon">🏷️</div>
                <div>
                    <h1 class="box-title">Labels</h1>
                    <p class="box-stats">
                        12 labels
                    </p>
                </div>
            </div>
            <div class="box-actions">
                <Button variant="primary" size="medium" on:click={() => (console.log("test"))}>
                    + Add Label
                </Button>
            </div>
        </div>
    </Card>
</div>

<div class="label-container">
    {#each mockedLables as label}
        <LableTableEntry><Label color={label.color}>{label.title}</Label></LableTableEntry>
    {/each}
</div>

<style>
    .label-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .box-header {
		margin-bottom: 2rem;
	}

	.box-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.box-title-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.box-icon {
		font-size: 3rem;
		opacity: 0.8;
	}

	.box-title {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
	}

	.box-stats {
		margin: 0.25rem 0 0 0;
		color: #6b7280;
		font-size: 1rem;
	}

	.box-actions {
		display: flex;
		gap: 0.75rem;
	}

    .breadcrumbs {
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.breadcrumb-link {
		color: #3b82f6;
		text-decoration: none;
	}

	.breadcrumb-link:hover {
		text-decoration: underline;
	}

	.breadcrumb-separator {
		margin: 0 0.5rem;
	}

	.breadcrumb-current {
		color: #1f2937;
		font-weight: 500;
	}

    @media (max-width: 450px) {
		.box-info {
			flex-direction: column;
			align-items: stretch;
			gap: 1.5rem;
		}

		.box-title-section {
			justify-content: center;
			text-align: center;
		}

		.box-actions {
			justify-content: center;
		}

		.box-title {
			font-size: 1.75rem;
		}
    }

	@media (max-width: 480px) {
		.box-actions {
			flex-direction: column;
        }

        .box-title-section {
            display: flex;
            justify-content: space-around;
        }
	}
</style>