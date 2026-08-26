import type { ArchitectureModel } from '../../domain/architecture';
import { buildSeedModel } from './seed-model';

/**
 * LikeC4 Adapter — browser-safe entry point (Memo 4 §8).
 *
 * On the server, dynamically imports `./adapter.server.js` (Vite's `.server`
 * suffix keeps `@likec4/language-services` and its Node built-ins out of the
 * client bundle). On the client, returns the seed model directly.
 *
 * ADRs are enriched from `seed-model` — LikeC4 has no ADR concept (memo4 §7).
 */

const ADAPTER_VERSION = '0.5.0';

export interface LoadFromLikeC4Options {
	/** Absolute or workspace-relative path containing `.c4` sources. */
	workspacePath?: string;
}

function isServer(): boolean {
	return (
		typeof process !== 'undefined' &&
		!!process.versions?.node &&
		typeof (globalThis as { window?: unknown }).window === 'undefined'
	);
}

export async function loadFromLikeC4(
	options: LoadFromLikeC4Options = {}
): Promise<ArchitectureModel | null> {
	if (!isServer()) {
		return buildSeedModel('likec4-adapter:seed-client', ADAPTER_VERSION);
	}
	try {
		const specifier = './adapter.server.js';
		const mod = (await import(/* @vite-ignore */ specifier)) as typeof import('./adapter.server.js');
		return await mod.loadFromLikeC4Server(options);
	} catch {
		return buildSeedModel('likec4-adapter:seed-fallback', ADAPTER_VERSION);
	}
}
