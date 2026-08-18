import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { KamiAdapter } from './kami-adapter.mjs';

// Initialize Kami Three.js adapter
const kami = new KamiAdapter(THREE);
kami.initializeMaterials();

const container = document.getElementById('app');

// Create Kami-styled scene, camera, and lighting
const scene = kami.createScene();
const camera = kami.createCamera(window.innerWidth, window.innerHeight);
const lighting = kami.createLighting(scene);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Add ground plane and visible architectural grid
const ground = kami.createGround(scene);
const grid = new THREE.GridHelper(40, 24, '#B8B1A4', '#E4DFD7');
grid.position.y = -1.25;
grid.material.opacity = 0.7;
grid.material.transparent = true;
scene.add(grid);

// Get materials
const materials = kami.getMaterials();

// Container for architecture elements
const group = new THREE.Group();
scene.add(group);

const infoPanel = document.createElement('div');
infoPanel.className = 'panel';
document.body.appendChild(infoPanel);

const resetButton = document.createElement('button');
resetButton.className = 'reset-button';
resetButton.textContent = '← Back to overview';
resetButton.style.display = 'none';
document.body.appendChild(resetButton);

const viewButtons = Array.from(document.querySelectorAll('.menu-button'));
const setActiveViewButton = (viewName) => {
  viewButtons.forEach((button) => {
    const isActive = button.dataset.view === viewName;
    button.classList.toggle('is-active', isActive);
  });
};

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const { view } = button.dataset;
    if (view === '3d') {
      setActiveViewButton('3d');
      resetZoom();
      return;
    }

    if (view === 'overview') {
      setActiveViewButton('overview');
      resetZoom();
      infoPanel.innerHTML = '<h1>Architecture Explorer</h1><p>Hover or select a node to reveal the related ADR or system context.</p>';
      return;
    }
  });
});

const architectureGraph = await fetch('./data/architecture-graph.json').then((response) => response.json());

const zoomState = {
  isZoomed: false,
  focusNodeId: null,
  targetCamera: null,
  baseCamera: { x: 0, y: 6, z: 18 },
};

const focusNode = (nodeId) => {
  const targetNode = nodeMap.get(nodeId);
  if (!targetNode) return;

  zoomState.isZoomed = true;
  zoomState.focusNodeId = nodeId;

  const offset = 8;
  zoomState.targetCamera = {
    x: targetNode.position.x + offset * Math.sin(Math.random() * Math.PI * 2),
    y: targetNode.position.y + 4,
    z: targetNode.position.z + offset * Math.cos(Math.random() * Math.PI * 2),
  };

  resetButton.style.display = 'block';

  group.children.forEach((child) => {
    if (child.isMesh) {
      child.userData.targetOpacity = child === targetNode ? 1.0 : 0.35;
    }
  });
};

const resetZoom = () => {
  zoomState.isZoomed = false;
  zoomState.focusNodeId = null;
  zoomState.targetCamera = {
    x: zoomState.baseCamera.x,
    y: zoomState.baseCamera.y,
    z: zoomState.baseCamera.z,
  };
  resetButton.style.display = 'none';

  group.children.forEach((child) => {
    if (child.isMesh) {
      child.userData.targetOpacity = 1.0;
    }
  });
};

resetButton.addEventListener('click', () => {
  resetZoom();
  infoPanel.innerHTML = '<h1>Architecture Explorer</h1><p>Hover or select a node to reveal the related ADR or system context.</p>';
});

const renderDetails = (entry, nodeId = null) => {
  if (!entry) {
    infoPanel.innerHTML = '<h1>Architecture Explorer</h1><p>Hover or select a node to reveal the related ADR or system context.</p>';
    return;
  }

  const decisions = architectureGraph.adrs
    .map((adr) => `<button class="decision-button" type="button" data-id="${adr.id.toLowerCase()}">${adr.id} · ${adr.title}</button>`)
    .join('');

  const docLink = entry.file ? `<p><a href="../../decisions/${entry.file}" target="_blank" rel="noreferrer">Open decision file</a></p>` : '';

  infoPanel.innerHTML = `
    <h1>${entry.id}</h1>
    <p><strong>${entry.title}</strong></p>
    <p>${entry.status} · ${entry.date}</p>
    <p>${entry.summary}</p>
    ${docLink}
    <div class="decision-list">${decisions}</div>
  `;

  if (nodeId) {
    focusNode(nodeId);
  }

  infoPanel.querySelectorAll('.decision-button').forEach((button) => {
    button.addEventListener('click', () => {
      const clicked = architectureGraph.adrs.find((adr) => adr.id.toLowerCase() === button.dataset.id);
      if (!clicked) return;
      const clickedNodeId = clicked.id.toLowerCase();
      renderDetails(clicked, clickedNodeId);
      focusNode(clickedNodeId);
    });
  });
};

