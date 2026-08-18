/**
 * Kami Three.js Adapter
 * 
 * Formal Three.js styling that honors Kami design tokens and principles.
 * 
 * Implements Phase 4 of the Architecture Explorer vision:
 * - Warm, matte material system
 * - Restrained geometry with subtle depth
 * - Soft ambient lighting (no game-like effects)
 * - Near-orthographic camera for architectural clarity
 * - Interaction states using opacity and emphasis
 * 
 * References:
 * - Memo1.md Section 12-13: Three.js as spatial renderer with Kami semantics
 * - Memo1.md Section 31: Target experience (physical architectural model aesthetic)
 * - Design tokens: doc/architecture/themes/kami/theme.json
 */

/**
 * Kami Design Tokens
 * The authoritative values for all Three.js styling
 */
export const KAMI_TOKENS = {
  // Color palette
  canvas: '#f5f4ed',       // Warm parchment - background
  ink: '#1B365D',          // Ink blue - primary emphasis
  text: '#2C2924',         // Dark neutral - readable text
  muted: '#777064',        // Warm graphite - subdued elements
  border: '#B8B1A4',       // Soft neutral - subtle boundaries
  surface: '#F5F4ED',      // Canvas equivalent
  surfaceMuted: '#EFEDE4', // Muted surface for secondary

  // Named semantic colors
  focus: '#1B365D',        // Ink - where you are
  context: '#777064',      // Graphite - surrounding context
  parchment: '#f5f4ed',    // Canvas - architectural space
  neutral: '#9E978B',      // Warm taupe - neutral elements
};

/**
 * Material Definitions
 * Maps Kami tokens to Three.js MeshStandardMaterial properties
 * 
 * Philosophy: Matte, warm surfaces with minimal reflection
 * - No chrome, no neon, no game-like effects
 * - High roughness (0.82-0.96) for matte appearance
 * - Zero metalness for non-reflective surfaces
 * - Warm ambient color instead of pure white
 * - Subtle color variation, not arbitrary rainbow
 */
export const KAMI_MATERIALS = {
  /**
   * Primary focus - emphasized architectural elements
   * High contrast, clear visibility, draws attention
   */
  focus: (THREE) => new THREE.MeshStandardMaterial({
    color: KAMI_TOKENS.ink,      // #1B365D
    roughness: 0.82,              // Slightly less matte than secondary (more legible edges)
    metalness: 0.0,               // Non-reflective
    transparent: true,
    opacity: 1.0,
    wireframe: false,
  }),

  /**
   * Secondary containers and elements
   * Supporting architectural role, subordinate to focus
   */
  secondary: (THREE) => new THREE.MeshStandardMaterial({
    color: KAMI_TOKENS.surface,  // #F5F4ED - warm surface
    roughness: 0.92,              // Slightly more matte than focus
    metalness: 0.0,
    transparent: true,
    opacity: 1.0,
  }),

  /**
   * Context elements - surrounding systems, faded reference
   * Visible but not distracting, supports spatial memory
   */
  context: (THREE) => new THREE.MeshStandardMaterial({
    color: KAMI_TOKENS.muted,    // #777064
    roughness: 0.92,
    metalness: 0.0,
    transparent: true,
    opacity: 0.6,                 // Faded to reduce visual weight
  }),

  /**
   * Muted/faded - least emphasis, background reference
   * Provides information without distraction
   */
  muted: (THREE) => new THREE.MeshStandardMaterial({
    color: KAMI_TOKENS.muted,    // #777064
    roughness: 0.92,
    metalness: 0.0,
    transparent: true,
    opacity: 0.4,                 // Heavily faded
  }),

  /**
   * Neutral elements - deployment nodes, infrastructure
   * Balances visual weight without drawing attention
   */
  neutral: (THREE) => new THREE.MeshStandardMaterial({
    color: KAMI_TOKENS.neutral,  // #9E978B
    roughness: 0.90,
    metalness: 0.0,
    transparent: true,
    opacity: 0.8,
  }),

  /**
   * Canvas/ground - architectural space
   * Very subtle, provides context without interference
   */
  canvas: (THREE) => new THREE.MeshStandardMaterial({
    color: KAMI_TOKENS.canvas,   // #f5f4ed
    roughness: 1.0,               // Completely matte
    metalness: 0.0,
    side: THREE.DoubleSide,
  }),

  /**
   * Outline/edge emphasis - relationship lines and boundaries
   * Subtle but visible, high-contrast when needed
   */
  outline: (THREE) => new THREE.LineBasicMaterial({
    color: KAMI_TOKENS.border,   // #B8B1A4
    linewidth: 1,
    transparent: true,
    opacity: 0.7,
  }),

  /**
   * Outline for focused/selected elements
   * Higher contrast than standard outline
   */
  outlineFocus: (THREE) => new THREE.LineBasicMaterial({
    color: KAMI_TOKENS.ink,      // #1B365D
    linewidth: 2,
    transparent: true,
    opacity: 1.0,
  }),

  /**
   * Relationship lines - connections between elements
   * Soft, curved aesthetic, not emphasizing flow
   */
  relationship: (THREE) => new THREE.MeshLine({
    color: KAMI_TOKENS.muted,    // #777064
    lineWidth: 0.08,              // Thin visual weight
    transparent: true,
    opacity: 0.6,
  }),
};

