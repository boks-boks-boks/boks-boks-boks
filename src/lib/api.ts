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
    try {
        const response = await protectedRequest(`${baseUrl}/api/user/${username}`);
        const apiResponse: APIResponse<UserProfile> = await response.json();

        if (!apiResponse.success || !apiResponse.data) {
            throw new Error(apiResponse.error || "Error while fecthing user datas")
        }

        return apiResponse.data;
    } catch (error: any) {
        throw new Error(error.message)
    }
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
    amount: number;
    labels?: LabelModel[];
}

export interface LabelModel {
    id: string;
    title: string;
    description: string;
    color: string;
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

export interface CreateBoxRequest {
    title: string;
}

export interface CreateItemRequest {
    title: string;
    amount: number;
    labels?: LabelModel[]
}

export interface UpdateBoxRequest {
    id: string
    title: string
}

export interface UpdateItemRequest {
    id: string
    title: string
    amount: number
    labels: LabelModel[]
}

export interface UpdateLabelRequest {
    id: string
    title: string
    description: string
    color: string
}

export interface CreateLabelRequest {
    title: string
    description: string
    color: string
}

export async function createBox(boxData: CreateBoxRequest): Promise<Box> {
    const response = await protectedRequest(`${baseUrl}/api/boxes`, {
        method: 'POST',
        body: JSON.stringify(boxData)
    });
    
    const apiResponse: APIResponse<Box> = await response.json();
    
    console.log('API create box response:', apiResponse);
    
    if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to create box');
    }
    
    return apiResponse.data;
}

export async function createItem(boxId: string, itemData: CreateItemRequest): Promise<Item> {
    const response = await protectedRequest(`${baseUrl}/api/boxes/${boxId}/items`, {
        method: 'POST',
        body: JSON.stringify(itemData)
    });
    
    const apiResponse: APIResponse<Item> = await response.json();
    
    if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to create item');
    }
    
    return apiResponse.data;
}

export async function deleteBox(boxId: string): Promise<void> {
    const response = await protectedRequest(`${baseUrl}/api/boxes/${boxId}`, {
        method: 'DELETE',
    })

    const apiResponse: APIResponse<void> = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to delete box')
    }
}

export async function updateBox(boxData: UpdateBoxRequest): Promise<void> {
    const response = await protectedRequest(`${baseUrl}/api/boxes`, {
        method: 'PUT',
        body: JSON.stringify(boxData)
    })

    const apiResponse: APIResponse<void> = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to update box')
    }
}

export async function deleteItem(boxId: string, itemId: string) {
    const response = await protectedRequest(`${baseUrl}/api/boxes/${boxId}/items/${itemId}`, {
        method: 'DELETE',
    })

    const apiResponse: APIResponse<void> = await response.json()

    if(!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to delete item')
    }
}

export async function updateItem(boxId: string, itemData: UpdateItemRequest): Promise<Item> {
    const response = await protectedRequest(`${baseUrl}/api/boxes/${boxId}/items`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
    })

    const apiResponse: APIResponse<Item> = await response.json()

    if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to update Item')
    }

    return apiResponse.data
}

export async function updateLabel(label: UpdateLabelRequest): Promise<LabelModel> {
    const response = await protectedRequest(`${baseUrl}/api/labels`, {
        method: 'PUT',
        body: JSON.stringify(label)
    })

    const apiResponse: APIResponse<LabelModel> = await response.json()

    if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to update item')
    }

    return apiResponse.data
}

export async function getLabel(): Promise<LabelModel[]> {
    const response = await protectedRequest(`${baseUrl}/api/labels`, {
        method: 'GET',
    })

    const apiResponse: APIResponse<LabelModel[]> = await response.json()

    if(!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to fetch labels');
    }
    
    return (apiResponse.data || []).map(transformLabelFromAPI);
}

export async function createLabel(labelData: CreateLabelRequest): Promise<LabelModel> {
    const response = await protectedRequest(`${baseUrl}/api/labels`, {
        method: 'POST',
        body: JSON.stringify(labelData)
    })

    const apiResponse: APIResponse<LabelModel> = await response.json()

    if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to add label')
    }

    return transformLabelFromAPI(apiResponse.data);
}

export async function deleteLabel(labelId: string): Promise<void> {
    const response = await protectedRequest(`${baseUrl}/api/labels/${labelId}`, {
        method: 'DELETE',
    })

    const apiResponse: APIResponse<void> = await response.json()

    if(!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to delete label')
    }
}

export async function getBoxIdContainItemTitle(itemTitle: string): Promise<String> {
    const response = await protectedRequest(`${baseUrl}/api/boxes/items/${itemTitle}`, {
        method: 'GET'
    })

    const apiResponse: APIResponse<string> = await response.json()

    if(!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to fetch boxes')
    }

    return apiResponse.data
}

function transformLabelFromAPI(apiLabel: any): LabelModel {
    return {
        id: apiLabel.Id || apiLabel.id,
        title: apiLabel.Title || apiLabel.title,
        description: apiLabel.Description || apiLabel.description,
        color: apiLabel.Color || apiLabel.color
    };
}