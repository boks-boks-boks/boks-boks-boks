<script lang="ts">
    import Label from "$lib/components/Label.svelte";
    import LableTableEntry from "$lib/components/LableTableEntry.svelte";
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import CreateLabelModal from "$lib/components/CreateLabelModal.svelte";
    import { getLabel, type LabelModel } from "$lib";
    import { setLabels, userLabels } from "$lib/stores/labels";
    import { goto } from '$app/navigation';
    import { isAuthenticated } from '$lib/stores/auth';
    import { translateStore } from '$lib/strings';

    let showCreateLabelModal = $state(false);

    let labels = $state<LabelModel[]>([]);

    $effect(() => {
        if (!$isAuthenticated) {
			goto('/login');
			return;
		}

        if($userLabels == null) {
            getLabel().then(l => {
                setLabels(l)
                labels = $userLabels!
            })
        } else {
            labels = $userLabels!
        }
    })

    let labelCount = $derived(labels.length);

    function openCreateLabelModal() {
        showCreateLabelModal = true;
    }

    function closeCreateLabelModal() {
        showCreateLabelModal = false;
    }

    function handleLabelCreated(event: CustomEvent<LabelModel>) {
        const newLabel = event.detail;
        console.debug('New label received:', newLabel);
        labels = [...labels, newLabel];
        setLabels(labels)
    }

    function handleLabelUpdated(updatedLabel: LabelModel) {
        labels = labels.map(label => 
            label.id === updatedLabel.id ? updatedLabel : label
        );
        setLabels(labels)
    }

    function handleLabelDeleted(labelId: string) {
        labels = labels.filter(label => label.id !== labelId);
        setLabels(labels)
    }
</script>

<svelte:head>
	<title>{$translateStore('labels')} - Boks-Boks-Boks</title>
</svelte:head>
<div class="labels-container">
    <div class="box-header">
        <div class="breadcrumbs">
            <a href="/" class="breadcrumb-link">{$translateStore('home')}</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">{$translateStore('labels')}</span>
        </div>
        
        <Card shadow="large">
            <div class="label-info">
                <div class="lable-title-section">
                    <div class="label-icon">🏷️</div>
                    <div>
                        <h1 class="label-title">{$translateStore('labels')}</h1>
                        <p class="label-stats">
                            {labelCount} {labelCount === 1 ? $translateStore('label') : $translateStore('label_plural')}
                        </p>
                    </div>
                </div>
                <div class="label-actions">
                    <Button variant="primary" size="medium" on:click={openCreateLabelModal}>
                        {$translateStore('add_label')}
                    </Button>
                </div>
            </div>
        </Card>
    </div>

    <div class="label-container">
        <div class="labels-header">
            <h2 class="labels-section-title">{$translateStore('all_labels')}</h2>
            {#if labelCount === 0}
                <p class="empty-state">{$translateStore('no_labels_yet')}</p>
            {/if}
        </div>
        
        {#if labelCount > 0}
            <div class="labels-table">
                <div class="table-header">
                    <div class="table-header-cell label-column">{$translateStore('labels')}</div>
                    <div class="table-header-cell description-column">{$translateStore('description')}</div>
                    <div class="table-header-cell actions-column">{$translateStore('actions')}</div>
                </div>
                
                {#each labels as label}
                    {console.debug(label)}
                    <LableTableEntry 
                        {label}
                        on:update={(e) => handleLabelUpdated(e.detail)}
                        on:delete={(e) => handleLabelDeleted(e.detail)}
                    >
                        <Label color={label.color}>{label.title}</Label>
                    </LableTableEntry>
                {/each}
            </div>
        {/if}
    </div>
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
        gap: 1.5rem;
    }

    .labels-header {
        margin-bottom: 1rem;
    }

    .labels-section-title {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
    }

    .empty-state {
        color: #6b7280;
        font-style: italic;
        margin: 2rem 0;
        text-align: center;
        padding: 2rem;
        background: #f9fafb;
        border-radius: 8px;
        border: 2px dashed #d1d5db;
    }

    .labels-table {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid #e5e7eb;
    }

    .table-header {
        display: grid;
        grid-template-columns: 1fr 2fr 120px;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
        font-weight: 600;
        color: #374151;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .table-header-cell {
        display: flex;
        align-items: center;
    }

    .label-column {
        min-width: 100px;
    }

    .description-column {
        min-width: 150px;
    }

    .actions-column {
        justify-content: center;
    }

    .box-header {
        margin-bottom: 2rem;
    }

    .labels-container {
        padding: 1rem;
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

    @media (max-width: 768px) {
        .table-header {
            grid-template-columns: 1fr 1.5fr 80px;
            padding: 0.75rem 1rem;
            gap: 0.5rem;
            font-size: 0.75rem;
        }

        .labels-section-title {
            font-size: 1.25rem;
        }

        .empty-state {
            padding: 1.5rem;
            font-size: 0.875rem;
        }
    }

    @media (max-width: 640px) {
        .table-header {
            display: none; /* Hide header on very small screens */
        }

        .labels-table {
            border-radius: 8px;
        }

        .label-container {
            gap: 1rem;
        }

        .labels-section-title {
            font-size: 1.125rem;
        }
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
            font-size: 1.5rem;
        }

        .label-icon {
            font-size: 2.5rem;
        }

        .box-header {
            margin-bottom: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        .label-actions {
            flex-direction: column;
        }

        .lable-title-section {
            display: flex;
            justify-content: center;
            gap: 0.75rem;
        }

        .breadcrumbs {
            margin-bottom: 1rem;
        }

        .label-container {
            gap: 0.75rem;
        }
    }

    @media (max-width: 360px) {
        .label-title {
            font-size: 1.25rem;
        }

        .label-icon {
            font-size: 2rem;
        }

        .empty-state {
            padding: 1rem;
            font-size: 0.8rem;
        }

        .breadcrumbs {
            font-size: 0.8rem;
        }
    }
</style>