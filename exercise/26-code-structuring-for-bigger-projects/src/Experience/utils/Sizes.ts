import { EventEmitter } from 'events';

export default class Sizes extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;

  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.emit('resize');
    });
  }
}