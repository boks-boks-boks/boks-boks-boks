import { browser } from "$app/environment";
import { writable } from "svelte/store";

enum Lang {
    EN = "en",
    FR = "fr"
}

const stored = browser ? localStorage.getItem("lang") : null
const lang = isLang(stored) ? stored : Lang.EN
export const language = writable<Lang>(lang);

function isLang(value: any): value is Lang {
    return Object.values(Lang).includes(value as Lang);
}

export function setLang(lang: string) {
    if(isLang(lang)) {
        language.set(lang);
    }
}

if(browser) {
    language.subscribe(value => {
        localStorage.setItem("lang", value || "");
    });
}
