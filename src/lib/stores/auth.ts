import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import type { UserProfile } from '../api';

export const accessToken = writable<string | null>(null);
export const currentUser = writable<UserProfile | null>(null);
export const isAuthenticated = derived(accessToken, $accessToken => !!$accessToken);

if (browser) {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('current_user');
    
    if (token) {
        accessToken.set(token);
    }
    
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            currentUser.set(user);
        } catch (error) {
            console.warn('Failed to parse stored user data:', error);
            localStorage.removeItem('current_user');
        }
    }
}

export function setToken(token: string): void {
    accessToken.set(token);
    if (browser) {
        localStorage.setItem('auth_token', token);
    }
}

export function setUser(user: UserProfile): void {
    currentUser.set(user);
    if (browser) {
        localStorage.setItem('current_user', JSON.stringify(user));
    }
}

export function clearAuth(): void {
    accessToken.set(null);
    currentUser.set(null);
    if (browser) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }
}
