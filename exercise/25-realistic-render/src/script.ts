import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Textures
 */
const envMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);
envMap.encoding = THREE.sRGBEncoding;

/**
 * Base
 */
// Debug
const gui = new GUI();

const debugObj = {
  envMapIntensity: 2.5,
};

gui.add(debugObj, 'envMapIntensity').min(0).max(5).step(0.01).onChange(updateAllMaterials);

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();
scene.background = envMap;
scene.environment = envMap;

/**
 * Update all materials
 */
function updateAllMaterials() {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
      obj.material.envMapIntensity = debugObj.envMapIntensity;
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
}

/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial(),
);
// scene.add(testSphere);

/**
 * Models
 */
gltfLoader.load('/models/hamburger.glb', (gltf) => {
  const { scene: model } = gltf;
  model.scale.set(0.3, 0.3, 0.3);
  model.position.set(0, -1, 0);
  model.rotation.y = Math.PI / 2;
  scene.add(model);

  updateAllMaterials();

  gui.add(model.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('Model Rotation');
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#fff', 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

const guiDirectionalLight = gui.addFolder('Directional Light');
guiDirectionalLight
  .add(directionalLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Light Intensity');
guiDirectionalLight.add(directionalLight.position, 'x').min(-5).max(5).step(0.01).name('Light X');
guiDirectionalLight.add(directionalLight.position, 'y').min(-5).max(5).step(0.01).name('Light Y');
guiDirectionalLight.add(directionalLight.position, 'z').min(-5).max(5).step(0.01).name('Light Z');

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);

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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const guiToneMapping = gui.addFolder('Tone Mapping');
guiToneMapping
  .add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .name('Algorithm');
guiToneMapping.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01).name('Exposure');

/**
 * Animate
 */
const tick = () => {
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
});
