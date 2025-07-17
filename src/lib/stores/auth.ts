import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';

export const accessToken = writable<string | null>(null);
export const isAuthenticated = derived(accessToken, $accessToken => !!$accessToken);

if (browser) {
    const token = localStorage.getItem('token');
    if (token) {
        accessToken.set(token);
    }
}

export function setToken(token: string): void {
    accessToken.set(token);
    if (browser) {
        localStorage.setItem('token', token);
    }
}

export function logout(): void {
    accessToken.set(null);
    if (browser) {
        localStorage.removeItem('token');
    }
}