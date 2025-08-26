import { derived } from "svelte/store";
import { language } from "$lib/stores/lang";
import { page } from '$app/stores';
import { Lang } from "$lib/stores/lang";

export const translateStore = derived([language, page], ([$language, $page]) => {
    return (id: string) => {
        const serverTranslations = $page.data?.translations;
        const serverDetectedLang = $page.data?.userLanguage;
        
        if (serverTranslations && Object.keys(serverTranslations).length > 0) {
            const currentLang = $language || serverDetectedLang || Lang.EN;
            return serverTranslations[id]?.[currentLang] || serverTranslations[id]?.[Lang.EN] || id;
        }
        
        return id;
    };
});
