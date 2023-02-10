import { GUI } from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type { BufferAttribute } from 'three/src/core/BufferAttribute';

/**
 * Base
 */

// Canvas
const canvas = <HTMLCanvasElement>document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorTextures = {
  color: textureLoader.load('/textures/door/color.jpg'),
  alpha: textureLoader.load('/textures/door/alpha.jpg'),
  ambientOcclusion: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
  height: textureLoader.load('/textures/door/height.jpg'),
  normal: textureLoader.load('/textures/door/normal.jpg'),
  metalness: textureLoader.load('/textures/door/metalness.jpg'),
  roughness: textureLoader.load('/textures/door/roughness.jpg'),
};
const brickTextures = {
  color: textureLoader.load('/textures/bricks/color.jpg'),
  ambientOcclusion: textureLoader.load('/textures/bricks/ambientOcclusion.jpg'),
  normal: textureLoader.load('/textures/bricks/normal.jpg'),
  roughness: textureLoader.load('/textures/bricks/roughness.jpg'),
};
const grassTextures = {
  color: textureLoader.load('/textures/grass/color.jpg'),
  ambientOcclusion: textureLoader.load('/textures/grass/ambientOcclusion.jpg'),
  normal: textureLoader.load('/textures/grass/normal.jpg'),
  roughness: textureLoader.load('/textures/grass/roughness.jpg'),
};
for (const value of Object.values(grassTextures)) {
  value.repeat.set(8, 8);
  value.wrapS = THREE.RepeatWrapping;
  value.wrapT = THREE.RepeatWrapping;
}
////////////////////////////////////////////////////////////////////////////////
/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 3, 4),
  new THREE.MeshStandardMaterial({
    map: brickTextures.color,
    aoMap: brickTextures.ambientOcclusion,
    normalMap: brickTextures.normal,
    roughnessMap: brickTextures.roughness,
  }),
);
walls.position.y = walls.geometry.parameters.height / 2;
walls.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute((<BufferAttribute>walls.geometry.getAttribute('uv')).array, 3),
);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    color: 0xb35f45,
  }),
);
roof.position.y = walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI / 4;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 64, 64),
  new THREE.MeshStandardMaterial({
    map: doorTextures.color,
    transparent: true,
    alphaMap: doorTextures.alpha,
    aoMap: doorTextures.ambientOcclusion,
    displacementMap: doorTextures.height,
    displacementScale: 0.1,
    normalMap: doorTextures.normal,
    metalnessMap: doorTextures.metalness,
    roughnessMap: doorTextures.roughness,
  }),
);
door.position.z = walls.geometry.parameters.depth / 2 + 0.01;
door.position.y = door.geometry.parameters.height / 2 - 0.09;
door.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute((<BufferAttribute>door.geometry.getAttribute('uv')).array, 3),
);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x89c854,
});
const bushScales = [0.5, 0.25, 0.4, 0.15];
const bushPositions = [
  [0.8, 0.2, 2.2],
  [1.4, 0.1, 2.1],
  [-0.8, 0.1, 2.2],
  [-1, 0.05, 2.6],
] as Parameters<THREE.Vector3['set']>[];

const bushes = new THREE.Group();
bushScales.forEach((scale, idx) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.set(scale, scale, scale);
  bush.position.set(...bushPositions[idx]);
  bushes.add(bush);
});

const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  color: 0xb2b6b1,
});
for (let i = 0; i < 40; i++) {
  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.random() * 5 + 4;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius);
  grave.rotation.y = ((Math.random() - 0.5) * Math.PI) / 4;
  grave.rotation.z = ((Math.random() - 0.5) * Math.PI) / 4;
  graves.add(grave);
}

house.add(walls, roof, door, bushes, graves);

////////////////////////////////////////////////////////////////////////////////
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassTextures.color,
    aoMap: grassTextures.ambientOcclusion,
    normalMap: grassTextures.normal,
    roughnessMap: grassTextures.roughness,
  }),
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute((<BufferAttribute>floor.geometry.getAttribute('uv')).array, 3),
);
scene.add(floor);

////////////////////////////////////////////////////////////////////////////////
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
scene.add(ambientLight, moonLight);

const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
const ghostColors = ['#f0f', '#0ff', '#ff0'];
const ghosts = ghostColors.map((c) => {
  return new THREE.PointLight(c, 2, 3);
});
scene.add(...ghosts);
/**
 * Fog
 */
const fogColor = 0x262837;
const fog = new THREE.Fog(fogColor, 2, 15);
scene.fog = fog;

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Debug
const gui = new GUI();
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(fogColor);

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghosts.forEach((ghost) => (ghost.castShadow = true));
bushes.children.forEach((bush) => (bush.castShadow = true));
graves.children.forEach((grave) => (grave.castShadow = true));
walls.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 7;
ghosts.forEach((ghost) => {
  ghost.shadow.mapSize.set(256, 256);
  ghost.shadow.camera.far = 7;
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts Running
  const ghostAngleCoefficients = [0.5, -0.32, -0.18];
  ghosts[0].position.set(
    Math.cos(elapsedTime * ghostAngleCoefficients[0]) * 4,
    Math.sin(elapsedTime * 4),
    Math.sin(elapsedTime * ghostAngleCoefficients[0]) * 3,
  );
  ghosts[1].position.set(
    Math.cos(elapsedTime * ghostAngleCoefficients[1]) * 5,
    Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5),
    Math.sin(elapsedTime * ghostAngleCoefficients[1]) * 5,
  );
  ghosts[2].position.set(
    Math.cos(elapsedTime * ghostAngleCoefficients[2]) * (7 + Math.sin(elapsedTime * 0.32)),
    Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2),
    Math.sin(elapsedTime * ghostAngleCoefficients[2]) * (7 + Math.sin(elapsedTime * 0.5)),
  );

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
