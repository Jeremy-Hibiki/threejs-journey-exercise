import { Scene } from 'three';
import Experience from '..';
import Resources from '../utils/Resources';
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
  private experience: Experience;
  private scene: Scene;
  private resources: Resources;

  environment?: Environment;
  floor?: Floor;
  fox?: Fox;

  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    this.fox?.update();
  }
}
