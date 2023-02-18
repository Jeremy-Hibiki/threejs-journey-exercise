import {
  CircleGeometry,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  Scene,
  sRGBEncoding,
  Texture,
} from 'three';
import Experience from '../index';
import Resources from '../utils/Resources';

export default class Floor {
  private experience: Experience;
  private scene: Scene;
  private resources: Resources;

  private geometry!: CircleGeometry;
  private texture!: { normal: Texture; color: Texture };
  private material!: MeshStandardMaterial;
  private mesh!: Mesh<Floor['geometry'], Floor['material']>;

  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new CircleGeometry(5, 64);
  }

  setTextures() {
    this.texture = {
      color: this.resources.items.grassColorTexture as Texture,
      normal: this.resources.items.grassNormalTexture as Texture,
    };
    this.texture.color.encoding = sRGBEncoding;
    this.texture.color.repeat.set(1.5, 1.5);
    this.texture.color.wrapS = RepeatWrapping;
    this.texture.color.wrapT = RepeatWrapping;

    this.texture.normal.repeat.set(1.5, 1.5);
    this.texture.normal.wrapS = RepeatWrapping;
    this.texture.normal.wrapT = RepeatWrapping;
  }

  setMaterial() {
    this.material = new MeshStandardMaterial({
      map: this.texture.color,
      normalMap: this.texture.normal,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
