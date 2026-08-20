/**
 * SceneEdge → Babylon lines (3D-aware heights).
 */
import type { Scene, AbstractMesh } from '@babylonjs/core';
import type { SceneEdge, SceneNode } from '../../scene';
import { colorForStyleToken } from '../../theme/kami/tokens';

export interface EdgeMeshes {
	meshes: AbstractMesh[];
	dispose: () => void;
}

export async function createEdgeMeshes(
	scene: Scene,
	edges: SceneEdge[],
	nodes: SceneNode[]
): Promise<EdgeMeshes> {
	const { MeshBuilder, Color3, Vector3 } = await import('@babylonjs/core');

	const nodeMap = new Map(nodes.map((n) => [n.id, n]));
	const meshes: AbstractMesh[] = [];

	for (const edge of edges) {
		const src = nodeMap.get(edge.source);
		const tgt = nodeMap.get(edge.target);
		if (!src || !tgt) continue;

		const sy = src.position.y + (src.size?.height ?? 1) / 2;
		const ty = tgt.position.y + (tgt.size?.height ?? 1) / 2;

		const points = [
			new Vector3(src.position.x, sy, src.position.z),
			new Vector3(tgt.position.x, ty, tgt.position.z)
		];
		const line = MeshBuilder.CreateLines(
			`edge-${edge.id}`,
			{ points },
			scene
		);
		line.color = Color3.FromHexString(colorForStyleToken(edge.styleToken));
		line.isPickable = false;
		meshes.push(line);

		if (edge.kind === 'decision-decision') {
			const o = 0.1;
			const points2 = [
				new Vector3(src.position.x + o, sy, src.position.z + o),
				new Vector3(tgt.position.x + o, ty, tgt.position.z + o)
			];
			const line2 = MeshBuilder.CreateLines(
				`edge2-${edge.id}`,
				{ points: points2 },
				scene
			);
			line2.color = Color3.FromHexString(colorForStyleToken(edge.styleToken));
			line2.isPickable = false;
			meshes.push(line2);
		}
	}

	return {
		meshes,
		dispose: () => {
			meshes.forEach((m) => m.dispose());
			meshes.length = 0;
		}
	};
}
