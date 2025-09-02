import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
	return {
		plugins: [sveltekit()],
		esbuild: {
			pure: mode === 'production' ? ['console.debug'] : [],
		}
	}
});
