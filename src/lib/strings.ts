import { derived, get, writable } from "svelte/store";
import { browser } from '$app/environment';
import { language } from "$lib/stores/lang";

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

export const translateStore = derived([language, stringsLoaded], ([$language, $loaded]) => {
    return (id: string) => {
        if (!browser || !$loaded) {
            return id;
        }

        let currentLang = $language || 'En';
        
        return strings[id]?.[currentLang] || strings[id]?.['En'] || id;
    };
});
