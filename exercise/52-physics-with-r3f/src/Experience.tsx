import { OrbitControls, useGLTF } from '@react-three/drei';
import { MeshProps, useFrame } from '@react-three/fiber';
import {
  CuboidCollider,
  CylinderCollider,
  InstancedRigidBodies,
  InstancedRigidBodyProps,
  Physics,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { RigidBodyProps } from '@react-three/rapier/dist/declarations/src/components/RigidBody';
import { Perf } from 'r3f-perf';
import { useMemo, useRef } from 'react';
import { Euler, InstancedMesh, Quaternion } from 'three';

export default function Experience() {
  const CUBE_COUNT = 1000;

  const cubeRef = useRef<RapierRigidBody>(null!);
  const twisterRef = useRef<RapierRigidBody>(null!);
  const cubesRef = useRef<InstancedMesh>(null!);

  const hitSound = useMemo(() => new Audio('/hit.mp3'), []);

  const { scene: hamburger } = useGLTF('/hamburger.glb');

  const cubeClickHandler: MeshProps['onClick'] = () => {
    const mess = cubeRef.current.mass();
    cubeRef.current.applyImpulse({ x: 0, y: 5 * mess, z: 0 }, true);
    cubeRef.current.applyTorqueImpulse(
      { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 },
      true,
    );
  };

  const cubeCollisionHandler: RigidBodyProps['onCollisionEnter'] = () => {
    hitSound.currentTime = 0;
    hitSound.volume = Math.random();
    hitSound.play();
  };

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const rot = new Quaternion().setFromEuler(new Euler(0, elapsedTime * 3, 0), true);
    twisterRef.current.setNextKinematicRotation(rot);
    const angle = elapsedTime * 0.5;
    twisterRef.current.setNextKinematicTranslation({
      x: Math.cos(angle),
      y: -0.8,
      z: Math.sin(angle),
    });
  });

  const cubesTransforms = useMemo(() => {
    return Array.from({ length: CUBE_COUNT }).map<InstancedRigidBodyProps>((_, i) => {
      const scale = Math.random() * 0.8 + 0.2;
      return {
        key: i,
        position: [(Math.random() - 0.5) * 8, 6 + i * 0.2, (Math.random() - 0.5) * 8],
        rotation: [Math.random(), Math.random(), Math.random()],
        scale: [scale, scale, scale],
      };
    });
  }, []);

  console.log(cubesRef.current);

  // useLayoutEffect(() => {
  //   for (let i = 0; i < CUBE_COUNT; i++) {
  //     const matrix = new Matrix4().compose(
  //       new Vector3(i * 2, 0, 0),
  //       new Quaternion(),
  //       new Vector3(1, 1, 1),
  //     );
  //     cubesRef.current.setMatrixAt(i, matrix);
  //   }
  // }, []);

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight intensity={1.5} position={[1, 2, 3]} castShadow />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.8, 0]}>
        {/* <Debug /> */}

        {/* Sphere */}
        <RigidBody colliders="ball" position={[-1.5, 2, 0]}>
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        {/* Donut */}
        {/* <RigidBody colliders={false} position={[0, 1, 0]} rotation={[Math.PI * 0.5, 0, 0]}> */}
        {/*   <RoundCuboidCollider args={[1.5, 1.5, 0, 0.5]} /> */}
        {/*   <CuboidCollider */}
        {/*     args={[0.25, 1, 0.25]} */}
        {/*     position={[0, 0, 1]} */}
        {/*     rotation={[-Math.PI * 0.35, 0, 0]} */}
        {/*   /> */}
        {/*   <BallCollider args={[1.5]} /> */}
        {/*   <mesh> */}
        {/*     <torusGeometry args={[1, 0.5, 16, 32]} /> */}
        {/*     <meshStandardMaterial color="pink" /> */}
        {/*   </mesh> */}
        {/* </RigidBody> */}

        {/* Cube */}
        <RigidBody
          ref={cubeRef}
          colliders={false}
          position={[1.5, 2, 0]}
          restitution={0.5}
          onCollisionEnter={cubeCollisionHandler}
          onSleep={() => {
            // console.log('Cube sleeping');
          }}
          onWake={() => {
            // console.log('Cube waked up');
          }}
        >
          <CuboidCollider args={[0.5, 0.5, 0.5]} mass={100} />
          <mesh castShadow onClick={cubeClickHandler}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        {/* Hamburger */}
        <RigidBody colliders={false} position={[0, 4, 0]}>
          <CylinderCollider args={[0.5, 1.25]} />
          <primitive object={hamburger} scale={0.25} />
        </RigidBody>

        {/* Twister */}
        <RigidBody ref={twisterRef} friction={0} position={[0, -0.8, 0]} type="kinematicPosition">
          <mesh scale={[0.4, 0.4, 3]} castShadow>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        {/* Floor */}
        <RigidBody type="fixed">
          <mesh position-y={-1.25} receiveShadow>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        {/* Walls */}
        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>

        {/* Meshes. Lots of meshes. */}
        <InstancedRigidBodies instances={cubesTransforms}>
          <instancedMesh
            ref={cubesRef}
            args={[undefined, undefined, CUBE_COUNT]}
            castShadow
            receiveShadow
          >
            <boxGeometry />
            <meshStandardMaterial color="aqua" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
}
