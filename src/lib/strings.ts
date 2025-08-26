import { derived } from "svelte/store";
import { language } from "$lib/stores/lang";
import { page } from '$app/stores';

export const translateStore = derived([language, page], ([$language, $page]) => {
    return (id: string) => {
        const serverTranslations = $page.data?.translations;
        const serverDetectedLang = $page.data?.userLanguage;
        
        if (serverTranslations && Object.keys(serverTranslations).length > 0) {
            const currentLang = $language || serverDetectedLang || 'En';
            return serverTranslations[id]?.[currentLang] || serverTranslations[id]?.['En'] || id;
        }
        
        return id;
    };
});
