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
    token: string;
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