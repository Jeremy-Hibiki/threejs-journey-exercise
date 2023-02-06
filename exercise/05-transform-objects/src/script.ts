import * as THREE from 'three';
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Group
 */
const group = new THREE.Group();
group.position.y = 1;
group.scale.y = 2;
group.rotateY(45);
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
);
cube2.position.set(-2, 0, 0);
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
);
cube3.position.set(2, 0, 0);
group.add(cube3);

// /**
//  * Objects
//  */
// const geometry = new BoxGeometry(1, 1, 1);
// const material = new MeshBasicMaterial({ color: 0xff50f0 });
// const mesh = new Mesh(geometry, material);

// /**
//  * Position
//  */
// mesh.position.set(0.7, -0.6, 1);

// /**
//  * Scale
//  */
// mesh.scale.set(2, 0.5, 0.5);

// mesh.rotation.x = Math.PI / 4;
// mesh.rotation.y = Math.PI / 4;
// mesh.rotation.order = 'YXZ';
// // scene.add(mesh);

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.lookAt(mesh.position);

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
