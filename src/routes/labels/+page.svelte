<script lang="ts">
    import Label from "$lib/components/Label.svelte";
    import LableTableEntry from "$lib/components/LableTableEntry.svelte";
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import CreateLabelModal from "$lib/components/CreateLabelModal.svelte";
    import { type LabelModel } from "$lib";

    let showCreateLabelModal = false
    
    let mockedLables = [
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
    ]

    function openCreateLabelModal() {
        showCreateLabelModal = true
    }

    function closeCreateLabelModal() {
        showCreateLabelModal = false
    }

    function handleLabelCreated(event: CustomEvent<LabelModel>) {
        console.log("test")
    }
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
        <div class="label-info">
            <div class="lable-title-section">
                <div class="label-icon">🏷️</div>
                <div>
                    <h1 class="label-title">Labels</h1>
                    <p class="label-stats">
                        12 labels
                    </p>
                </div>
            </div>
            <div class="label-actions">
                <Button variant="primary" size="medium" on:click={openCreateLabelModal}>
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

<CreateLabelModal 
    isOpen={showCreateLabelModal}
    on:close={closeCreateLabelModal}
    on:labelCreated={handleLabelCreated}
/>

<style>
    .label-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .box-header {
		margin-bottom: 2rem;
	}

	.label-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.lable-title-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.label-icon {
		font-size: 3rem;
		opacity: 0.8;
	}

	.label-title {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
	}

	.label-stats {
		margin: 0.25rem 0 0 0;
		color: #6b7280;
		font-size: 1rem;
	}

	.label-actions {
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
		.label-info {
			flex-direction: column;
			align-items: stretch;
			gap: 1.5rem;
		}

		.lable-title-section {
			justify-content: center;
			text-align: center;
		}

		.label-actions {
			justify-content: center;
		}

		.label-title {
			font-size: 1.75rem;
		}
    }

	@media (max-width: 480px) {
		.label-actions {
			flex-direction: column;
        }

        .lable-title-section {
            display: flex;
            justify-content: space-around;
        }
	}
</style>