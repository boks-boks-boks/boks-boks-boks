import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { username } = params;
    
    if (!username || username.trim() === '') {
        throw error(404, 'User not found');
    }

    return {
        username: username
    };
};
