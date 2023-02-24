import { GUI } from 'lil-gui';
import { AnimationAction, AnimationMixer, Group, Mesh, Scene } from 'three';
import { GLTF } from 'three/addons/loaders/GLTFLoader';
import Experience from '../index';
import Debug from '../utils/Debug';
import Resources from '../utils/Resources';
import Timer from '../utils/Timer';

enum AnimationNameEnum {
  idle = 'idle',
  walking = 'walking',
  running = 'running',
}

type ActionType = {
  [key in keyof typeof AnimationNameEnum]: AnimationAction;
} & {
  current: AnimationAction;
};

const debugObject = {
  animationName: AnimationNameEnum.idle,
};

export default class Fox {
  private experience: Experience;
  private scene: Scene;
  private resources: Resources;
  private timer: Timer;
  private debug: Debug;
  private debugFolder?: GUI;

  private gltf: GLTF;
  private model!: Group;
  private animation!: {
    mixer: AnimationMixer;
    actions: ActionType;
    play: (name: keyof typeof AnimationNameEnum) => void;
  };

  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.timer = this.experience.timer;
    this.debug = this.experience.debug;

    if (this.debug.isActive && this.debug.gui) {
      this.debugFolder = this.debug.gui.addFolder('Fox');
    }

    this.gltf = this.resources.items.foxModel as GLTF;
    this.setModel();
    this.setAnimation();
  }

  private setModel() {
    this.model = this.gltf.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.model.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.castShadow = true;
      }
    });

    this.scene.add(this.model);
  }

  private setAnimation() {
    this.animation = {
      mixer: new AnimationMixer(this.model),
      actions: {} as ActionType,
      play: () => {},
    };
    this.animation.actions = {
      [AnimationNameEnum.idle]: this.animation.mixer.clipAction(this.gltf.animations[0]),
      [AnimationNameEnum.walking]: this.animation.mixer.clipAction(this.gltf.animations[1]),
      [AnimationNameEnum.running]: this.animation.mixer.clipAction(this.gltf.animations[2]),
    } as ActionType;

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1, true);

      this.animation.actions.current = newAction;
    };

    if (this.debugFolder) {
      this.debugFolder
        .add(debugObject, 'animationName', AnimationNameEnum)
        .name('Status')
        .onChange(this.animation.play);
    }
  }

  update() {
    this.animation.mixer.update(this.timer.delta / 1000);
  }
}
