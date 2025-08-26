import type { Handle } from '@sveltejs/kit';
import { Lang } from '$lib';

export const handle: Handle = async ({ event, resolve }) => {
    const cookieLang = event.cookies.get('language');
    
    const userLanguage = cookieLang || Lang.EN;
    
    event.locals.language = userLanguage;
    
    return resolve(event);
};
