<script lang="ts">
    import Label from './Label.svelte';
    import type { LabelModel } from '$lib/api';

    interface Props {
        labels: LabelModel[];
        size?: 'small' | 'medium' | 'large';
    }

    let { labels, size = 'small' }: Props = $props();

    let sortedLabels = $derived(labels.sort((a, b) => a.title.length - b.title.length))
</script>

<div class="label-list">
    {#each sortedLabels as label (label.id)}
        <Label color={label.color} {size}>
            {label.title}
        </Label>
    {/each}
</div>

<style>
    .label-list {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: center;
    }

    @media (max-width: 640px) {
        .label-list {
            gap: 0.25rem;
        }
    }

    @media (max-width: 480px) {
        .label-list {
            gap: 0.25rem;
        }
    }
</style>
