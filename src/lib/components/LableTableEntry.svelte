<script lang="ts">
    let {children} = $props()
</script>

<div class="entry-border">
    <div class="entry-container">
        <div class="left-container">
            {@render children?.()}

            <p>descriptive</p>
        </div>
        <div class="right-container">
            <span>🏷️</span>
            <span>✏️</span>
        </div>
    </div>
</div>

<style>
    .entry-border {
        border-color: #e3e4e5;
        border-style: solid;
        border-width: 1px;
    }

    .entry-container {
        background-color: white;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        padding: 0 1rem 0 1rem
    }

    .left-container {
        display: flex;
        align-items: center;
        gap: 9rem;
    }

    .right-container {
        display: flex;
        align-items: center;
        gap: 1.5rem
    }
</style>