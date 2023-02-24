import Stats from 'stats.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
// import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils';

/**
 * Measurement
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const displacementTexture = textureLoader.load('/textures/displacementMap.png');

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
camera.position.set(2, 2, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  powerPreference: 'high-performance',
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/**
 * Test meshes
 */
const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial());
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.set(-5, 0, 0);
// scene.add(cube);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
  new THREE.MeshStandardMaterial(),
);
torusKnot.castShadow = true;
torusKnot.receiveShadow = true;
// scene.add(torusKnot);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial(),
);
sphere.position.set(5, 0, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
// scene.add(sphere);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial());
floor.position.set(0, -2, 0);
floor.rotation.x = -Math.PI * 0.5;
floor.castShadow = true;
floor.receiveShadow = true;
// scene.add(floor);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, 2.25);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update test mesh
  torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
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

/**
 * Tips
 */

// // Tip 4
// console.log(renderer.info);

// // Tip 6
// scene.remove(cube);
// cube.geometry.dispose();
// cube.material.dispose();

// // Tip 10
// directionalLight.shadow.camera.top = 3;
// directionalLight.shadow.camera.right = 6;
// directionalLight.shadow.camera.left = -6;
// directionalLight.shadow.camera.bottom = -3;
// directionalLight.shadow.camera.far = 10;
// directionalLight.shadow.mapSize.set(1024, 1024);

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

// // Tip 11
// cube.castShadow = true;
// cube.receiveShadow = false;

// torusKnot.castShadow = true;
// torusKnot.receiveShadow = false;

// sphere.castShadow = true;
// sphere.receiveShadow = false;

// floor.castShadow = false;
// floor.receiveShadow = true;

// // Tip 12
// renderer.shadowMap.autoUpdate = false;
// renderer.shadowMap.needsUpdate = true;

// // Tip 18
// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

//   const material = new THREE.MeshNormalMaterial();

//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

// // // Tip 19
// const geometries = [] as THREE.BufferGeometry[];

// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//   );
//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);
//   geometries.push(geometry);

//   // const mesh = new THREE.Mesh(geometry, material);
//   // mesh.position.x = (Math.random() - 0.5) * 10;
//   // mesh.position.y = (Math.random() - 0.5) * 10;
//   // mesh.position.z = (Math.random() - 0.5) * 10;
//   // mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   // mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
//   // scene.add(mesh);
// }

// const mergedGeometry = mergeBufferGeometries(geometries);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(mergedGeometry, material);
// scene.add(mesh);

// // Tip 20
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();

// for (let i = 0; i < 50; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

// // Tip 22
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.InstancedMesh(geometry, material, 50);
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
// scene.add(mesh);

// for (let i = 0; i < 50; i++) {
//   const matrix = new THREE.Matrix4();

//   const quaternion = new THREE.Quaternion();
//   quaternion.setFromEuler(
//     new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2),
//   );
//   matrix.makeRotationFromQuaternion(quaternion);

//   const position = new THREE.Vector3(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//   );
//   matrix.setPosition(position);

//   mesh.setMatrixAt(i, matrix);
// }

// // Tip 29
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tip 31, 32, 34 and 35
const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uDisplacementTexture: { value: displacementTexture },
    // uDisplacementStrength: { value: 1.5 },
  },
  defines: {
    uDisplacementStrength: 1.5,
  },
  precision: 'lowp',
  vertexShader: /* glsl */ `
    // #define uDisplacementStrength 1.5

    uniform sampler2D uDisplacementTexture;
    // uniform float uDisplacementStrength;

    varying vec3 vColor;

    void main() {
      // Position
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      float elevation = texture2D(uDisplacementTexture, uv).r;
      // if(elevation < 0.5) { elevation = 0.5; }
      elevation = max(elevation, 0.5);
      modelPosition.y += elevation * uDisplacementStrength;
      gl_Position = projectionMatrix * viewMatrix * modelPosition;

      // Color
      float colorElevation = clamp(elevation, 0.25, 1.);
      vec3 finalColor = mix(
        vec3(1.0, 0.1, 0.1), // Depth Color
        vec3(0.1, 0.0, 0.5), // Surface Color
        elevation
      );
      vColor = finalColor;
    }
    `,
  fragmentShader: /* glsl */ `
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);
