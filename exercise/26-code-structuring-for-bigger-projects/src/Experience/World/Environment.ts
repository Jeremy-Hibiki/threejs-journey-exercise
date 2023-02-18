import { GUI } from 'lil-gui';
import {
  CubeTexture,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  Scene,
  sRGBEncoding,
} from 'three';
import Experience from '../index';
import Debug from '../utils/Debug';
import Resources from '../utils/Resources';

export default class Environment {
  private experience: Experience;
  private scene: Scene;
  private resources: Resources;
  private debug: Debug;
  private debugFolder?: GUI;

  sunlight!: DirectionalLight;
  private environmentMap!: { intensity: number; texture: CubeTexture; updateMaterials: () => void };

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    if (this.debug.isActive && this.debug.gui) {
      this.debugFolder = this.debug.gui.addFolder('Environment');
    }

    this.setSunlight();
    this.setEnvironmentMap();
  }

  setSunlight() {
    this.sunlight = new DirectionalLight('#ffffff', 4);
    this.sunlight.castShadow = true;
    this.sunlight.shadow.camera.far = 15;
    this.sunlight.shadow.mapSize.set(1024, 1024);
    this.sunlight.shadow.normalBias = 0.05;
    this.sunlight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunlight);

    if (this.debugFolder) {
      this.debugFolder
        .add(this.sunlight, 'intensity')
        .name('Sunlight Intensity')
        .min(0)
        .max(10)
        .step(0.01);
      this.debugFolder
        .add(this.sunlight.position, 'x')
        .name('Sunlight X')
        .min(-5)
        .max(5)
        .step(0.01);
      this.debugFolder
        .add(this.sunlight.position, 'y')
        .name('Sunlight Y')
        .min(-5)
        .max(5)
        .step(0.01);
      this.debugFolder
        .add(this.sunlight.position, 'z')
        .name('Sunlight Z')
        .min(-5)
        .max(5)
        .step(0.01);
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {
      intensity: 0.4,
      texture: this.resources.items.environmentMapTexture as CubeTexture,
      updateMaterials() {},
    };
    this.environmentMap.texture.encoding = sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((obj) => {
        if (obj instanceof Mesh && obj.material instanceof MeshStandardMaterial) {
          obj.material.envMap = this.environmentMap.texture;
          obj.material.envMapIntensity = this.environmentMap.intensity;
          obj.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();

    if (this.debugFolder) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .name('Env Map Intensity')
        .min(0)
        .max(4)
        .step(0.01)
        .onChange(this.environmentMap.updateMaterials);
    }
  }
}
