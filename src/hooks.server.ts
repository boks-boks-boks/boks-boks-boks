import type { Handle } from '@sveltejs/kit';
import { Lang } from '$lib';

export const handle: Handle = async ({ event, resolve }) => {
    const cookieLang = event.cookies.get('language');
    const cookieJwt = event.cookies.get('jwt')
    
    const userLanguage = cookieLang || Lang.EN;
    const userToken = cookieJwt || null
    
    event.locals.language = userLanguage;
    event.locals.jwt = userToken
    
    return resolve(event);
};
