<script lang="ts">
    import Label from "$lib/components/Label.svelte";
    import LableTableEntry from "$lib/components/LableTableEntry.svelte";

    let mockedLables = [
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
        {"title": "outil", "color": "#259361"},
    ]
</script>

{#each mockedLables as label}
    <LableTableEntry><Label color={label.color}>{label.title}</Label></LableTableEntry>
{/each}