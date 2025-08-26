import translationsData from '$lib/assets/strings/strings.json';

interface Translations {
    [key: string]: {
        [language: string]: string;
    };
}

let translationsCache: Translations | null = null;

export function getTranslations(): Translations {
    if (!translationsCache) {
        try {
            translationsCache = translationsData as Translations;
        } catch (error) {
            console.error('Failed to load translations:', error);
            translationsCache = {};
        }
    }
    return translationsCache || {};
}