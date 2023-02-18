import { Material, Mesh, Scene, Texture } from 'three';
import Camera from './Camera';
import Renderer from './Renderer';
import sources from './sources';
import Debug from './utils/Debug';
import Resources from './utils/Resources';
import Sizes from './utils/Sizes';
import Timer from './utils/Timer';
import World from './World';

export default class Experience {
  private static _instance: Experience;

  canvas!: HTMLCanvasElement;
  sizes!: Sizes;
  timer!: Timer;
  debug!: Debug;

  scene!: Scene;
  resources!: Resources;
  camera!: Camera;
  renderer!: Renderer;

  world!: World;

  constructor(canvas?: HTMLCanvasElement) {
    if (Experience._instance) {
      return Experience._instance;
    }
    Experience._instance = this;

    this.canvas = canvas!;
    this.sizes = new Sizes();
    this.timer = new Timer();
    this.debug = new Debug();

    this.scene = new Scene();
    this.resources = new Resources(sources);

    this.camera = new Camera();
    this.renderer = new Renderer();

    this.world = new World();

    this.sizes.on('resize', this.resize.bind(this));
    this.timer.on('tick', this.update.bind(this));
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.removeAllListeners('resize');
    this.timer.removeAllListeners('tick');

    this.scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        Object.values(obj.material as Material).forEach((v) => {
          if (v instanceof Texture) {
            v.dispose();
          }
        });
      }
    });

    this.camera.controls.dispose();

    this.debug.gui?.destroy();
  }
}
