import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async ({locals, url}) => {
    if (locals.jwt) {
        redirect(307 ,"/")
    }
    return {
        redirectTo: url.searchParams.get('redirectTo') ?? '/'
    }
}