import { EventEmitter } from 'events';
import { CubeTexture, CubeTextureLoader, Texture, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

enum LoaderTypeNameEnum {
  gltf = 'gltf',
  texture = 'texture',
  cubeTexture = 'cubeTexture',
}

type LoaderTypeName = keyof typeof LoaderTypeNameEnum;
type LoaderTypes = GLTFLoader | TextureLoader | CubeTextureLoader;
type ModelTypes = GLTF | Texture | CubeTexture;

export type ResourceItem = {
  name: string;
  type: LoaderTypeName;
  path: string | string[];
};

export default class Resources extends EventEmitter {
  private sources: ResourceItem[];

  items: Record<string, ModelTypes>;
  toLoad: number;
  loaded: number;
  loader!: Record<string, LoaderTypes>;

  constructor(sources: ResourceItem[]) {
    super();

    this.items = {};
    this.sources = sources;
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoader();
    this.sourceLoading();
  }

  setLoader() {
    this.loader = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    };
  }

  sourceLoading() {
    this.sources.forEach(({ type, path, name }) => {
      switch (type) {
        case LoaderTypeNameEnum.gltf:
          (this.loader.gltfLoader as GLTFLoader).load(path as string, this.sourceLoaded(name));
          break;
        case LoaderTypeNameEnum.texture:
          (this.loader.textureLoader as TextureLoader).load(
            path as string,
            this.sourceLoaded(name),
          );
          break;
        case LoaderTypeNameEnum.cubeTexture:
          (this.loader.cubeTextureLoader as CubeTextureLoader).load(
            path as string[],
            this.sourceLoaded(name),
          );
          break;
      }
    });
  }

  sourceLoaded(name: string) {
    return (file: ModelTypes) => {
      this.items[name] = file;
      this.loaded++;

      if (this.loaded === this.toLoad) {
        this.emit('ready');
      }
    };
  }
}
