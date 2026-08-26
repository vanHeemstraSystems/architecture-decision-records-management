import type { ArchitectureModel } from '../../domain/architecture';
import { buildSeedModel } from './seed-model';

/**
 * LikeC4 Adapter — universal browser fallback (Memo 4 §8).
 *
 * The real DSL parse path lives in `./adapter.server.ts` and is imported
 * statically by server callers (`+page.server.ts`, `*.remote.ts`, and the
 * `getArchitecture` application service). This module is only reachable in
 * client bundles, where LikeC4 cannot be parsed, so it returns the seed model
 * as an explicit fallback.
 */

const ADAPTER_VERSION = '0.5.0';

export interface LoadFromLikeC4Options {
	/** Absolute or workspace-relative path containing `.c4` sources. */
	workspacePath?: string;
}

export async function loadFromLikeC4(
	_options: LoadFromLikeC4Options = {}
): Promise<ArchitectureModel> {
	return buildSeedModel('likec4-adapter:seed-client', ADAPTER_VERSION);
}
