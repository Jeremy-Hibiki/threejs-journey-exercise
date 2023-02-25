import { OrbitControls } from '@react-three/drei';
import { button, useControls } from 'leva';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const { visible: perfVisible } = useControls({
    visible: true,
  });

  const { position, color, visible } = useControls('Sphere', {
    position: {
      value: { x: -2, y: 0 },
      step: 0.01,
      joystick: 'invertY',
    },
    color: 'orange',
    visible: true,
    interval: { min: -5, max: 5, value: [-1, 1] },
    click: button(() => {
      console.log('Click!');
    }),
    choice: {
      options: ['a', 'b', 1, 2],
    },
  });

  const { scale } = useControls('Cube', {
    scale: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.01,
    },
  });

  return (
    <>
      {perfVisible && <Perf position="top-left" />}

      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight intensity={1.5} position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />

      {/* Sphere */}
      <mesh position={[position.x, position.y, 0]} visible={visible}>
        <sphereGeometry />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cube */}
      <mesh position-x={2} scale={scale}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      {/* Floor */}
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
