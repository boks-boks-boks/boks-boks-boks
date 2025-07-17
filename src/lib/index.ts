// place files you want to import through the `$lib` alias in this folder.
export const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

export * from './api';
export * from './stores/auth';