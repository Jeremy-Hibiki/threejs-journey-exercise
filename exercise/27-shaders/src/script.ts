import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import testFragmentShader from './shaders/test/fragment.frag.glsl';
import testVertexShader from './shaders/test/vertex.vert.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTextures = {
  french: textureLoader.load('/textures/flag-french.jpg'),
  chinese: textureLoader.load('/textures/flag-chinese.png'),
  buddhism: textureLoader.load('/textures/flag-buddhism.svg'),
  un: textureLoader.load('/textures/flag-un.svg'),
  europe: textureLoader.load('/textures/flag-europe.svg'),
  nato: textureLoader.load('/textures/flag-nato.svg'),
};

const debugObj = {
  currentFlag: 'french' as keyof typeof flagTextures,
};
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const { count } = geometry.getAttribute('position');
const randoms = Array(count).fill(0).map(Math.random);
geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 1));

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(10, 5),
    },
    uTime: {
      value: 0,
    },
    uColor: {
      value: new THREE.Color('orange'),
    },
    uTexture: {
      value: flagTextures[debugObj.currentFlag],
    },
  },
});

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('Frequency X');
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('Frequency Y');
gui
  .add(debugObj, 'currentFlag', Object.keys(flagTextures))
  .onChange(() => {
    material.uniforms.uTexture.value = flagTextures[debugObj.currentFlag];
  })
  .name('Flag of ..');

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Log shader codes
 */
setTimeout(() => {
  console.log(renderer.getContext().getShaderSource(renderer.info.programs![0].vertexShader));
  console.log(renderer.getContext().getShaderSource(renderer.info.programs![0].fragmentShader));
}, 0);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

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
