import { baseUrl } from './index';
import CryptoJS from 'crypto-js';

export async function unprotectedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    success?: boolean;
    message?: string;
    data?: {
        token?: string;
        user?: any;
    };
}

export function hashPassword(password: string): string {
    // Hash the password using SHA-256 with crypto-js
    return CryptoJS.SHA256(password).toString();
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const hashedPassword = hashPassword(credentials.password);
    
    const response = await unprotectedRequest(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: credentials.username,
            password: hashedPassword
        })
    });

    const data = await response.json();
    return data;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface RegisterResponse {
    message?: string;
    // Add other fields that the server might return
}

export async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
    const hashedPassword = hashPassword(credentials.password);
    
    const response = await unprotectedRequest(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: credentials.username,
            password: hashedPassword
        })
    });

    const data = await response.json();
    return data;
}

export interface UserProfile {
    username: string;
    id?: number;
    created_at?: string;
    // Add other user fields as needed
}

export async function protectedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Token might be expired, clear it
            localStorage.removeItem('auth_token');
            throw new Error('Authentication failed');
        }
        throw new Error(`Request failed with status ${response.status}`);
    }
    
    return response;
}

export async function getUserProfile(username: string): Promise<UserProfile> {
    const response = await protectedRequest(`${baseUrl}/user/${username}`);
    const data = await response.json();
    return data;
}

export async function logout(): Promise<void> {
    try {
        // Optionally call server logout endpoint
        await protectedRequest(`${baseUrl}/logout`, {
            method: 'POST'
        });
    } catch (error) {
        // Even if server logout fails, we still clear local storage
        console.warn('Server logout failed:', error);
    } finally {
        // Always clear local storage
        localStorage.removeItem('auth_token');
    }
}

export interface Box {
    id: string;
    title: string;
    items?: Item[];
}

export interface Item {
    id: string;
    title: string;
    amount?: number; // Optional since DTO might not include it yet
}

export interface APIResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export async function getBoxes(): Promise<Box[]> {
    const response = await protectedRequest(`${baseUrl}/api/boxes`);
    const apiResponse: APIResponse<Box[]> = await response.json();
    
    console.log('API boxes response:', apiResponse);
    
    if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to fetch boxes');
    }
    
    // Handle case where data is null/undefined but success is true (empty result)
    return apiResponse.data || [];
}

export async function getBoxItems(boxId: string): Promise<Item[]> {
    const response = await protectedRequest(`${baseUrl}/api/boxes/${boxId}/items`);
    const apiResponse: APIResponse<Item[]> = await response.json();
    
    console.log('API items response:', apiResponse);
    
    if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to fetch items');
    }
    
    // Handle case where data is null/undefined but success is true (empty result)
    return apiResponse.data || [];
}