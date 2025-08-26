import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { username } = params;
    
    // Basic validation
    if (!username || username.trim() === '') {
        throw error(404, 'User not found');
    }

    // In a real app, you might validate the username format here
    // and check if the user exists in your database

    return {
        username: username
    };
};
