import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DirectionalLight } from 'three';

const Lights = () => {
  const lightRef = useRef<DirectionalLight>(null!);

  useFrame(({ camera }) => {
    lightRef.current.position.z = camera.position.z - 3;
    lightRef.current.target.position.z = camera.position.z - 4;
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        intensity={1.5}
        position={[4, 4, 1]}
        shadow-mapSize={[1024, 1024]}
        castShadow
      >
        <orthographicCamera args={[-10, 10, 10, -10, 1, 10]} attach="shadow-camera" />
      </directionalLight>
      <ambientLight intensity={0.5} />
    </>
  );
};

export default Lights;
