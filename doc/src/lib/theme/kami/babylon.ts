/**
 * Kami tokens → Babylon materials.
 * Memo 4 §16: Babylon materials SHALL be generated from Kami tokens.
 * Lazily imports @babylonjs/core so this module is safe under SSR and tests.
 */
import type { Scene, StandardMaterial } from '@babylonjs/core';
import { colorForStyleToken, kamiColors } from './tokens';

export interface KamiMaterialOptions {
	/** Emissive strength as a fraction of the base colour (default 0.2). */
	emissiveScale?: number;
	/** Uniform specular intensity 0..1 (default 0.2). */
	specular?: number;
}

/** Build a Babylon `StandardMaterial` from a Kami style token. */
export async function createKamiMaterial(
	scene: Scene,
	styleToken: string,
	name?: string,
	options: KamiMaterialOptions = {}
): Promise<StandardMaterial> {
	const { StandardMaterial, Color3 } = await import('@babylonjs/core');
	const hex = colorForStyleToken(styleToken);
	const mat = new StandardMaterial(name ?? `kami-${styleToken}`, scene);
	const base = Color3.FromHexString(hex);
	mat.diffuseColor = base;
	mat.emissiveColor = base.scale(options.emissiveScale ?? 0.2);
	const s = options.specular ?? 0.2;
	mat.specularColor = new Color3(s, s, s);
	return mat;
}

/** Raw hex value for a named Kami colour token. */
export function kamiHex(key: keyof typeof kamiColors): string {
	return kamiColors[key];
}
