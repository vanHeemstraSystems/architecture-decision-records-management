/**
 * Kami tokens → CSS custom properties.
 * Memo 4 §16: Kami is the single visual source of truth; propagate its
 * tokens as `--kami-color-*` variables consumable from Svelte components.
 */
import { kamiColors } from './tokens';

function kebab(key: string): string {
	return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/** CSS custom-property name for a Kami colour token key, e.g. `--kami-color-text-muted`. */
export function kamiColorVar(key: keyof typeof kamiColors): string {
	return `--kami-color-${kebab(key as string)}`;
}

/** Indented `--kami-color-*: …;` lines for every Kami colour token. */
export function kamiCssDeclarations(): string {
	return Object.entries(kamiColors)
		.map(([key, value]) => `\t${kamiColorVar(key as keyof typeof kamiColors)}: ${value};`)
		.join('\n');
}

/** Full `:root { … }` block suitable for injection into a stylesheet. */
export function kamiRootCss(): string {
	return `:root {\n${kamiCssDeclarations()}\n}`;
}