const nodeMap = new Map();
const labelMap = new Map();

const getMaterialForNode = (kind) => {
  switch (kind) {
    case 'system': return materials.focus ?? materials.ink ?? materials.secondary;
    case 'container': return materials.secondary ?? materials.context ?? materials.muted;
    case 'decision': return materials.canvas ?? materials.neutral ?? materials.secondary;
    default: return materials.neutral ?? materials.secondary;
  }
};

const getSizeForNode = (kind) => {
  switch (kind) {
    case 'system': return [2.8, 1.4, 1.4];
    case 'container': return [1.8, 1.0, 1.0];
    case 'decision': return [1.6, 0.5, 0.45];
    default: return [1.5, 1.0, 1.0];
  }
};

architectureGraph.nodes.forEach((node) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...getSizeForNode(node.kind)),
    getMaterialForNode(node.kind)
  );

  mesh.position.set(node.x, node.y, node.z);
  mesh.rotation.y = 0.15;
  mesh.userData = { id: node.id, label: node.label };
  group.add(mesh);
  nodeMap.set(node.id, mesh);
});

const lineMaterial = new THREE.LineBasicMaterial({ color: '#777064', transparent: true, opacity: 0.7 });

architectureGraph.links.forEach(({ from, to }) => {
  const fromNode = architectureGraph.nodes.find((node) => node.id === from);
  const toNode = architectureGraph.nodes.find((node) => node.id === to);
  if (!fromNode || !toNode) return;

  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z),
    new THREE.Vector3(toNode.x, toNode.y, toNode.z),
  ]);
  const line = new THREE.Line(geometry, lineMaterial);
  group.add(line);
});

const adr = architectureGraph.adrs[0];
if (adr) {
  renderDetails(adr, adr.id.toLowerCase());
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(group.children, false);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const meta = hit.userData;
    if (meta?.label) {
      const matchingAdr = architectureGraph.adrs.find((entry) => entry.id.toLowerCase() === meta.label.toLowerCase());
      if (matchingAdr) {
        renderDetails(matchingAdr, matchingAdr.id.toLowerCase());
      } else {
        infoPanel.innerHTML = `
          <h1>${meta.label}</h1>
          <p>Architecture node in the context-preserving exploration view.</p>
        `;
      }
    }
  }
}

renderer.domElement.addEventListener('click', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(group.children, false);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const meta = hit.userData;
    if (meta?.label) {
      const matchingAdr = architectureGraph.adrs.find((entry) => entry.id.toLowerCase() === meta.label.toLowerCase());
      if (matchingAdr) {
        renderDetails(matchingAdr, matchingAdr.id.toLowerCase());
      }
    }
  }
});

renderer.domElement.addEventListener('pointermove', onPointerMove);

const orbit = { angle: 0 };

function animate() {
  requestAnimationFrame(animate);

  orbit.angle += zoomState.isZoomed ? 0.001 : 0.005;

  if (zoomState.targetCamera) {
    camera.position.x += (zoomState.targetCamera.x - camera.position.x) * 0.05;
    camera.position.y += (zoomState.targetCamera.y - camera.position.y) * 0.05;
    camera.position.z += (zoomState.targetCamera.z - camera.position.z) * 0.05;
  } else if (!zoomState.isZoomed) {
    camera.position.x = Math.sin(orbit.angle) * 12;
    camera.position.z = Math.cos(orbit.angle) * 18;
  }

  camera.lookAt(0, 1.5, 0);

  group.children.forEach((child) => {
    if (child.isMesh) {
      const targetOp = child.userData.targetOpacity ?? 1.0;
      child.material.opacity = child.material.opacity * 0.92 + targetOp * 0.08;
    }
  });

  if (zoomState.isZoomed) {
    group.rotation.y *= 0.98;
  } else {
    group.rotation.y = Math.sin(orbit.angle * 0.8) * 0.18;
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