/**
 * Geometry Conventions
 * How architectural elements are rendered in 3D space
 * 
 * Philosophy: Subtle depth, minimalist forms, restrained complexity
 * - Rounded boxes preferred (not harsh rectangles)
 * - Shallow depth (0.1-0.2) for card-like appearance
 * - Corner radius for softer, more editorial aesthetic
 * - No exaggerated 3D effects or gradients
 */
export const KAMI_GEOMETRY = {
  /**
   * System/Container box dimensions and properties
   */
  container: {
    // Standard container (Software System, Container level)
    width: 3.0,
    height: 1.5,
    depth: 0.15,           // Shallow depth for card aesthetic
    cornerRadius: 0.15,    // Rounded corners
  },

  /**
   * Component-level geometry (smaller boxes)
   */
  component: {
    width: 2.0,
    height: 1.0,
    depth: 0.1,
    cornerRadius: 0.1,
  },

  /**
   * Person/User representation
   * Slightly smaller than containers
   */
  person: {
    width: 1.5,
    height: 1.5,
    depth: 0.1,
    cornerRadius: 0.12,
  },

  /**
   * Relationship line properties
   */
  relationship: {
    curveSegments: 32,    // Smooth curves
    thickness: 0.08,      // Thin lines for restrained aesthetic
  },

  /**
   * Deployment node - infrastructure element
   */
  deploymentNode: {
    width: 2.5,
    height: 2.5,
    depth: 0.12,
    cornerRadius: 0.1,
  },

  /**
   * Ground plane - architectural space
   */
  canvas: {
    width: 40,
    height: 40,
    segmentsX: 1,
    segmentsY: 1,
  },
};

/**
 * Lighting Configuration
 * Soft, ambient-focused lighting that doesn't create harsh shadows
 * 
 * Philosophy: Museum lighting, not game-like, emphasizing form over drama
 */
export const KAMI_LIGHTING = {
  /**
   * Ambient light - fills entire scene evenly
   * Uses warm, off-white tone (not pure white)
   */
  ambient: {
    color: '#f7f2ea',      // Warm off-white
    intensity: 1.4,        // Bright enough for clarity
  },

  /**
   * Key light - soft directional light from above-right
   * Provides subtle modeling without harsh shadows
   */
  directional: {
    color: '#dfe9f4',      // Cool white (slight blue tint for balance)
    intensity: 1.0,
    position: { x: 5, y: 8, z: 8 },
    castShadow: false,     // Disable shadows - too game-like
  },

  /**
   * Back light - optional subtle fill from behind
   * Prevents complete flatness when needed
   */
  backLight: {
    color: '#e8e2d8',      // Warm tone
    intensity: 0.3,        // Very subtle
    position: { x: -3, y: 2, z: -5 },
    castShadow: false,
  },

  /**
   * Shadow configuration (disabled by default)
   * The Kami aesthetic avoids strong shadows
   */
  shadow: {
    enabled: false,
    mapSize: 2048,
    camera: {
      near: 0.5,
      far: 100,
      left: -30,
      right: 30,
      top: 30,
      bottom: -30,
    },
  },

  /**
   * Fog (disabled)
   * Architectural clarity more important than atmospheric depth
   */
  fog: {
    enabled: false,
    color: '#f5f4ed',
    near: 20,
    far: 100,
  },
};

