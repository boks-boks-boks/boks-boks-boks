import { redirect, type ClientInit } from "@sveltejs/kit";
import { isAuthenticated} from '$lib/stores/auth';
import { getUserProfile } from "$lib";
import { get } from 'svelte/store'

export const init: ClientInit = async () => {
    if (get(isAuthenticated)) {
        try {
                const profile = await getUserProfile() 
        } catch (error) {
            redirect(300, "/login")
        }
    }
} 