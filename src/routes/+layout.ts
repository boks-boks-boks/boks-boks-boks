import { language } from '$lib/stores/lang.js';

export const load = async ({ data }) => {
    if (data?.userLanguage) {
        language.set(data.userLanguage as any);
    }
    
    return data;
};
