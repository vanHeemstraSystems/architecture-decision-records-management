/**
 * Babylon renderer orchestrator (Phases 5–7).
 * Same SceneGraph drives 2D and 3D projections.
 */
import type { SceneGraph } from '../../scene';
import { createBabylonEngine } from './engine';
import { createDualCamera, type ProjectionMode } from './camera';
import { createNodeMeshes } from './nodes';
import { createEdgeMeshes } from './edges';
import { enablePicking } from './picking';
import { kamiColors } from '../../theme/kami/tokens';

export interface BabylonRenderer {
	setGraph: (graph: SceneGraph) => Promise<void>;
	setMode: (mode: ProjectionMode, animate?: boolean) => Promise<void>;
	getMode: () => ProjectionMode;
	fit: () => void;
	focus: (nodeId: string) => void;
	getSelectedId: () => string | null;
	onSelect: (cb: (nodeId: string | null) => void) => void;
	dispose: () => void;
}

export async function createBabylonRenderer(
	canvas: HTMLCanvasElement,
	initialMode: ProjectionMode = '3d'
): Promise<BabylonRenderer> {
	const { MeshBuilder, StandardMaterial, Color3 } = await import('@babylonjs/core');

	const engineH = await createBabylonEngine(canvas);
	const cameraH = await createDualCamera(engineH.scene, canvas, initialMode);

	const ground = MeshBuilder.CreateGround(
		'ground',
		{ width: 80, height: 80 },
		engineH.scene
	);
	ground.position.y = -0.05;
	const groundMat = new StandardMaterial('groundMat', engineH.scene);
	groundMat.diffuseColor = Color3.FromHexString(kamiColors.ground);
	groundMat.specularColor = Color3.Black();
	groundMat.alpha = 0.6;
	ground.material = groundMat;
	ground.isPickable = false;

	const grid = MeshBuilder.CreateGround(
		'grid',
		{ width: 80, height: 80, subdivisions: 20 },
		engineH.scene
	);
	grid.position.y = -0.04;
	const gridMat = new StandardMaterial('gridMat', engineH.scene);
	gridMat.wireframe = true;
	gridMat.diffuseColor = new Color3(0.2, 0.22, 0.25);
	gridMat.alpha = 0.3;
	grid.material = gridMat;
	grid.isPickable = false;

	let current: SceneGraph | null = null;
	let nodes: Awaited<ReturnType<typeof createNodeMeshes>> | null = null;
	let edges: Awaited<ReturnType<typeof createEdgeMeshes>> | null = null;
	let picking: Awaited<ReturnType<typeof enablePicking>> | null = null;
	const selectListeners: Array<(id: string | null) => void> = [];

	async function setGraph(graph: SceneGraph) {
		nodes?.dispose();
		edges?.dispose();
		picking?.dispose();
		current = graph;
		nodes = await createNodeMeshes(engineH.scene, graph.nodes);
		edges = await createEdgeMeshes(engineH.scene, graph.edges, graph.nodes);
		picking = await enablePicking(engineH.scene, nodes.meshes);
		for (const cb of selectListeners) picking.onSelect(cb);
		cameraH.fitToScene(graph);
	}

	return {
		setGraph,
		setMode: (m, animate = true) => cameraH.setMode(m, animate),
		getMode: () => cameraH.mode,
		fit: () => {
			if (current) cameraH.fitToScene(current);
		},
		focus: (id) => {
			if (current) cameraH.focusNode(id, current);
		},
		getSelectedId: () => picking?.selectedId ?? null,
		onSelect: (cb) => {
			selectListeners.push(cb);
			picking?.onSelect(cb);
		},
		dispose: () => {
			picking?.dispose();
			nodes?.dispose();
			edges?.dispose();
			ground.dispose();
			grid.dispose();
			cameraH.dispose();
			engineH.dispose();
		}
	};
}

export const createBabylon2DRenderer = createBabylonRenderer;
export type Babylon2DRenderer = BabylonRenderer;
