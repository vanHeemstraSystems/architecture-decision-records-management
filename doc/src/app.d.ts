declare global {
	namespace App {
		interface Locals {
			otel?: { enabled: boolean; serviceName: string };
		}
	}
}
export {};
