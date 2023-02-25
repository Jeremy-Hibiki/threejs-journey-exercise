/* eslint-disable @typescript-eslint/no-namespace */
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import waterFragmentShader from './shaders/water/water.frag';
import waterVertexShader from './shaders/water/water.vert';
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 1024, 1024);

// Material
const uniforms = {
  u_time: { value: 0 },

  u_bigWavesElevation: { value: 0.2 },
  u_bigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
  u_bigWavesSpeed: { value: 0.75 },

  u_smallWavesElevation: { value: 0.15 },
  u_smallWavesFrequency: { value: 3 },
  u_smallWavesSpeed: { value: 0.2 },
  u_smallWavesIterationNum: { value: 4 },

  u_depthColor: { value: new THREE.Color('#186691') },
  u_surfaceColor: { value: new THREE.Color('#9bd8ff') },
  u_mixColorOffset: { value: 0.08 },
  u_mixColorMultiplier: { value: 5 },
};

const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms,
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Debug GUI
 */
// Big waves
const bigWavesGUI = gui.addFolder('Big Waves');
bigWavesGUI.add(uniforms.u_bigWavesElevation, 'value').min(0).max(1).step(0.01).name('Elevation');
bigWavesGUI
  .add(uniforms.u_bigWavesFrequency.value, 'x')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Frequency X');
bigWavesGUI
  .add(uniforms.u_bigWavesFrequency.value, 'y')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Frequency Y');
bigWavesGUI.add(uniforms.u_bigWavesSpeed, 'value').min(0).max(4).step(0.01).name('Speed');
// Small waves
const smallWavesGUI = gui.addFolder('Small Waves');
smallWavesGUI
  .add(uniforms.u_smallWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.01)
  .name('Elevation');
smallWavesGUI
  .add(uniforms.u_smallWavesFrequency, 'value')
  .min(0)
  .max(30)
  .step(0.01)
  .name('Frequency');
smallWavesGUI.add(uniforms.u_smallWavesSpeed, 'value').min(0).max(4).step(0.01).name('Speed');
smallWavesGUI
  .add(uniforms.u_smallWavesIterationNum, 'value')
  .min(0)
  .max(8)
  .step(1)
  .name('Iteration Num');
// Color
const wavesColorGUI = gui.addFolder('Waves Color');
wavesColorGUI.addColor(uniforms.u_depthColor, 'value').name('Depth Color');
wavesColorGUI.addColor(uniforms.u_surfaceColor, 'value').name('Surface Color');
wavesColorGUI
  .add(uniforms.u_mixColorOffset, 'value')
  .min(0)
  .max(1)
  .step(0.01)
  .name('Mix Color Offset');
wavesColorGUI
  .add(uniforms.u_mixColorMultiplier, 'value')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Mix Color Multiplier');

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
camera.position.set(1, 1, 1);
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
  uniforms.u_time.value = elapsedTime;

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
