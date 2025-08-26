import { getTranslations } from '$lib/server/translation.js';

export const load = async ({locals}) => {
    return {
        translations: getTranslations(),
        userLanguage: locals.language,
    }
}