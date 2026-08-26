import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFromAdrServer as loadFromAdr } from '../../src/lib/architecture/infrastructure/adr/adapter.server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.resolve(__dirname, '../../architecture/decisions');

describe('loadFromAdr — real ADR directory', () => {
	it('parses the three seed ADR files into canonical decisions', async () => {
		const decisions = await loadFromAdr({ directoryPath });

		expect(decisions).toHaveLength(3);

		const byId = new Map(decisions.map((d) => [d.id, d]));
		expect(byId.get('ADR-0001')?.title).toBe('Record architecture decisions');
		expect(byId.get('ADR-0002')?.title).toBe('Implement as Unix shell scripts');
		expect(byId.get('ADR-0003')?.title).toBe('Use Rust for performance-critical functionality');

		for (const d of decisions) {
			expect(d.status).toBe('accepted');
			expect(d.date).toBe('2026-07-29');
			expect(d.markdown).toContain('## Decision');
		}
	});

	it('returns [] when the directory does not exist', async () => {
		const decisions = await loadFromAdr({ directoryPath: '/nonexistent/path/xyz' });
		expect(decisions).toEqual([]);
	});
});
