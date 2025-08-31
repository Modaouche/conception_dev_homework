import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			'svelte/internal',
			'svelte/internal/client',
			'svelte/internal/disclose-version',
			'svelte/internal/flags/async',
			'svelte/internal/flags/legacy',
			'svelte/internal/flags/tracing'
		]
	}
});