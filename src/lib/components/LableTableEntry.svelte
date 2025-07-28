<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { LabelModel } from '$lib';
    import UpdateLabelModal from './UpdateLabelModal.svelte';

    interface Props {
        label: LabelModel;
        children: any;
    }

    let { label, children }: Props = $props();
    
    const dispatch = createEventDispatcher();
    
    let editTitle = $state(label.title);
    let editDescription = $state(label.description);

    let showUpdateLabelModal = $state(false)

    function openUpdateLabelModal() {
        showUpdateLabelModal = true
    }

    function closeUpdateLabelModal() {
        showUpdateLabelModal = false
    }

    function cancelEditing() {
        editTitle = label.title;
        editDescription = label.description;
    }

    function saveEdit() {
        if (!editTitle.trim()) return;
        
        dispatch('update', {
            ...label,
            title: editTitle.trim(),
            description: editDescription.trim()
        });
    }

    function handleLabelDeletion(event: CustomEvent<string>) {
        const deletedId = event.detail

		dispatch("delete", deletedId)
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            saveEdit();
        } else if (event.key === 'Escape') {
            cancelEditing();
        }
    }
</script>


<div class="entry-container">
    <div class="label-cell">
        {@render children?.()}
    </div>
    
    <div class="description-cell">
        <div class="description-content">
            <p class="description-text">{label.description || 'No description'}</p>
        </div>
    </div>
    
    <div class="actions-cell">
            <button class="action-btn edit-btn" onclick={openUpdateLabelModal} title="Edit label">
                ✏️
            </button>
    </div>
</div>

<UpdateLabelModal 
    labelId={label.id}
    title= {label.title}
    description={label.description}
    color={label.color}
    isOpen={showUpdateLabelModal}
	on:close={closeUpdateLabelModal}
    on:labelDeleted={handleLabelDeletion}
/>


<style>
    .entry-container {
        display: grid;
        grid-template-columns: 1fr 2fr 120px;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.2s;
        align-items: center;
    }

    .entry-container:hover {
        background-color: #f8fafc;
    }

    .entry-container:last-child {
        border-bottom: none;
    }

    .label-cell {
        display: flex;
        align-items: center;
        min-width: 100px;
    }

    .description-cell {
        min-width: 150px;
    }

    .description-content {
        padding: 0;
    }

    .description-text {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
        line-height: 1.4;
    }

    .actions-cell {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: all 0.2s;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        touch-action: manipulation; /* Improves touch responsiveness */
    }

    .edit-btn:hover {
        background: #f3f4f6;
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
        .entry-container {
            grid-template-columns: 1fr 1.5fr 80px;
            padding: 0.75rem 1rem;
            gap: 0.5rem;
        }

        .action-btn {
            font-size: 0.875rem;
            min-width: 28px;
            height: 28px;
            padding: 0.25rem;
        }
    }

    @media (max-width: 640px) {
        .entry-container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 1rem;
            position: relative;
        }

        .label-cell {
            order: 1;
            justify-content: flex-start;
            min-width: auto;
        }

        .description-cell {
            order: 2;
            min-width: auto;
        }

        .actions-cell {
            order: 3;
            position: absolute;
            top: 1rem;
            right: 1rem;
            flex-direction: row;
            gap: 0.5rem;
        }

        .description-text {
            font-size: 0.875rem;
            line-height: 1.4;
        }
    }

    @media (max-width: 480px) {
        .entry-container {
            padding: 0.75rem;
            gap: 0.5rem;
        }

        .actions-cell {
            top: 0.75rem;
            right: 0.75rem;
            gap: 0.25rem;
        }

        .action-btn {
            font-size: 0.75rem;
            min-width: 28px;
            height: 28px;
            padding: 0.25rem;
        }

        .description-text {
            font-size: 0.8rem;
        }
    }
</style>