<script lang="ts">
    import Label from './Label.svelte';
    import type { LabelModel } from '$lib/api';
    import { onMount, tick } from "svelte";

    interface Props {
        labels: LabelModel[];
        size?: 'small' | 'medium' | 'large';
        container?: HTMLElement;
    }

    let { labels, size = 'small', container }: Props = $props();

    let sortedLabels = $derived(labels.sort((a, b) => a.title.length - b.title.length));
    let showedCount = $state(0);
    let hiddenCount = $derived(sortedLabels.length - showedCount);
    let visibleLabels = $derived(sortedLabels.slice(0, showedCount));
    let measurementContainer: HTMLDivElement;

    function updateVisible() {
        if (!container || !measurementContainer) return;

        const parentWidth = container.clientWidth;
        
        let currentWidth = 0;
        showedCount = 0;

        const measurementLabels = measurementContainer.children;

        for (let i = 0; i < sortedLabels.length && i < measurementLabels.length; i++) {
            const labelElement = measurementLabels[i] as HTMLElement;
            
            const w = labelElement.getBoundingClientRect().width;
            if (currentWidth + w <= parentWidth) {
                showedCount = showedCount + 1;
                currentWidth += w;
            } else {
                break;
            }
        }
    }

    onMount(async () => {
        await tick(); // ensure DOM is loaded
        const checkAndUpdate = () => {
            if (measurementContainer) {
                updateVisible();
                const resizeObs = new ResizeObserver(updateVisible);
                if (!container) return;
                resizeObs.observe(container);
            } else {
                requestAnimationFrame(checkAndUpdate);
            }
        };
        
        checkAndUpdate();
    });

</script>

<div class="label-list">
    {#each visibleLabels as label (label.id)}
        <Label color={label.color} {size}>
            {label.title}
        </Label>
    {/each}
    {#if hiddenCount > 0}
        <span class="label-overflow">+{hiddenCount}</span>
    {/if}
</div>

<!-- Hidden measurement container -->
<div bind:this={measurementContainer} class="measurement-container label-list">
    {#each sortedLabels as label (label.id)}
        <Label color={label.color} {size}>
            <span class="measurement-label">{label.title}</span>
        </Label>
    {/each}
    {#if hiddenCount > 0}
        <span class="label-overflow measurement-label">+{hiddenCount}</span>
    {/if}
</div>

<style>
    .label-list {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .label-overflow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-family: inherit;
        text-align: center;
        background: #f3f4f6;
        padding: 0.2rem 0.5rem;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        transition: all 0.2s ease;
    }

    .label-overflow:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .measurement-container {
        position: absolute;
        top: -9999px;
        left: -9999px;
        visibility: hidden;
        pointer-events: none;
    }

    .measurement-label {
        padding: 0.25rem 0.6rem;
        font-size: 0.75rem;
        white-space: nowrap;
    }

    @media (max-width: 640px) {
        .label-list {
            gap: 0.2rem;
        }
    }

    @media (max-width: 480px) {
        .label-list {
            gap: 0.2rem;
        }
    }
</style>
