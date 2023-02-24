import * as CANNON from 'cannon-es';
import GUI from 'lil-gui';
import throttle from 'lodash/throttle';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

const hitSound = new Audio('/sounds/hit.mp3');

function playHitSound(impactStrength: number) {
  if (impactStrength > 1.5) {
    // Use `arctan(x)` to make volume change with velocity AND it is nonlinear
    // Narrow down the value range to 0 to 1
    hitSound.volume = Math.abs((Math.atan(impactStrength) / Math.PI) * 2);
    hitSound.currentTime = 0;
    hitSound.play();
  }
}

function collideHandler(event: {
  type: typeof CANNON.Body.COLLIDE_EVENT_NAME;
  body: CANNON.Body;
  contact: CANNON.ContactEquation;
}) {
  const impactStrength = event.contact.getImpactVelocityAlongNormal();
  throttle(playHitSound, 200)(impactStrength);
}
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png',
]);

/**
 * Physics
 */
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
  allowSleep: true,
});
world.broadphase = new CANNON.SAPBroadphase(world);

const defaultMaterial = new CANNON.Material('concrete');
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1,
  restitution: 0.7,
});
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objList = [] as { mesh: THREE.Mesh; body: CANNON.Body }[];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
function createSphere(radius: number, { x, y, z }: { x: number; y: number; z: number }) {
  // THREE.Mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.set(x, y, z);
  scene.add(mesh);
  // CANNON.Body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    shape,
    material: defaultMaterial,
  });
  body.addEventListener('collide', collideHandler);
  world.addBody(body);
  // Add to list
  objList.push({ mesh, body });
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
function createBox(
  width: number,
  height: number,
  depth: number,
  { x, y, z }: { x: number; y: number; z: number },
) {
  // THREE.Mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.set(x, y, z);
  scene.add(mesh);
  // CANNON.Body
  const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    shape,
    material: defaultMaterial,
  });
  body.addEventListener('collide', collideHandler);
  world.addBody(body);
  // Add to list
  objList.push({ mesh, body });
}

/**
 * Debug
 */
const debugObj = {
  createSphere() {
    createSphere(Math.random() / 2, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
  createBox() {
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
  reset() {
    objList.forEach(({ mesh, body }) => {
      body.removeEventListener('collide', collideHandler);
      world.removeBody(body);
      scene.remove(mesh);
    });
    objList.splice(0, objList.length);
  },
};
const gui = new GUI();
gui.add(debugObj, 'createSphere');
gui.add(debugObj, 'createBox');
gui.add(debugObj, 'reset');

/**
 * Animate
 */
const clock = new THREE.Clock();
let elapsedTime = clock.getElapsedTime();

function tick() {
  const delta = clock.getElapsedTime() - elapsedTime;
  elapsedTime += delta;

  // Update physics world
  world.step(1 / 60, delta, 3);

  objList.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position as any);
    mesh.quaternion.copy(body.quaternion as any);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

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
