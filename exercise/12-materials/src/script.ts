import { GUI } from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

const gui = new GUI();

// Textures
const textureLoader = new THREE.TextureLoader(
  new THREE.LoadingManager(
    () => {
      console.log('All loaded');
    },
    (url, loaded, total) => {
      console.log(`Loading ${url} (${loaded} of ${total})`);
    },
    (url) => {
      console.warn('[Error] ', url);
    },
  ),
);

const cubeTextureLoader = new THREE.CubeTextureLoader();

// const doorTextures = {
//   color: textureLoader.load('/textures/door/color.jpg'),
//   alpha: textureLoader.load('/textures/door/alpha.jpg'),
//   height: textureLoader.load('/textures/door/height.jpg'),
//   normal: textureLoader.load('/textures/door/normal.jpg'),
//   ambientOcclusion: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
//   metalness: textureLoader.load('/textures/door/metalness.jpg'),
//   roughness: textureLoader.load('/textures/door/roughness.jpg'),
// };
// const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

const envMapIndex = 0;

const environmentTexture = cubeTextureLoader.load(
  ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(
    (item) => `/textures/environmentMaps/${envMapIndex}/${item}.jpg`,
  ),
);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// const material = new THREE.MeshBasicMaterial();
// material.map = doorTextures.color;
// material.alphaMap = doorTextures.alpha;
// material.color = new THREE.Color('#f0f');
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 10000;
// material.specular = new THREE.Color('#f0f');

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

const material = new THREE.MeshStandardMaterial();
// material.map = doorTextures.color;
// material.aoMap = doorTextures.ambientOcclusion;
material.metalness = 0.7;
material.roughness = 0.1;
// material.displacementMap = doorTextures.height;
// material.displacementScale = 0.05;
// material.metalnessMap = doorTextures.metalness;
// material.roughnessMap = doorTextures.roughness;
// material.normalMap = doorTextures.normal;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = doorTextures.alpha;
// material.transparent = true;

material.envMap = environmentTexture;

gui.add(material, 'metalness', 0, 1, 0.01);
gui.add(material, 'roughness', 0, 1, 0.01);
gui.add(material, 'aoMapIntensity', 0, 10, 0.01);
gui.add(material, 'displacementScale', 0, 1, 0.01);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 50, 50), material);
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material);
sphere.position.x = -2;
torus.position.x = 2;

sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute((<THREE.BufferAttribute>sphere.geometry.attributes.uv).array, 2),
);
plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute((<THREE.BufferAttribute>plane.geometry.attributes.uv).array, 2),
);
torus.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute((<THREE.BufferAttribute>torus.geometry.attributes.uv).array, 2),
);

scene.add(sphere, plane, torus);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight('#fff', 0.5);
const pointLight = new THREE.PointLight('#fff', 0.5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

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
