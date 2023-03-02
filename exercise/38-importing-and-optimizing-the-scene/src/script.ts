import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

/**
 * Base
 */
// Debug
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
const portalLightMaterial = new THREE.MeshBasicMaterial({
  color: '#ff408f',
  side: THREE.DoubleSide,
});

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.load('/portal-merged.glb', (gltf) => {
  const { scene: model } = gltf;

  // model.traverse((child) => {
  //   if (child instanceof THREE.Mesh) {
  //     child.material = bakedMaterial;
  //   }
  // });
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

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
