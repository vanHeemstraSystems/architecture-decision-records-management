import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		external: ['@babylonjs/core']
	},
	optimizeDeps: {
		exclude: ['@babylonjs/core']
	},
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}']
	}
});
