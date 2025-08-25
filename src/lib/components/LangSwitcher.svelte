<script lang="ts">
import { language, setLang } from "$lib";

export function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
        if (!node.contains(event.target as Node)) {
            callback();
        }
    };
    document.addEventListener('click', handleClick, true);
    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
}

const langs = [
    { code: "En", label: "English" },
    { code: "Fr", label: "Français" }
];

let open = false;

function selectLang(code: string) {
    setLang(code);
    open = false;
}
</script>

<div class="lang-switcher-wrapper" use:clickOutside={() => (open = false)}>
    <button class="language lang-btn" aria-label="Change language" on:click={() => (open = !open)}>
    {$language}
    <svg class="chevron" width="16" height="16" viewBox="0 0 16 16" style="transform: rotate({open ? 180 : 0}deg);"><path d="M4 6l4 4 4-4" stroke="#333" stroke-width="2" fill="none"/></svg>
    </button>
    {#if open}
    <div class="lang-dropdown">
        {#each langs as lang}
            <button class="lang-option" on:click={() => selectLang(lang.code)} aria-label={lang.label}>
                {lang.label}
            </button>
        {/each}
        </div>
    {/if}
</div>

<style>
.lang-switcher-wrapper {
    position: relative;
    display: inline-block;
}
.lang-btn {
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.5em;
    transition: background 0.2s;
}
.lang-btn:hover, .lang-btn:focus {
    background: #f1f5f9;
}
.chevron {
    transition: transform 0.2s;
}
.lang-dropdown {
    position: absolute;
    top: 100%;
    left: -10px;
    min-width: 120px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    z-index: 10;
    display: flex;
    flex-direction: column;
    padding: 0.5em 0;
    margin-top: 10px;
}
.lang-option {
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    padding: 0.5em 1em;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
}
.lang-option:hover, .lang-option:focus {
    background: #f1f5f9;
}
@media (max-width: 600px) {
    .lang-dropdown {
        min-width: 100px;
        font-size: 0.95em;
    }
    
    .lang-btn {
        font-size: 0.95em;
    }
}
</style>
