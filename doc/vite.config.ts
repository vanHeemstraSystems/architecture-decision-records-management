import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type UserConfig } from 'vite';

const config: UserConfig & { test: { include: string[] } } = {
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
};

export default defineConfig(config);
