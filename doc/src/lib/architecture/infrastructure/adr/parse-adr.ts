/**
 * Pure ADR markdown parser (Memo 4 §7).
 *
 * Environment-agnostic: takes filename + markdown string and returns one
 * canonical `ArchitectureDecision`. No fs / no Node built-ins so it can be
 * unit-tested and shared between server and (potentially) browser code.
 */
import type { ArchitectureDecision } from '../../domain/decision';
import type { DecisionStatus } from '../../domain/architecture';

const KNOWN_STATUSES: readonly DecisionStatus[] = [
	'proposed',
	'accepted',
	'deprecated',
	'superseded',
	'rejected'
];

function normalizeStatus(raw: string | undefined): DecisionStatus {
	const t = (raw ?? '').trim().toLowerCase();
	return (KNOWN_STATUSES as readonly string[]).includes(t) ? (t as DecisionStatus) : 'proposed';
}

function stripQuotes(value: string): string {
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		return value.slice(1, -1);
	}
	return value;
}

function extractFrontmatter(source: string): { data: Record<string, string>; body: string } {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
	if (!match) return { data: {}, body: source };
	const data: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = /^\s*([A-Za-z0-9_-]+)\s*:\s*(.*?)\s*$/.exec(line);
		if (kv) data[kv[1]] = stripQuotes(kv[2]);
	}
	return { data, body: source.slice(match[0].length) };
}

function extractSection(body: string, heading: string): string | undefined {
	const re = new RegExp('^##\\s+' + heading + '\\s*$', 'm');
	const m = re.exec(body);
	if (!m) return undefined;
	const rest = body.slice(m.index + m[0].length);
	const next = /^##\s+/m.exec(rest);
	const chunk = next ? rest.slice(0, next.index) : rest;
	return chunk.trim() || undefined;
}

function extractTitle(body: string, fallbackNum: string): string {
	const m = /^#\s+(?:\d+\.\s*)?(.+?)\s*$/m.exec(body);
	return m ? m[1].trim() : `Decision ${fallbackNum}`;
}

function extractDate(body: string): string | undefined {
	const m = /^Date:\s*(\S+)/m.exec(body);
	return m ? m[1] : undefined;
}

export function parseAdr(filename: string, source: string): ArchitectureDecision {
	const numMatch = /^(\d+)/.exec(filename);
	const num = numMatch ? numMatch[1] : '0000';
	const id = `ADR-${num.padStart(4, '0')}`;

	let data: Record<string, string> = {};
	let body = source;
	try {
		const parsed = extractFrontmatter(source);
		data = parsed.data;
		body = parsed.body;
	} catch {
		body = source;
	}

	const title = extractTitle(body, num);
	const statusHeading = extractSection(body, 'Status');
	const statusFromHeading = statusHeading?.split(/\r?\n/)[0];
	const status = normalizeStatus(data.status ?? statusFromHeading);
	const date = extractDate(body) ?? data.date;

	return {
		id,
		title,
		status,
		markdown: body.trim(),
		relatedElements: [],
		relatedDecisions: [],
		date
	};
}
