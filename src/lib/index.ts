// place files you want to import through the `$lib` alias in this folder.
export const baseUrl = 
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === "development"
        ? "http://localhost:8080"
        : "/api");

export * from './api';
export * from './stores/auth';
export * from './utils';
export * from './stores/lang'

// Components
export { default as Button } from './components/Button.svelte';
export { default as FormInput } from './components/FormInput.svelte';
export { default as FeatureCard } from './components/FeatureCard.svelte';
export { default as Alert } from './components/Alert.svelte';
export { default as Card } from './components/Card.svelte';
export { default as BoxCard } from './components/BoxCard.svelte';
export { default as LabelList } from './components/LabelList.svelte';
export { default as ItemSearch } from './components/ItemSearch.svelte';
export { default as LangSwitcher} from './components/LangSwitcher.svelte'