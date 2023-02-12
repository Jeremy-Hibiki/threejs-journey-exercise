import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Model
 */
const ambientLight = new THREE.AmbientLight('#fff', 0.3);
const directionalLight = new THREE.DirectionalLight('#fff', 0.7);
directionalLight.position.set(1, 2, 3);

scene.add(ambientLight, directionalLight);

const gltfLoader = new GLTFLoader();
let model: THREE.Group | null = null;

gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
  model = gltf.scene;
  model.position.y = -1.2;
  scene.add(model);
});

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);
object3.position.x = 2;
const objectList = [object1, object2, object3];

scene.add(object1, object2, object3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Mouse
 */
const mouse = new THREE.Vector2(-1, -1);

window.addEventListener('mousemove', ({ clientX, clientY }) => {
  mouse.x = (clientX / sizes.width - 0.5) * 2;
  mouse.y = (0.5 - clientY / sizes.height) * 2;
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

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

let currIntersect: THREE.Intersection<
  THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
> | null = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //
  object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5;
  object2.position.y = Math.sin(elapsedTime) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5;

  // Cast a ray
  /*
  const rayOrigin = new THREE.Vector3(-3, 0, 0);
  const rayDirection = new THREE.Vector3(1, 0, 0).normalize();
  raycaster.set(rayOrigin, rayDirection);

  const intersects =
    raycaster.intersectObjects<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(objs);

  objectList.forEach((obj) => {
    obj.material.color.set('#f00');
  });
  intersects.forEach((intersect) => {
    intersect.object.material.color.set('#00f');
  });
  */

  raycaster.setFromCamera(mouse, camera);

  const intersects =
    raycaster.intersectObjects<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(
      objectList,
    );

  objectList.forEach((obj) => {
    obj.material.color.set('#f00');
  });
  intersects.forEach((intersect) => {
    intersect.object.material.color.set('#00f');
  });

  if (intersects.length) {
    if (!currIntersect) {
      console.log('MouseEnter');
    }
    currIntersect = intersects[0];
  } else {
    if (currIntersect) {
      console.log('MouseLeave');
    }
    currIntersect = null;
  }

  // Intersect with model
  if (model) {
    const modelIntersect = raycaster.intersectObject<THREE.Group>(model, true);
    if (modelIntersect.length) {
      model.scale.set(1.2, 1.2, 1.2);
    } else {
      model.scale.set(1, 1, 1);
    }
  }
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

window.addEventListener('click', () => {
  if (currIntersect) {
    const idx = objectList.findIndex((obj) => obj === currIntersect?.object);
    console.log(`Click on object${idx + 1}`);
  }
});
