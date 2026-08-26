/**
 * ADR filesystem adapter — server-only entry point (Memo 4 §7, §17).
 *
 * Reads `<workspace>/architecture/decisions/*.md`, delegates parsing to
 * `parse-adr.ts`, and returns the resulting `ArchitectureDecision[]`. The
 * `.server.ts` suffix keeps `node:fs` and `node:path` out of the client bundle.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ArchitectureDecision } from '../../domain/decision';
import type { LoadFromAdrOptions } from './adapter';
import { parseAdr } from './parse-adr';

const ADR_FILENAME = /^\d+.*\.md$/i;

export async function loadFromAdrServer(
	options: LoadFromAdrOptions = {}
): Promise<ArchitectureDecision[]> {
	const dir =
		options.directoryPath ?? path.resolve(process.cwd(), 'architecture/decisions');

	let entries: string[];
	try {
		entries = await fs.readdir(dir);
	} catch {
		return [];
	}

	const files = entries.filter((f) => ADR_FILENAME.test(f)).sort();
	const decisions: ArchitectureDecision[] = [];
	for (const filename of files) {
		try {
			const source = await fs.readFile(path.join(dir, filename), 'utf8');
			decisions.push(parseAdr(filename, source));
		} catch {
			// skip unreadable file; adapter must never throw the whole load
		}
	}
	return decisions;
}
