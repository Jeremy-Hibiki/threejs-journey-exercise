import { GUI } from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = <HTMLCanvasElement>document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/8.png');

/**
 * Particles
 */
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  // color: '#f8c',
  // map: particleTexture,
  alphaMap: particleTexture,
  transparent: true,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const count = 20_000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
positions.forEach((_, idx) => {
  positions[idx] = (Math.random() - 0.5) * 10;
  colors[idx] = Math.random();
});
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

/**
 * Cube
 */
const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshBasicMaterial());
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

  // particles.rotation.y = elapsedTime * 0.2;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const position = particleGeometry.attributes.position as THREE.BufferAttribute;
    const x = position.array[i3];
    /**
     * FIXME
     *
     * Update position directly is a bad idea because:
     *  1. With TypeScript, `BufferAttribute['array']` is typed as readonly.
     *  2. It can cause performance issue.
     *
     * A better way is to use "custom shaders", which will be learned later.
     */
    // @ts-ignore
    position.array[i3 + 1] = Math.sin(elapsedTime + x);
  }
  particleGeometry.attributes.position.needsUpdate = true;

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
