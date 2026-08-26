/**
 * ADR filesystem adapter — browser-safe entry point (Memo 4 §7).
 *
 * On the server, dynamically imports `./adapter.server.js` so `node:fs` and
 * `node:path` never appear in the client bundle. On the client, returns an
 * empty list — the caller is expected to fall back to seed decisions.
 */
import type { ArchitectureDecision } from '../../domain/decision';

export interface LoadFromAdrOptions {
	/** Absolute or workspace-relative path containing ADR markdown files. */
	directoryPath?: string;
}

function isServer(): boolean {
	return (
		typeof process !== 'undefined' &&
		!!process.versions?.node &&
		typeof (globalThis as { window?: unknown }).window === 'undefined'
	);
}

export async function loadFromAdr(
	options: LoadFromAdrOptions = {}
): Promise<ArchitectureDecision[]> {
	if (!isServer()) return [];
	try {
		const specifier = './adapter.server.js';
		const mod = (await import(/* @vite-ignore */ specifier)) as typeof import('./adapter.server.js');
		return await mod.loadFromAdrServer(options);
	} catch {
		return [];
	}
}
