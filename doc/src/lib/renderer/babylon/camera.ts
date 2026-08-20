/**
 * Dual camera: 2D orthographic top-down + 3D perspective orbit.
 * Animated transitions between modes (Phase 7).
 */
import type { Scene, ArcRotateCamera } from '@babylonjs/core';
import type { SceneGraph } from '../../scene';

export type ProjectionMode = '2d' | '3d';

export interface CameraHandle {
	mode: ProjectionMode;
	setMode: (mode: ProjectionMode, animate?: boolean) => Promise<void>;
	fitToScene: (graph: SceneGraph) => void;
	focusNode: (nodeId: string, graph: SceneGraph) => void;
	dispose: () => void;
}

export async function createDualCamera(
	scene: Scene,
	canvas: HTMLCanvasElement,
	initialMode: ProjectionMode = '3d'
): Promise<CameraHandle> {
	const { ArcRotateCamera, Vector3, Animation, CubicEase, EasingFunction } =
		await import('@babylonjs/core');

	const camera = new ArcRotateCamera(
		'cam',
		-Math.PI / 2,
		Math.PI / 3,
		35,
		Vector3.Zero(),
		scene
	);
	camera.lowerRadiusLimit = 5;
	camera.upperRadiusLimit = 150;
	camera.panningSensibility = 40;
	camera.wheelPrecision = 15;
	camera.attachControl(canvas, true);

	let mode: ProjectionMode = initialMode;
	applyMode(camera, mode);

	function applyMode(cam: ArcRotateCamera, m: ProjectionMode) {
		if (m === '2d') {
			cam.mode = 1; // ORTHOGRAPHIC_CAMERA
			cam.beta = 0.01;
			cam.alpha = -Math.PI / 2;
			cam.lowerBetaLimit = 0.01;
			cam.upperBetaLimit = 0.01;
			cam.lowerAlphaLimit = -Math.PI / 2;
			cam.upperAlphaLimit = -Math.PI / 2;
			cam.orthoLeft = -20;
			cam.orthoRight = 20;
			cam.orthoBottom = -15;
			cam.orthoTop = 15;
		} else {
			cam.mode = 0; // PERSPECTIVE_CAMERA
			cam.lowerBetaLimit = 0.1;
			cam.upperBetaLimit = Math.PI / 2 - 0.05;
			cam.lowerAlphaLimit = null as any;
			cam.upperAlphaLimit = null as any;
			if (cam.beta < 0.2) cam.beta = Math.PI / 3;
		}
	}

	async function setMode(newMode: ProjectionMode, animate = true) {
		if (newMode === mode) return;
		mode = newMode;

		if (animate && newMode === '3d') {
			camera.lowerBetaLimit = 0.01;
			camera.upperBetaLimit = Math.PI / 2;
			camera.lowerAlphaLimit = null as any;
			camera.upperAlphaLimit = null as any;
			camera.mode = 0;

			const ease = new CubicEase();
			ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

			const animBeta = new Animation(
				'beta',
				'beta',
				60,
				Animation.ANIMATIONTYPE_FLOAT,
				Animation.ANIMATIONLOOPMODE_CONSTANT
			);
			animBeta.setKeys([
				{ frame: 0, value: camera.beta },
				{ frame: 30, value: Math.PI / 3 }
			]);
			animBeta.setEasingFunction(ease);

			const animRadius = new Animation(
				'radius',
				'radius',
				60,
				Animation.ANIMATIONTYPE_FLOAT,
				Animation.ANIMATIONLOOPMODE_CONSTANT
			);
			animRadius.setKeys([
				{ frame: 0, value: camera.radius },
				{ frame: 30, value: Math.max(camera.radius, 30) }
			]);
			animRadius.setEasingFunction(ease);

			camera.animations = [animBeta, animRadius];
			await scene.beginAnimation(camera, 0, 30, false).waitAsync();
			camera.lowerBetaLimit = 0.1;
			camera.upperBetaLimit = Math.PI / 2 - 0.05;
		} else if (animate && newMode === '2d') {
			const ease = new CubicEase();
			ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

			const animBeta = new Animation(
				'beta2d',
				'beta',
				60,
				Animation.ANIMATIONTYPE_FLOAT,
				Animation.ANIMATIONLOOPMODE_CONSTANT
			);
			animBeta.setKeys([
				{ frame: 0, value: camera.beta },
				{ frame: 30, value: 0.01 }
			]);
			animBeta.setEasingFunction(ease);

			const animAlpha = new Animation(
				'alpha2d',
				'alpha',
				60,
				Animation.ANIMATIONTYPE_FLOAT,
				Animation.ANIMATIONLOOPMODE_CONSTANT
			);
			animAlpha.setKeys([
				{ frame: 0, value: camera.alpha },
				{ frame: 30, value: -Math.PI / 2 }
			]);
			animAlpha.setEasingFunction(ease);

			camera.animations = [animBeta, animAlpha];
			await scene.beginAnimation(camera, 0, 30, false).waitAsync();
			applyMode(camera, '2d');
		} else {
			applyMode(camera, newMode);
		}
	}

	function fitToScene(graph: SceneGraph) {
		if (!graph.nodes.length) return;
		let minX = Infinity,
			maxX = -Infinity,
			minY = Infinity,
			maxY = -Infinity,
			minZ = Infinity,
			maxZ = -Infinity;
		for (const n of graph.nodes) {
			const w = (n.size?.width ?? 2) / 2;
			const h = (n.size?.height ?? 1) / 2;
			const d = (n.size?.depth ?? 1) / 2;
			minX = Math.min(minX, n.position.x - w);
			maxX = Math.max(maxX, n.position.x + w);
			minY = Math.min(minY, n.position.y);
			maxY = Math.max(maxY, n.position.y + (n.size?.height ?? 1));
			minZ = Math.min(minZ, n.position.z - d);
			maxZ = Math.max(maxZ, n.position.z + d);
		}
		const cx = (minX + maxX) / 2;
		const cy = (minY + maxY) / 2;
		const cz = (minZ + maxZ) / 2;
		const span = Math.max(maxX - minX, maxZ - minZ, maxY - minY, 8);
		camera.setTarget(new Vector3(cx, cy, cz));
		camera.radius = span * 1.8;

		if (mode === '2d') {
			const m = 1.4;
			camera.orthoLeft = (-(maxX - minX) / 2) * m;
			camera.orthoRight = ((maxX - minX) / 2) * m;
			camera.orthoBottom = (-(maxZ - minZ) / 2) * m;
			camera.orthoTop = ((maxZ - minZ) / 2) * m;
		}
	}

	function focusNode(nodeId: string, graph: SceneGraph) {
		const n = graph.nodes.find((x) => x.id === nodeId);
		if (!n) return;
		camera.setTarget(new Vector3(n.position.x, n.position.y, n.position.z));
		camera.radius = 12;
	}

	return {
		get mode() {
			return mode;
		},
		setMode,
		fitToScene,
		focusNode,
		dispose: () => camera.dispose()
	};
}

/** Phase 5 compatibility: 2D-only camera */
export async function createCamera2D(
	scene: Scene,
	canvas: HTMLCanvasElement
): Promise<CameraHandle> {
	return createDualCamera(scene, canvas, '2d');
}
