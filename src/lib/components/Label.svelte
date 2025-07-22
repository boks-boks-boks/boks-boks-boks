<script lang="ts">
    let {children, color = '#FFFFFF'} = $props()

    let textColor: string = $state(backgroundColorToTextColor(color))

    function backgroundColorToTextColor(colorCode: string): string {
        let colorWithoutHash = colorCode.slice(1);
        let r = Number("0x"+colorWithoutHash.substring(0, 2))
        let g = Number("0x"+colorWithoutHash.substring(2, 4))
        let b = Number("0x"+colorWithoutHash.substring(4, 6))

        return r*0.299 + g*0.587 + b*0.114 > 120 ? "#000000" : "#ffffff"
    }
</script>

<p class="label" style="background-color: {color}; color: {textColor}">
    {@render children?.()}
</p>

<style>
    .label {
        display: inline-block;
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		text-decoration: none;
		font-weight: 450;
        cursor: default;
		text-align: center;
		border: none;
		font-size: 0.8rem;
		font-family: inherit;
		line-height: 1;
    }
</style>