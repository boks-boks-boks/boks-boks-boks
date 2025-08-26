import { browser } from "$app/environment";
import { writable } from "svelte/store";

enum Lang {
    EN = "En",
    FR = "Fr"
}

export const language = writable<Lang>(Lang.EN);

function isLang(value: any): value is Lang {
    return Object.values(Lang).includes(value as Lang);
}

export function setLang(lang: string) {
    if(isLang(lang)) {
        language.set(lang);
        
        if (browser) {
            const twoYears = 2 * 365 * 24 * 60 * 60; 
            document.cookie = `language=${lang}; max-age=${twoYears}; path=/; SameSite=Lax`;
        }
    }
}
