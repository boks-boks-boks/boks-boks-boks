// place files you want to import through the `$lib` alias in this folder.
export const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

export * from './api';
export * from './stores/auth';

// Components
export { default as Button } from './components/Button.svelte';
export { default as FormInput } from './components/FormInput.svelte';
export { default as FeatureCard } from './components/FeatureCard.svelte';
export { default as Alert } from './components/Alert.svelte';
export { default as Card } from './components/Card.svelte';