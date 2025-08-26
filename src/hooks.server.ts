import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const cookieLang = event.cookies.get('language');
    
    const userLanguage = cookieLang || 'En';
    
    event.locals.language = userLanguage;
    
    return resolve(event);
};
