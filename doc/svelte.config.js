import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ out: 'build' }),
		alias: {
			$lib: 'src/lib',
			$architecture: 'src/lib/architecture',
			$scene: 'src/lib/scene',
			$renderer: 'src/lib/renderer',
			$theme: 'src/lib/theme',
			$observability: 'src/lib/observability',
			$remote: 'src/lib/remote'
		},
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};
export default config;
