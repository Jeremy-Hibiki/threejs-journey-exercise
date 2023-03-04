import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Suspense } from 'react';
import Fox from './models/Fox';
import Hamburger from './models/Hamburger';
import Placeholder from './models/Placeholder';

const Experience = () => {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight intensity={1.5} position={[1, 2, 3]} shadow-normalBias={0.04} castShadow />
      <ambientLight intensity={0.5} />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} receiveShadow>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}>
        <Hamburger scale={0.35} />
        <Fox position={[-2.5, 0, 2.5]} rotation-y={0.3} scale={0.02} />
      </Suspense>
    </>
  );
};

export default Experience;
