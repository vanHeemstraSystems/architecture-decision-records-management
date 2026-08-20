import { defineConfig } from 'vitest/config';
import path from 'node:path';
export default defineConfig({
	test: { include: ['tests/**/*.{test,spec}.{js,ts}'] },
	resolve: { alias: { $lib: path.resolve('./src/lib') } }
});