/**
 * Camera Configuration
 * Near-orthographic perspective for architectural clarity
 * 
 * Philosophy: Drawings over photos, clarity over realism
 * - Shallow depth of field equivalent (orthographic preferred)
 * - Positioned to show clear top-down isometric view
 * - FOV tuned for comfortable viewing distance
 */
export const KAMI_CAMERA = {
  /**
   * Perspective camera (for animation and spatial feel)
   */
  perspective: {
    fov: 42,               // Narrow FOV for more architectural clarity
    aspect: null,          // Set by renderer (window.innerWidth / window.innerHeight)
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 6, z: 18 }, // Isometric-like view
  },

  /**
   * Orthographic camera (alternative - more technical drawing feel)
   * Uncomment below to switch to orthographic perspective
   */
  orthographic: {
    left: -20,
    right: 20,
    top: 12,
    bottom: -12,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 6, z: 18 },
  },

  /**
   * Camera movement animations
   * Smooth, deliberate transitions (not snappy)
   */
  animation: {
    defaultDuration: 1200,      // ms - slow, deliberate zoom
    easing: 'easeInOutCubic',   // Smooth acceleration/deceleration
    enableDamping: true,        // Inertial damping
    autoRotate: false,          // No gratuitous spinning
  },
};

/**
 * Interaction States
 * How elements respond to user interaction
 * 
 * Philosophy: Subtle, non-disruptive feedback using opacity and emphasis
 */
export const KAMI_INTERACTIONS = {
  /**
   * Hover state - element is under mouse
   */
  hover: {
    opacity: 1.0,          // Full opacity
    scale: 1.05,           // Slight enlargement
    outlineWidth: 2,       // Emphasize edge
    duration: 200,         // ms
  },

  /**
   * Selected state - element is active/focused
   */
  selected: {
    opacity: 1.0,
    scale: 1.0,
    outlineWidth: 3,       // Thicker edge
    materialVariant: 'focus', // Use focus material (ink emphasis)
    duration: 300,
  },

  /**
   * Context state - element is supporting information
   */
  context: {
    opacity: 0.6,          // Faded
    scale: 0.95,           // Slightly smaller
    materialVariant: 'context',
  },

  /**
   * Muted state - element is background reference
   */
  muted: {
    opacity: 0.4,          // Heavily faded
    scale: 1.0,
    materialVariant: 'muted',
  },

  /**
   * Disabled state - element not interactive
   */
  disabled: {
    opacity: 0.2,
    scale: 1.0,
  },
};

/**
 * Scene Configuration
 * Overall rendering settings that enforce Kami principles
 */
export const KAMI_SCENE = {
  /**
   * Background color
   */
  background: {
    color: KAMI_TOKENS.canvas,  // #f5f4ed
    alpha: 1.0,
  },

  /**
   * Renderer settings
   */
  renderer: {
    antialias: true,
    alpha: false,
    pixelRatio: 'auto',    // Use device pixel ratio
    shadowMap: {
      enabled: false,      // No shadows - too game-like
      type: 'PCFShadowMap',
    },
  },

  /**
   * Canvas size and responsiveness
   */
  canvas: {
    fullscreen: true,
    responsive: true,
  },
};

