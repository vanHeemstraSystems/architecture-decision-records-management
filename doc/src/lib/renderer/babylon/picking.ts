/**
 * Click selection + hover highlight.
 */
import type { Scene, AbstractMesh } from '@babylonjs/core';
import { kamiColors } from '../../theme/kami/tokens';

export interface PickingHandle {
	selectedId: string | null;
	onSelect: (cb: (nodeId: string | null) => void) => void;
	dispose: () => void;
}

export async function enablePicking(
	scene: Scene,
	nodeMeshes: Map<string, AbstractMesh>
): Promise<PickingHandle> {
	const { Color3, PointerEventTypes } = await import('@babylonjs/core');

	let selectedId: string | null = null;
	let hoverId: string | null = null;
	const listeners: Array<(id: string | null) => void> = [];
	const original = new Map<string, { d: any; e: any }>();

	function store(mesh: AbstractMesh) {
		if (original.has(mesh.name)) return;
		const mat = mesh.material as any;
		if (mat?.diffuseColor) {
			original.set(mesh.name, {
				d: mat.diffuseColor.clone(),
				e: mat.emissiveColor?.clone()
			});
		}
	}

	function highlight(mesh: AbstractMesh, hex: string) {
		store(mesh);
		const mat = mesh.material as any;
		if (mat?.diffuseColor) {
			mat.diffuseColor = Color3.FromHexString(hex);
			mat.emissiveColor = Color3.FromHexString(hex).scale(0.4);
		}
	}

	function restore(mesh: AbstractMesh) {
		const o = original.get(mesh.name);
		const mat = mesh.material as any;
		if (o && mat) {
			mat.diffuseColor = o.d;
			mat.emissiveColor = o.e;
		}
	}

	function setSelected(id: string | null) {
		if (selectedId) {
			const prev = nodeMeshes.get(selectedId);
			if (prev) restore(prev);
		}
		selectedId = id;
		if (id) {
			const mesh = nodeMeshes.get(id);
			if (mesh) highlight(mesh, kamiColors.selected);
		}
		for (const cb of listeners) cb(id);
	}

	const observer = scene.onPointerObservable.add((pointerInfo) => {
		if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
			const pick = scene.pick(scene.pointerX, scene.pointerY);
			const id =
				pick?.hit && pick.pickedMesh?.metadata?.sceneNodeId
					? (pick.pickedMesh.metadata.sceneNodeId as string)
					: null;
			if (id !== hoverId) {
				if (hoverId && hoverId !== selectedId) {
					const m = nodeMeshes.get(hoverId);
					if (m) restore(m);
				}
				hoverId = id;
				if (id && id !== selectedId) {
					const m = nodeMeshes.get(id);
					if (m) highlight(m, kamiColors.hover);
				}
			}
		}

		if (pointerInfo.type === PointerEventTypes.POINTERPICK) {
			const pick = pointerInfo.pickInfo;
			const id =
				pick?.hit && pick.pickedMesh?.metadata?.sceneNodeId
					? (pick.pickedMesh.metadata.sceneNodeId as string)
					: null;
			setSelected(id);
		}
	});

	return {
		get selectedId() {
			return selectedId;
		},
		onSelect(cb) {
			listeners.push(cb);
		},
		dispose: () => {
			scene.onPointerObservable.remove(observer);
		}
	};
}
