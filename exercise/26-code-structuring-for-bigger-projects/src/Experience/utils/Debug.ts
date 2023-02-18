import { GUI } from 'lil-gui';

export default class Debug {
  isActive: boolean;
  gui?: GUI;

  constructor() {
    const params = new URLSearchParams(document.location.search);
    this.isActive = window.location.hash === '#debug' || params.has('debug');
    if (this.isActive) {
      this.gui = new GUI();
    }
  }
}