/**
 * Kami Three.js Adapter Factory
 * 
 * Creates properly configured Three.js objects using Kami semantics
 * 
 * Usage:
 * ```javascript
 * import * as THREE from 'three';
 * import { KamiAdapter } from './kami-threejs-adapter.mjs';
 * 
 * const kami = new KamiAdapter(THREE);
 * const scene = kami.createScene();
 * const camera = kami.createCamera(window.innerWidth, window.innerHeight);
 * const materials = kami.getMaterials();
 * ```
 */
export class KamiAdapter {
  constructor(THREE) {
    this.THREE = THREE;
    this.tokens = KAMI_TOKENS;
    this.materials = null;
    this.initialized = false;
  }

  /**
   * Initialize all materials (must be called after THREE is available)
   */
  initializeMaterials() {
    this.materials = {
      focus: KAMI_MATERIALS.focus(this.THREE),
      secondary: KAMI_MATERIALS.secondary(this.THREE),
      context: KAMI_MATERIALS.context(this.THREE),
      muted: KAMI_MATERIALS.muted(this.THREE),
      neutral: KAMI_MATERIALS.neutral(this.THREE),
      canvas: KAMI_MATERIALS.canvas(this.THREE),
      outline: KAMI_MATERIALS.outline(this.THREE),
      outlineFocus: KAMI_MATERIALS.outlineFocus(this.THREE),
    };
    this.initialized = true;
    return this.materials;
  }

  /**
   * Get all configured materials
   */
  getMaterials() {
    if (!this.initialized) {
      this.initializeMaterials();
    }
    return this.materials;
  }

  /**
   * Create a Kami-styled scene
   */
  createScene() {
    const scene = new this.THREE.Scene();
    scene.background = new this.THREE.Color(KAMI_SCENE.background.color);
    return scene;
  }

  /**
   * Create a Kami-styled camera
   */
  createCamera(width, height) {
    const config = KAMI_CAMERA.perspective;
    const camera = new this.THREE.PerspectiveCamera(
      config.fov,
      width / height,
      config.near,
      config.far
    );
    camera.position.set(
      config.position.x,
      config.position.y,
      config.position.z
    );
    return camera;
  }

  /**
   * Create Kami lighting setup
   */
  createLighting(scene) {
    const lights = {
      ambient: new this.THREE.AmbientLight(
        KAMI_LIGHTING.ambient.color,
        KAMI_LIGHTING.ambient.intensity
      ),
      directional: new this.THREE.DirectionalLight(
        KAMI_LIGHTING.directional.color,
        KAMI_LIGHTING.directional.intensity
      ),
    };

    lights.directional.position.set(
      KAMI_LIGHTING.directional.position.x,
      KAMI_LIGHTING.directional.position.y,
      KAMI_LIGHTING.directional.position.z
    );
    lights.directional.castShadow = KAMI_LIGHTING.directional.castShadow;

    scene.add(lights.ambient);
    scene.add(lights.directional);

    return lights;
  }

  /**
   * Create canvas/ground plane
   */
  createGround(scene) {
    const config = KAMI_GEOMETRY.canvas;
    const ground = new this.THREE.Mesh(
      new this.THREE.PlaneGeometry(config.width, config.height),
      this.getMaterials().canvas
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.3;
    scene.add(ground);
    return ground;
  }

  /**
   * Get tokens
   */
  getTokens() {
    return this.tokens;
  }

  /**
   * Get geometry configuration
   */
  getGeometry() {
    return KAMI_GEOMETRY;
  }

  /**
   * Get lighting configuration
   */
  getLighting() {
    return KAMI_LIGHTING;
  }

  /**
   * Get camera configuration
   */
  getCamera() {
    return KAMI_CAMERA;
  }

  /**
   * Get interaction states
   */
  getInteractions() {
    return KAMI_INTERACTIONS;
  }
}

/**
 * Export everything for modular usage
 */
export {
  KAMI_TOKENS,
  KAMI_MATERIALS,
  KAMI_GEOMETRY,
  KAMI_LIGHTING,
  KAMI_CAMERA,
  KAMI_INTERACTIONS,
  KAMI_SCENE,
};
