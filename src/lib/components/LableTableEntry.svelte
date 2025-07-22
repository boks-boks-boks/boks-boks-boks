<script lang="ts">
    let {children} = $props()
</script>


<div class="entry-container entry-shadow-medium">
    <div class="left-container">
        {@render children?.()}

        <p class="description">descriptive</p>
    </div>
    <div class="right-container">
        <span class="clickable">🏷️</span>
        <span class="clickable">✏️</span>
    </div>
</div>


<style>
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

    .description {
        font-size: small;
    }

    .entry-shadow-medium {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

    .clickable {
        cursor: pointer;
    }

    @media (max-width: 480px) {
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
            gap: 4rem;
        }

        .right-container {
            display: flex;
            align-items: center;
            gap: 1.5rem
        }
	}

    @media (max-width: 375px) {
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
            gap: 1.5rem;
        }

        .right-container {
            display: flex;
            align-items: center;
            gap: 1.5rem
        }
	}
</style>