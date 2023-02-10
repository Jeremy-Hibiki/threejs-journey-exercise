import gsap from 'gsap';
import GUI from 'lil-gui';
import * as THREE from 'three';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

const parameters = {
  materialColor: '#ffeded',
};

/**
 * Objects
 */

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const objDistance = 4;

const meshes: THREE.Mesh[] = [
  new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material),
  new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32, 32), material),
  new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material),
];

meshes.forEach((mesh, idx) => {
  mesh.position.y = -objDistance * idx;
  mesh.position.x = idx % 2 ? -2 : 2;
});

scene.add(...meshes);

/**
 * Particles
 */
const count = 300;
const positionArray = new Float32Array(count * 3);

for (let i = 0; i < count; i += 3) {
  positionArray[i] = (Math.random() - 0.5) * 10;
  positionArray[i + 1] = objDistance * 0.5 - Math.random() * objDistance * meshes.length;
  positionArray[i + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03,
  }),
);

scene.add(particles);

/**
 * Lights
 */
const light = new THREE.DirectionalLight();
light.position.set(1, 1, 0);
scene.add(light);

/**
 * Debug
 */
const gui = new GUI();

gui.addColor(parameters, 'materialColor');
gui.onChange(() => {
  material.color.set(parameters.materialColor);
  particles.material.color.set(parameters.materialColor);
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
const cameraGroup = new THREE.Group();
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);
scene.add(cameraGroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let lastSection = 0;
let currentSection = 0;

const cursorPosition = {
  x: 0,
  y: 0,
};
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  currentSection = Math.round(scrollY / sizes.height);
  if (lastSection != currentSection) {
    lastSection = currentSection;
    gsap.to(meshes[currentSection].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=5',
    });
  }
});

window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  cursorPosition.x = clientX / sizes.width - 0.5;
  cursorPosition.y = 0.5 - clientY / sizes.height;
});

/**
 * Animate
 */
const clock = new THREE.Clock();

let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  meshes.forEach((mesh) => {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  });

  camera.position.y = (-scrollY / sizes.height) * objDistance;

  const { x: parallaxX, y: parallaxY } = cursorPosition;
  cameraGroup.position.x += (parallaxX * 0.5 - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y += (parallaxY * 0.5 - cameraGroup.position.y) * 5 * deltaTime;

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
