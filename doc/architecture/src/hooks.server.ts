import type { Handle } from '@sveltejs/kit';
import { getTracingConfig } from '$lib/observability';

export const handle: Handle = async ({ event, resolve }) => {
	(event.locals as any).otel = getTracingConfig();
	return resolve(event);
};
