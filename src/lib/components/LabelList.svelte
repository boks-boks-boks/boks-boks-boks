<script lang="ts">
    import Label from './Label.svelte';
    import type { LabelModel } from '$lib/api';
    import { onMount } from "svelte";

    interface Props {
        labels: LabelModel[];
        size?: 'small' | 'medium' | 'large';
        container?: HTMLElement;
    }

    let { labels, size = 'small', container }: Props = $props();

    let sortedLabels = $derived(labels.sort((a, b) => a.title.length - b.title.length));
    let visibleLabels = $state<LabelModel[]>([]);
    let hiddenCount = $state(0);

    function updateVisible() {
        if (!container) return;

        const parentWidth = container.clientWidth;
        let currentWidth = 0;
        let shown = [];

        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.visibility = "hidden";

        document.body.appendChild(div);

        for (let label of sortedLabels) {
            const labelSpan = document.createElement("span");
            labelSpan.textContent = label.title;
            div.appendChild(labelSpan);

            const w = labelSpan.getBoundingClientRect().width;
            if (currentWidth + w <= parentWidth) {
                shown.push(label);
                currentWidth += w;
            } else {
                break;
            }
        }

        document.body.removeChild(div);

        visibleLabels = shown;
        hiddenCount = sortedLabels.length - shown.length;
    }

    onMount(() => {
        if (!container) return;
        updateVisible();
        const resizeObs = new ResizeObserver(updateVisible);
        resizeObs.observe(container);
    });

</script>

<div class="label-list">
    {#each visibleLabels as label (label.id)}
        <Label color={label.color} {size}>
            {label.title}
        </Label>
    {/each}
    {#if hiddenCount > 0}
        <span class="px-2 py-1 bg-red-200 rounded">+{hiddenCount}</span>
    {/if}
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
