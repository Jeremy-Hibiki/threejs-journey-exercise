import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import portalFragmentShader from './shaders/portal/portal.frag';
import portalVertexShader from './shaders/portal/portal.vert';
import sparksFragmentShader from './shaders/sparks/sparks.frag';
import sparksVertexShader from './shaders/sparks/sparks.vert';

/**
 * Base
 */
// Debug
const debugObj = {
  clearColor: '#1c0303',
};

const gui = new GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();
const bakedTexture = textureLoader.load('/Baked.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

// Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// Emission Materials
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: '#7bb6ff' });

const portalUniforms = {
  uTime: { value: 0 },
  uColorCenter: { value: new THREE.Color('#7a4e7e') },
  uColorEdge: { value: new THREE.Color('#f9b4cc') },
};

gui.addColor(portalUniforms.uColorCenter, 'value').name('Center Color');
gui.addColor(portalUniforms.uColorEdge, 'value').name('Edge Color');

const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: portalUniforms,
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  side: THREE.DoubleSide,
});

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.load('/portal-merged.glb', (gltf) => {
  const { scene: model } = gltf;

  const bakedMesh = model.children.find((child) => child.name.includes('Baked')) as THREE.Mesh;
  bakedMesh.material = bakedMaterial;

  const emissions = model.children.filter((child) => child.name.match(/light/i)) as THREE.Mesh[];
  emissions.forEach((emission) => {
    if (emission.name.includes('PoleLight')) {
      emission.material = poleLightMaterial;
    } else if (emission.name.includes('PortalLight')) {
      emission.material = portalLightMaterial;
    }
  });

  scene.add(model);
});

// Sparks
const sparksGeometry = new THREE.BufferGeometry();
const sparksCount = 40;
const position = [] as number[];
const scale = [] as number[];

for (let i = 0; i < sparksCount; i++) {
  const i3 = i * 3;
  position[i3] = (Math.random() - 0.5) * 4;
  position[i3 + 1] = Math.random() * 2;
  position[i3 + 2] = (Math.random() - 0.5) * 4;

  scale[i] = Math.max(0.2, Math.random());
}

sparksGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
sparksGeometry.setAttribute('aScale', new THREE.Float32BufferAttribute(scale, 1));

const sparksUniforms = {
  uTime: { value: 0 },
  uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  uPointSize: { value: 150 },
};

gui.add(sparksUniforms.uPointSize, 'value').min(0).max(400).step(0.01).name('Spark Size');

const sparksMaterial = new THREE.ShaderMaterial({
  uniforms: sparksUniforms,
  vertexShader: sparksVertexShader,
  fragmentShader: sparksFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const sparks = new THREE.Points(sparksGeometry, sparksMaterial);
scene.add(sparks);

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

renderer.setClearColor(debugObj.clearColor);
gui.addColor(debugObj, 'clearColor').onChange((value: string) => {
  renderer.setClearColor(value);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sparksUniforms.uTime.value = elapsedTime;
  portalUniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

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
  sparksUniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});
