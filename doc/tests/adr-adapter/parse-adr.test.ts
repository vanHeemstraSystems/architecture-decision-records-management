import { describe, it, expect } from 'vitest';
import { parseAdr } from '../../src/lib/architecture/infrastructure/adr/parse-adr';

const WELL_FORMED = `---
status: "Accepted"
---

# 7. Adopt widget frobber

Date: 2026-08-20

## Status

Accepted

## Context

Because reasons.

## Decision

We do the thing.

## Consequences

Things happen.
`;

describe('parseAdr', () => {
	it('extracts id from filename, title, frontmatter status, date and sections', () => {
		const d = parseAdr('0007-adopt-widget-frobber.md', WELL_FORMED);
		expect(d.id).toBe('ADR-0007');
		expect(d.title).toBe('Adopt widget frobber');
		expect(d.status).toBe('accepted');
		expect(d.date).toBe('2026-08-20');
		expect(d.relatedElements).toEqual([]);
		expect(d.markdown).toContain('## Context');
		expect(d.markdown).toContain('## Decision');
		expect(d.markdown).toContain('## Consequences');
		expect(d.markdown?.startsWith('# 7.')).toBe(true);
	});

	it('falls back to the ## Status heading when frontmatter is absent', () => {
		const noFrontmatter = `# 9. Do something\n\n## Status\n\nDeprecated\n\n## Decision\n\nx\n`;
		const d = parseAdr('0009-do-something.md', noFrontmatter);
		expect(d.id).toBe('ADR-0009');
		expect(d.status).toBe('deprecated');
		expect(d.title).toBe('Do something');
	});

	it('returns a best-effort record for malformed frontmatter without throwing', () => {
		const malformed = `---\nnot-yaml: [unclosed\n---\n# 3. Broken\n\n## Status\nProposed\n`;
		expect(() => parseAdr('0003-broken.md', malformed)).not.toThrow();
		const d = parseAdr('0003-broken.md', malformed);
		expect(d.id).toBe('ADR-0003');
		expect(d.title).toBe('Broken');
		expect(d.status).toBe('proposed');
	});

	it('defaults status to proposed when nothing recognisable is provided', () => {
		const d = parseAdr('0011-mystery.md', '# 11. Mystery\n\nJust prose.\n');
		expect(d.status).toBe('proposed');
	});

	it('produces ADR-0000 when the filename has no leading digits', () => {
		const d = parseAdr('README.md', '# 0. Nothing\n');
		expect(d.id).toBe('ADR-0000');
	});
});
