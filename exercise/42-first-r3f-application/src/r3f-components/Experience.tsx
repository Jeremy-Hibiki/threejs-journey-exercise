import type { ReactThreeFiber } from '@react-three/fiber';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CustomObject from './CustomObject';

extend({ OrbitControls });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

const Experience = () => {
  const { camera, gl } = useThree();

  const cubeRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    const elapsedTime = clock.getElapsedTime();
    cubeRef.current!.rotation.y += delta;
    // groupRef.current!.rotation.y += delta;
    camera.position.x = Math.sin(elapsedTime * 0.3) * 3;
    camera.position.z = Math.cos(elapsedTime * 0.3) * 3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />
      <ambientLight intensity={0.25} />
      <directionalLight intensity={1.5} position={[1, 2, 3]} />
      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh ref={cubeRef} position-x={2} rotation-y={Math.PI / 4} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>
      <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <CustomObject />
    </>
  );
};

export default Experience;
