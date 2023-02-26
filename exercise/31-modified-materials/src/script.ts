import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader';

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
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

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
 * Material
 */

// Textures
const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg');
mapTexture.encoding = THREE.sRGBEncoding;

const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg');

// Material
const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
});

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

/**
 * Models
 */
function updateAllMaterials() {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = 1;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
  // Model
  const mesh = gltf.scene.children[0] as THREE.Mesh;
  mesh.rotation.y = Math.PI * 0.5;
  mesh.material = material;
  mesh.customDepthMaterial = depthMaterial;
  scene.add(mesh);

  updateAllMaterials();
});

// Modify materials
const uniforms = {
  uTime: { value: 0 },
  uSpeed: { value: 0.3 },
  uAmplitude: { value: 0.2 },
  uFrequency: { value: 3 },
};

gui.add(uniforms.uSpeed, 'value').min(0.0).max(2).step(0.01).name('Speed');
gui.add(uniforms.uAmplitude, 'value').min(0.0).max(2).step(0.01).name('Amplitude');
gui.add(uniforms.uFrequency, 'value').min(1).max(5).step(1).name('Frequency ');

material.onBeforeCompile = (shader) => {
  shader.uniforms = { ...uniforms, ...shader.uniforms };

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `
#include <common>
uniform float uTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFrequency;

mat2 getRotationMat2(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
`,
    )
    .replace(
      '#include <beginnormal_vertex>',
      /* glsl */ `
#include <beginnormal_vertex>
float angle = floor(mod((position.y + uTime) * uSpeed, uFrequency) * uFrequency) / uFrequency * uAmplitude;
mat2 rotateMat = getRotationMat2(angle);
objectNormal.xz *= rotateMat;
`,
    )
    .replace(
      '#include <begin_vertex>',
      /* glsl */ `
#include <begin_vertex>
transformed.xz *= rotateMat;
`,
    );
};

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms = { ...uniforms, ...shader.uniforms };

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `
#include <common>
uniform float uTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFrequency;

mat2 getRotationMat2(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
`,
    )
    .replace(
      '#include <begin_vertex>',
      /* glsl */ `
#include <begin_vertex>
float angle = floor(mod((position.y + uTime) * uSpeed, uFrequency) * uFrequency) / uFrequency * uAmplitude;
mat2 rotateMat = getRotationMat2(angle);
transformed.xz *= rotateMat;
`,
    );
};

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15, 15), new THREE.MeshStandardMaterial());
plane.position.set(0, -5, 5);
plane.rotateY(Math.PI);
scene.add(plane);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Pass
 */
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  samples: renderer.getPixelRatio() > 1 ? 0 : 2,
});
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = true;
effectComposer.addPass(glitchPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

if (!renderer.capabilities.isWebGL2 && renderer.getPixelRatio() === 1) {
  const smaaPass = new SMAAPass(sizes.width, sizes.height);
  effectComposer.addPass(smaaPass);
}

gui.add(glitchPass, 'enabled').name('Enable Glitch Pass');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  effectComposer.render();

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
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
