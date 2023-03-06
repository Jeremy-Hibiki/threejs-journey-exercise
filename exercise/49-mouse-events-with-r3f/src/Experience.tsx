import { Bvh, meshBounds, OrbitControls, useGLTF } from '@react-three/drei';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import { BufferGeometry, Mesh, MeshStandardMaterial } from 'three';

type ThreeMouseEvent = ThreeEvent<MouseEvent>;
type ThreePointerEvent = ThreeEvent<PointerEvent>;

type ThreeMouseEventHandler = (event: ThreeMouseEvent) => void;
type ThreePointerEventHandler = (event: ThreePointerEvent) => void;

export default function Experience() {
  const cubeRef = useRef<Mesh<BufferGeometry, MeshStandardMaterial>>(null!);

  const canvas = useThree((state) => state.gl.domElement);

  const { scene: model } = useGLTF('/hamburger.glb');
  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta * 0.2;
  });

  const cubeClickHandler = useCallback<ThreeMouseEventHandler>(() => {
    cubeRef.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  }, []);

  const cubeMouseEnterHandler = useCallback<ThreePointerEventHandler>(() => {
    canvas.style.cursor = 'pointer';
  }, []);

  const cubeMouseLeaveHandler = useCallback<ThreePointerEventHandler>(() => {
    canvas.style.cursor = 'default';
  }, []);

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight intensity={1.5} position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />

      <primitive
        object={model}
        position-y={1}
        scale={0.2}
        onClick={(e: ThreeMouseEvent) => {
          console.log(e.object.name);
          e.stopPropagation();
        }}
      />

      <mesh
        position-x={-2}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <Bvh>
        <mesh
          ref={cubeRef}
          position-x={2}
          raycast={meshBounds}
          scale={1.5}
          onClick={cubeClickHandler}
          onPointerEnter={cubeMouseEnterHandler}
          onPointerLeave={cubeMouseLeaveHandler}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Bvh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}

useGLTF.preload('/hamburger.glb');
