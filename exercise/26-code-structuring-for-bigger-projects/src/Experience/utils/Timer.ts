import { EventEmitter } from 'events';

export default class Timer extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;

  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 1 / 60;

    window.requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    const currTime = Date.now();
    this.delta = currTime - this.current;
    this.current = currTime;
    this.elapsed = currTime - this.start;

    this.emit('tick');

    window.requestAnimationFrame(this.tick.bind(this));
  }
}
