import { PerspectiveCamera, Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Experience from '.';
import Sizes from './utils/Sizes';

export default class Camera {
  private experience: Experience;
  private sizes: Sizes;
  private scene: Scene;
  private canvas: HTMLCanvasElement;

  instance!: PerspectiveCamera;
  controls!: OrbitControls;

  constructor() {
    this.experience = new Experience();

    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
