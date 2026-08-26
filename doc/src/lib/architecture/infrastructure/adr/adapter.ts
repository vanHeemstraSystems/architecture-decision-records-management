import type { ArchitectureDecision } from '../../domain/decision';

/**
 * ADR filesystem adapter — universal browser fallback (Memo 4 §7).
 *
 * The real filesystem parse path lives in `./adapter.server.ts` and is imported
 * statically by server callers (application services, `*.remote.ts`). This
 * module is only reachable in client bundles, where `node:fs` is unavailable,
 * so it returns an empty list as an explicit fallback.
 */

export interface LoadFromAdrOptions {
	/** Absolute or workspace-relative path containing ADR markdown files. */
	directoryPath?: string;
}

export async function loadFromAdr(
	_options: LoadFromAdrOptions = {}
): Promise<ArchitectureDecision[]> {
	return [];
}
