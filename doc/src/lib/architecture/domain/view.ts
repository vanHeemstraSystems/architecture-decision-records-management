import type { ArchitectureElementId, ViewId } from './architecture';

export interface ArchitectureView {
	id: ViewId;
	name: string;
	description?: string;
	elements: ArchitectureElementId[];
	relationships?: string[];
	kind?: 'systemContext' | 'container' | 'component' | 'deployment' | 'decision' | 'custom';
	metadata?: Record<string, unknown>;
}
