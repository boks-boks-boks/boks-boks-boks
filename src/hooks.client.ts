import { redirect, type ClientInit } from "@sveltejs/kit";
import { isAuthenticated, currentUser } from '$lib/stores/auth';
import { getUserProfile, logout } from "$lib";
import { get } from 'svelte/store'

export const init: ClientInit = async () => {
    if (get(isAuthenticated)) {
        try {
            const user = get(currentUser)
            if (user?.username) {
                const profile = await getUserProfile(user.username) 
            }
        } catch (error) {
            redirect(300, "/login")
        }
    }
} 