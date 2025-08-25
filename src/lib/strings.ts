import { language } from "$lib";
import { derived, get, writable } from "svelte/store";
import { browser } from '$app/environment';

let strings: Record<string, Record<string, string>> = {};
export const stringsLoaded = writable(false);

if (browser) {
    fetch('/strings.json')
    .then(res => res.json())
    .then(data => { 
        strings = data; 
        stringsLoaded.set(true);
    })
    .catch(err => console.error('Failed to load translations:', err));
}

export function t(id: string): string {
    const lang = get(language) || 'En';
    console.log(strings)
    return strings[id]?.[lang] || strings[id]?.['En'] || id;
}

export const translateStore = derived([language, stringsLoaded], ([$lang, $loaded]) => (id: string) => {
    if (!$loaded) return id;
    return strings[id]?.[$lang] || strings[id]?.['En'] || id;
});
