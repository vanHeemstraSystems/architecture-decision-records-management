import type { ArchitectureElementId, DecisionId, DecisionStatus } from './architecture';

export interface ArchitectureDecision {
	id: DecisionId;
	title: string;
	status: DecisionStatus;
	markdown?: string;
	relatedElements: ArchitectureElementId[];
	relatedDecisions?: DecisionId[];
	links?: Array<{ title: string; url: string }>;
	metadata?: Record<string, unknown>;
	date?: string;
}
