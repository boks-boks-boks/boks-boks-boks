<script>
	import { portal } from "svelte-portal";
	
	let { wrapper = $bindable(), isOpen, isDialog, children } = $props();
</script>

<div
	use:portal={"#portal"}
	bind:this={wrapper}
	class="wrapper"
	class:is-open={isOpen}
	role={isDialog ? 'dialog' : undefined}
	aria-label="color picker"
>
	{@render children()}
</div>

<style>
	.wrapper {
	padding: 8px;
	background-color: var(--cp-bg-color, white);
	border: 1px solid var(--cp-border-color, black);
	border-radius: 12px;
	width: max-content;
	display: none;
	position: absolute;
	z-index: var(--picker-z-index, 2);
}

    .is-open {
        display: block;
    }

    [role='dialog'] {
        position: absolute;
        top: 100%;
        left: 0;
    }
</style>
