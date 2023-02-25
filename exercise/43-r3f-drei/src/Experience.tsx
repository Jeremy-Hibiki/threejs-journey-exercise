import {
  Float,
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  Text,
  TransformControls,
} from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

export default function Experience() {
  const cubeRef = useRef<Mesh>(null!);
  const sphereRef = useRef<Mesh>(null!);

  return (
    <>
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight intensity={1.5} position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />

      {/* Sphere with pivot control */}
      <PivotControls
        anchor={[0, 0, 0]}
        axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
        depthTest={false}
        lineWidth={4}
        scale={100}
        fixed
      >
        <mesh ref={sphereRef} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html
            distanceFactor={8}
            occlude={[cubeRef, sphereRef]}
            position={[1, 1, 0]}
            wrapperClass="label"
            center
          >
            This is a sphere 👏
          </Html>
        </mesh>
      </PivotControls>

      {/* Box with transform control */}
      <mesh ref={cubeRef} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <TransformControls object={cubeRef} />

      {/* Floor with MeshReflectorMaterial */}
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <MeshReflectorMaterial
          blur={1000}
          color="greenyellow"
          mirror={0.75}
          mixBlur={1}
          resolution={512}
        />
      </mesh>

      {/* Float & Text */}
      <Float floatIntensity={2} rotationIntensity={2} speed={5}>
        <Text
          color="salmon"
          font="/bangers-v20-latin-regular.woff"
          fontSize={0.75}
          maxWidth={6}
          position-y={2.5}
          textAlign="center"
        >
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </Text>
      </Float>
    </>
  );
}
