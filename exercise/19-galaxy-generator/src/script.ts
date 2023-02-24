import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

/**
 * Base
 */
// Debug
const gui = new GUI({
  width: 300,
  title: 'Galaxy Generator',
});

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

///////////////////////////////////////////////////////////////////////////////
/** Galaxy */
const parameters = {
  count: 100_000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};

gui.add(parameters, 'count').min(100).max(1_000_000).step(100);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001);
gui.add(parameters, 'radius').min(0.1).max(20).step(0.1);
gui.add(parameters, 'branches').min(2).max(20).step(1);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001);
gui.addColor(parameters, 'insideColor');
gui.addColor(parameters, 'outsideColor');

gui.onFinishChange(generateGalaxy);

let disposeFunc: (() => void) | null = null;

function generateGalaxy() {
  disposeFunc?.();

  const {
    count,
    size,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
  } = parameters;

  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);
  const colorInside = new THREE.Color(insideColor);
  const colorOutside = new THREE.Color(outsideColor);

  for (let i = 0; i < positionArray.length; i += 3) {
    const R = Math.random() * radius;
    const branchAngle = ((Math.PI * 2) / branches) * (((i / 3) | 0) % branches);
    const spinAngle = R * spin;

    const randomX =
      Math.random() ** randomnessPower * (Math.random() < 0.5 ? 1 : -1) * randomness * R;
    const randomY =
      Math.random() ** randomnessPower * (Math.random() < 0.5 ? 1 : -1) * randomness * R;
    const randomZ =
      Math.random() ** randomnessPower * (Math.random() < 0.5 ? 1 : -1) * randomness * R;

    positionArray[i] = Math.cos(branchAngle + spinAngle) * R + randomX;
    positionArray[i + 1] = randomY;
    positionArray[i + 2] = Math.sin(branchAngle + spinAngle) * R + randomZ;

    const colorMixed = colorInside.clone();
    colorMixed.lerp(colorOutside, R / radius);

    colorArray[i] = colorMixed.r;
    colorArray[i + 1] = colorMixed.g;
    colorArray[i + 2] = colorMixed.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  const material = new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  disposeFunc = () => {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  };
}

generateGalaxy();

///////////////////////////////////////////////////////////////////////////////

/**
 * Test cube
 */
// const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
// scene.add(cube);

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
camera.position.set(3, 3, 3);
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
