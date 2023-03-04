import { OrbitControls, Stage, useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import type {
  InputWithSettings,
  NumberSettings,
  Vector3dArray,
} from 'leva/dist/declarations/src/types';
import { Perf } from 'r3f-perf';
import { useRef } from 'react';
import type { DirectionalLight, Mesh } from 'three';
import { DirectionalLightHelper } from 'three';

/*
 * @deprecated
 */
// softShadows({
//   frustum: 3.75,
//   size: 0.005,
//   near: 9.5,
//   samples: 17,
//   rings: 11,
// });

type ContactShadowsSchema = {
  color: string;
  opacity: InputWithSettings<number, NumberSettings>;
  blur: InputWithSettings<number, NumberSettings>;
};

type SkySchema = {
  sunPosition: { value: Vector3dArray };
};

type EnvSchema = {
  envMapIntensity: InputWithSettings<number, NumberSettings>;
  envMapHeight: InputWithSettings<number, NumberSettings>;
  envMapRadius: InputWithSettings<number, NumberSettings>;
  envMapScale: InputWithSettings<number, NumberSettings>;
};

export default function Experience() {
  const cube = useRef<Mesh>(null!);
  const directionLight = useRef<DirectionalLight>(null!);

  useFrame(({ clock }, delta) => {
    // const elapsedTime = clock.getElapsedTime();
    // cube.current!.position.x = 2 + Math.sin(elapsedTime);
    cube.current!.rotation.y += delta * 0.2;
  });

  useHelper(directionLight, DirectionalLightHelper, 1, 'red');

  const contactShadowParams = useControls<ContactShadowsSchema, string, ContactShadowsSchema>(
    'Contact Shadow',
    {
      color: '#4b2709',
      opacity: { value: 0.4, min: 0, max: 1, step: 0.1 },
      blur: { value: 2.8, min: 0, max: 10, step: 0.1 },
    },
  );

  const skyParams = useControls<SkySchema, string, SkySchema>('Sky', {
    sunPosition: { value: [1, 2, 3] },
  });

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls<
    EnvSchema,
    string,
    EnvSchema
  >('Environment', {
    envMapIntensity: { value: 7, min: 0, max: 12, step: 0.1 },
    envMapHeight: { value: 7, min: 0, max: 100, step: 1 },
    envMapRadius: { value: 28, min: 10, max: 1000, step: 1 },
    envMapScale: { value: 100, min: 10, max: 1000, step: 1 },
  });

  return (
    <>
      <color args={['ivory']} attach="background" />
      {/* <Environment
        files={[
          '/environmentMaps/3/px.jpg',
          '/environmentMaps/3/nx.jpg',
          '/environmentMaps/3/py.jpg',
          '/environmentMaps/3/ny.jpg',
          '/environmentMaps/3/pz.jpg',
          '/environmentMaps/3/nz.jpg',
        ]}
        background
      /> */}
      {/*  <Environment
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }}
        preset="sunset"
        resolution={32}
        // background
      >
        <color args={['cyan']} attach="background" />
        <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh>
        <Lightformer color="red" form="ring" intensity={10} position-z={-5} scale={10} />
      </Environment> */}

      <Perf position="top-left" />
      <OrbitControls makeDefault />

      {/* <BakeShadows /> */}

      {/* @ts-ignore */}
      {/* <SoftShadows frustum={3.75} near={9.5} rings={11} samples={17} size={0.005} /> */}

      {/* <AccumulativeShadows
        blend={100}
        color={'#316d39'}
        frames={Infinity}
        opacity={0.8}
        position={[0, -0.999, 0]}
        scale={10}
        temporal
      >
        <RandomizedLight
          ambient={0.5}
          amount={8}
          bias={0.001}
          intensity={1}
          position={[1, 2, 3]}
          radius={1}
        />
      </AccumulativeShadows> */}

      {/* <ContactShadows
        far={4}
        frames={1}
        position={[0, 0.001, 0]}
        resolution={512}
        scale={10}
        {...contactShadowParams}
      /> */}

      {/* Lights */}
      {/* <directionalLight
        ref={directionLight}
        intensity={1.5}
        position={skyParams.sunPosition}
        shadow-mapSize={[1024, 1024]}
        castShadow
      >
        <orthographicCamera args={[-5, 5, 5, -5, 1, 10]} attach="shadow-camera" />
      </directionalLight>
      <ambientLight intensity={0.5} /> */}
      {/* <Sky {...skyParams} /> */}

      {/* Sphere */}
      {/* <mesh position-x={-2} position-y={1} castShadow>
        <sphereGeometry />
        <meshStandardMaterial
          color="orange"
          envMapIntensity={envMapIntensity}
          metalness={0.6}
          roughness={0.5}
        />
      </mesh> */}

      {/* Cube */}
      {/* <mesh ref={cube} position-x={2} position-y={1} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial
          color="mediumpurple"
          envMapIntensity={envMapIntensity}
          metalness={0.6}
          roughness={0.5}
        />
      </mesh> */}

      {/* Floor */}
      {/* <mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" envMapIntensity={envMapIntensity} />
      </mesh> */}

      <Stage
        environment={{ preset: 'sunset', background: true }}
        intensity={2}
        preset="portrait"
        shadows={{
          type: 'contact',
          ...contactShadowParams,
        }}
      >
        <mesh position-x={-2} position-y={1} castShadow>
          <sphereGeometry />
          <meshStandardMaterial
            color="orange"
            envMapIntensity={envMapIntensity}
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
        <mesh ref={cube} position-x={2} position-y={1} scale={1.5} castShadow>
          <boxGeometry />
          <meshStandardMaterial
            color="mediumpurple"
            envMapIntensity={envMapIntensity}
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
      </Stage>
    </>
  );
}
