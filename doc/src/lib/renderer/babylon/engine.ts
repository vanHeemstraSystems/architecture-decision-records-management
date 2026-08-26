/**
 * Babylon.js engine bootstrap (Phases 5–7).
 * Lazy-loaded — browser only.
 */
import type { Engine, Scene } from '@babylonjs/core';

export interface BabylonEngineHandle {
	engine: Engine;
	scene: Scene;
	canvas: HTMLCanvasElement;
	dispose: () => void;
}

export async function createBabylonEngine(
	canvas: HTMLCanvasElement
): Promise<BabylonEngineHandle> {
	const {
		Engine,
		Scene,
		Color4,
		HemisphericLight,
		DirectionalLight,
		Vector3
	} = await import('@babylonjs/core');

	const engine = new Engine(canvas, true, {
		preserveDrawingBuffer: true,
		stencil: true,
		adaptToDeviceRatio: true
	});

	const scene = new Scene(engine);
	scene.clearColor = new Color4(0.06, 0.08, 0.1, 1);

	const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
	hemi.intensity = 0.7;
	const dir = new DirectionalLight('dir', new Vector3(-0.5, -1, 0.5), scene);
	dir.intensity = 0.5;

	engine.runRenderLoop(() => {
		if (!scene.activeCamera) return;
		scene.render();
	});

	const onResize = () => engine.resize();
	window.addEventListener('resize', onResize);

	return {
		engine,
		scene,
		canvas,
		dispose: () => {
			window.removeEventListener('resize', onResize);
			scene.dispose();
			engine.dispose();
		}
	};
}
