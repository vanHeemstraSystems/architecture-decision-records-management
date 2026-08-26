/**
 * Lightweight OpenTelemetry-style tracing for Memo 4 Phase 10.
 * In-memory span recorder suitable for tests and console debugging.
 * When OTEL_ENABLED=true, spans are also logged to the console.
 */

export const SpanNames = {
	MODEL_LOAD: 'architecture.model.load',
	ADR_LOAD: 'architecture.adr.load',
	CONTEXT_RESOLVE: 'architecture.context.resolve',
	ELEMENT_GET: 'architecture.element.get',
	CHILDREN_GET: 'architecture.children.get',
	DECISION_OPEN: 'architecture.decision.open',
	DECISIONS_RESOLVE: 'architecture.decisions.resolve',
	RELATIONSHIPS_RESOLVE: 'architecture.relationships.resolve',
	VIEW_RESOLVE: 'architecture.view.resolve',
	VIEW_OPEN: 'architecture.view.open',
	SEARCH: 'architecture.search'
} as const;

export type SpanName = (typeof SpanNames)[keyof typeof SpanNames];

export interface SpanAttributes {
	[key: string]: string | number | boolean | undefined;
}

export interface FinishedSpan {
	name: string;
	startTime: number;
	endTime: number;
	durationMs: number;
	attributes: SpanAttributes;
	status: 'ok' | 'error';
	errorMessage?: string;
}

export interface ActiveSpan {
	name: string;
	startTime: number;
	attributes: SpanAttributes;
	setAttribute(key: string, value: string | number | boolean): void;
	setStatus(status: 'ok' | 'error', message?: string): void;
}

export interface TracingConfig {
	enabled: boolean;
	serviceName: string;
}

const recentSpans: FinishedSpan[] = [];
const MAX_RECENT = 200;

function isEnabled(): boolean {
	if (typeof process !== 'undefined' && process.env?.OTEL_ENABLED === 'true') return true;
	if (typeof process !== 'undefined' && process.env?.OTEL_ENABLED === '1') return true;
	return false;
}

export function getTracingConfig(): TracingConfig {
	const serviceName =
		(typeof process !== 'undefined' && process.env?.OTEL_SERVICE_NAME) ||
		'architecture-decision-records';
	return {
		enabled: isEnabled(),
		serviceName
	};
}

export function getRecentSpans(): FinishedSpan[] {
	return [...recentSpans];
}

export function clearRecentSpans(): void {
	recentSpans.length = 0;
}

function recordSpan(span: FinishedSpan): void {
	recentSpans.push(span);
	if (recentSpans.length > MAX_RECENT) {
		recentSpans.splice(0, recentSpans.length - MAX_RECENT);
	}
	const cfg = getTracingConfig();
	if (cfg.enabled) {
		const attrs = Object.entries(span.attributes)
			.map(([k, v]) => `${k}=${JSON.stringify(v)}`)
			.join(' ');
		console.log(
			`[otel] ${span.name} ${span.durationMs.toFixed(1)}ms status=${span.status}${attrs ? ' ' + attrs : ''}`
		);
	}
}

export async function withSpan<T>(
	name: string,
	attributes: SpanAttributes,
	fn: (span: ActiveSpan) => Promise<T> | T
): Promise<T> {
	const startTime = performance.now();
	const attrs: SpanAttributes = { ...attributes };
	let status: 'ok' | 'error' = 'ok';
	let errorMessage: string | undefined;

	const active: ActiveSpan = {
		name,
		startTime,
		attributes: attrs,
		setAttribute(key: string, value: string | number | boolean) {
			attrs[key] = value;
		},
		setStatus(s: 'ok' | 'error', message?: string) {
			status = s;
			if (message) errorMessage = message;
		}
	};

	try {
		const result = await fn(active);
		const endTime = performance.now();
		recordSpan({
			name,
			startTime,
			endTime,
			durationMs: endTime - startTime,
			attributes: { ...attrs },
			status,
			errorMessage
		});
		return result;
	} catch (err) {
		status = 'error';
		errorMessage = err instanceof Error ? err.message : String(err);
		const endTime = performance.now();
		recordSpan({
			name,
			startTime,
			endTime,
			durationMs: endTime - startTime,
			attributes: { ...attrs },
			status,
			errorMessage
		});
		throw err;
	}
}
