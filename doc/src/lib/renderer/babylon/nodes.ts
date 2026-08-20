/**
 * SceneNode → Babylon meshes + DynamicTexture labels (Phases 5–7).
 */
import type { Scene, AbstractMesh } from '@babylonjs/core';
import type { SceneNode } from '../../scene';
import { colorForStyleToken } from '../../theme/kami/tokens';

export interface NodeMeshes {
	meshes: Map<string, AbstractMesh>;
	dispose: () => void;
}

export async function createNodeMeshes(
	scene: Scene,
	nodes: SceneNode[]
): Promise<NodeMeshes> {
	const {
		MeshBuilder,
		StandardMaterial,
		Color3,
		Vector3,
		DynamicTexture
	} = await import('@babylonjs/core');

	const meshes = new Map<string, AbstractMesh>();

	for (const node of nodes) {
		const w = node.size?.width ?? 2;
		const h = node.size?.height ?? 1.4;
		const d = node.size?.depth ?? 1.2;
		const isDecision = node.kind === 'decision';

		const mesh = MeshBuilder.CreateBox(
			`node-${node.id}`,
			{ width: w, height: h, depth: d },
			scene
		);
		mesh.position = new Vector3(
			node.position.x,
			node.position.y + h / 2,
			node.position.z
		);
		mesh.metadata = {
			sceneNodeId: node.id,
			kind: node.kind,
			isDecision
		};

		const mat = new StandardMaterial(`mat-${node.id}`, scene);
		const hex = colorForStyleToken(node.styleToken);
		mat.diffuseColor = Color3.FromHexString(hex);
		mat.emissiveColor = Color3.FromHexString(hex).scale(isDecision ? 0.3 : 0.2);
		mat.specularColor = new Color3(0.2, 0.2, 0.2);
		mesh.material = mat;

		const labelW = Math.max(w * 1.2, 2.5);
		const labelPlane = MeshBuilder.CreatePlane(
			`label-${node.id}`,
			{ width: labelW, height: 0.65 },
			scene
		);
		labelPlane.position = new Vector3(
			node.position.x,
			node.position.y + h + 0.5,
			node.position.z
		);
		labelPlane.billboardMode = 7;
		labelPlane.isPickable = false;

		const tex = new DynamicTexture(
			`tex-${node.id}`,
			{ width: 512, height: 128 },
			scene,
			false
		);
		const ctx = tex.getContext() as any;
		ctx.clearRect(0, 0, 512, 128);
		ctx.font = isDecision ? 'bold 30px system-ui' : 'bold 34px system-ui';
		ctx.fillStyle = '#e7e9ea';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		const label =
			node.label.length > 28 ? node.label.slice(0, 26) + '…' : node.label;
		ctx.fillText(label, 256, isDecision ? 48 : 64);
		if (isDecision && node.decisionStatus) {
			ctx.font = '22px system-ui';
			ctx.fillStyle = '#8b98a5';
			ctx.fillText(node.decisionStatus, 256, 92);
		}
		tex.update();

		const labelMat = new StandardMaterial(`labelmat-${node.id}`, scene);
		labelMat.diffuseTexture = tex;
		labelMat.emissiveTexture = tex;
		labelMat.opacityTexture = tex;
		labelMat.backFaceCulling = false;
		labelMat.disableLighting = true;
		labelPlane.material = labelMat;

		(mesh as any)._labelPlane = labelPlane;
		meshes.set(node.id, mesh);
	}

	return {
		meshes,
		dispose: () => {
			for (const m of meshes.values()) {
				(m as any)._labelPlane?.dispose();
				m.dispose();
			}
			meshes.clear();
		}
	};
}
