import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = 2.5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post-processing
 */
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  samples: renderer.getPixelRatio() > 1 ? 0 : 2,
});
const composer = new EffectComposer(renderer, renderTarget);
composer.setSize(sizes.width, sizes.height);
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
composer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
composer.addPass(glitchPass);

const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 1, 0.4);
unrealBloomPass.enabled = false;
composer.addPass(unrealBloomPass);

const unrealBloomPassGUI = gui.addFolder('UnrealBloomPass');
unrealBloomPassGUI.add(unrealBloomPass, 'enabled');
unrealBloomPassGUI.add(unrealBloomPass, 'strength').min(0).max(2).step(0.01);
unrealBloomPassGUI.add(unrealBloomPass, 'radius').min(0).max(2).step(0.01);
unrealBloomPassGUI.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.01);

const TintShader: Pick<
  THREE.ShaderMaterialParameters,
  'uniforms' | 'vertexShader' | 'fragmentShader'
> = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uTint: {
      value: null,
    },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      vUv = uv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.rgb += uTint;
      gl_FragColor = color;
    }
  `,
};
const tintPass = new ShaderPass(TintShader);
tintPass.uniforms.uTint.value = new THREE.Vector3();
composer.addPass(tintPass);

const tintPassGUI = gui.addFolder('TintPass');
tintPassGUI.add(tintPass.material.uniforms.uTint.value, 'x').name('red').min(-1).max(1).step(0.01);
tintPassGUI
  .add(tintPass.material.uniforms.uTint.value, 'y')
  .name('green')
  .min(-1)
  .max(1)
  .step(0.01);
tintPassGUI.add(tintPass.material.uniforms.uTint.value, 'z').name('blue').min(-1).max(1).step(0.01);

const DisplacementShader: Pick<
  THREE.ShaderMaterialParameters,
  'uniforms' | 'vertexShader' | 'fragmentShader'
> = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uNormalMap: {
      value: null,
    },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      vUv = uv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;

    varying vec2 vUv;

    void main() {
      vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;

      vec2 newUv = vUv + normalColor.xy * 0.1;
      vec4 color = texture2D(tDiffuse, newUv);

      vec3 lightDirection = normalize(vec3(-1., 1., 0.));
      float lightness = clamp(dot(normalColor, lightDirection), 0., 1.);
      color.rgb += lightness * 2.0;

      gl_FragColor = color;
    }
  `,
};
const displacementPass = new ShaderPass(DisplacementShader);
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
  '/textures/interfaceNormalMap.png',
);
composer.addPass(displacementPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
composer.addPass(rgbShiftPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrectionPass);

if (!renderer.capabilities.isWebGL2 && renderer.getPixelRatio() === 1) {
  const smaaPass = new SMAAPass(sizes.width, sizes.height);
  composer.addPass(smaaPass);
}

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  composer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.setSize(sizes.width, sizes.height);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
