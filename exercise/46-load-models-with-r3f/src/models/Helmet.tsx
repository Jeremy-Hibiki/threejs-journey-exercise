import { useLoader } from '@react-three/fiber';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

const Helmet = () => {
  const model = useLoader(GLTFLoader, '/FlightHelmet/glTF/FlightHelmet.gltf', (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
  });

  return (
    <>
      <primitive object={model.scene} position-y={-1} scale={5} />
    </>
  );
};

export default Helmet;
