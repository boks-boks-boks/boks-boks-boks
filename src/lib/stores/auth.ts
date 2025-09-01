import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import type { UserProfile } from '../api';

export const userToken = writable<string | null>(null);
export const currentUser = writable<UserProfile | null>(null);
export const isHydrationComplete = writable<boolean>(false);
export const isAuthenticated = derived([userToken, isHydrationComplete], ([$userToken, $isHydrationComplete]) => {
    // During SSR or before hydration, use the userToken value directly
    // After hydration, use the reactive userToken
    return !!$userToken;
});

isAuthenticated.subscribe((value) => {
    console.log('isAuthenticated:', value)
})

export function setHydrationComplete(complete: boolean) {
    isHydrationComplete.set(complete);
}

export function setToken(token: string) {
        userToken.set(token);
        
        if (browser) {
            const twoYears = 2 * 365 * 24 * 60 * 60; 
            document.cookie = `jwt=${token}; max-age=${twoYears}; path=/; SameSite=Lax`;
        }
}

export function clearAuth(): void {
    userToken.set(null);
    currentUser.set(null);
    if (browser) {
        // Clear the JWT cookie
        document.cookie = 'jwt=; max-age=0; path=/; SameSite=Lax';
    }
}
