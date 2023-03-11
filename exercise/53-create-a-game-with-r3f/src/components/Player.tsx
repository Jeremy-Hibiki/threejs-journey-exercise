import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { ControlsEnum } from '../index';
import { useGame } from '../stores';

const Player = () => {
  const playerRef = useRef<RapierRigidBody>(null!);
  const [subscribeKeys, getKeys] = useKeyboardControls<ControlsEnum>();

  const phase = useGame((state) => state.phase);
  const startGame = useGame((state) => state.start);
  const endGame = useGame((state) => state.end);
  const restartGame = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  // Change game phase
  useEffect(
    () =>
      subscribeKeys(() => {
        if (phase === 'ready') {
          startGame();
        }
      }),
    [phase],
  );

  // Handle jumps
  const { rapier, world } = useRapier();
  const rapierWorld = useMemo(world.raw, [world]);
  const jump = useCallback(() => {
    const origin = playerRef.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);

    if ((hit?.toi ?? 10) < 0.15) playerRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, false);
  }, []);

  // Listen to SPACE
  useEffect(
    () =>
      subscribeKeys(
        (state) => state.JUMP,
        (state) => {
          if (state) jump();
        },
      ),
    [],
  );

  // Listen to W/A/S/D
  useFrame((state, delta) => {
    const { FORWARD, BACK, LEFT, RIGHT } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (FORWARD) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (BACK) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (LEFT) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (RIGHT) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    playerRef.current.applyImpulse(impulse, false);
    playerRef.current.applyTorqueImpulse(torque, false);
  });

  // Animate the camera
  const smoothCameraPosition = useRef(new Vector3(5, 5, 5));
  const smoothCameraTarget = useRef(new Vector3());

  useFrame(({ camera }, delta) => {
    const playerPosition = playerRef.current.translation();
    const cameraPosition = new Vector3().copy(playerPosition as any);
    const cameraTarget = new Vector3().copy(cameraPosition);

    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;
    cameraTarget.y += 0.25;

    smoothCameraPosition.current.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.current.lerp(cameraTarget, 5 * delta);

    camera.position.copy(smoothCameraPosition.current);
    camera.lookAt(smoothCameraTarget.current);
  });

  // Test if player reaches finishing line
  // or falls out the world
  const reset = useCallback(() => {
    playerRef.current.setTranslation({ x: 0, y: 1, z: 0 }, false);
    playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, false);
    playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, false);
  }, [playerRef]);

  useEffect(
    () =>
      useGame.subscribe(
        (state) => state.phase,
        (phase) => {
          if (phase === 'ready') {
            reset();
          }
        },
      ),
    [useGame],
  );

  useFrame(() => {
    const playerPosition = playerRef.current.translation();
    if (playerPosition.z < -blocksCount * 4 - 2 && phase === 'playing') {
      endGame();
    }
    if (playerPosition.y < -4) {
      restartGame();
    }
  });

  return (
    <RigidBody
      ref={playerRef}
      angularDamping={0.5}
      colliders="ball"
      friction={1}
      linearDamping={0.5}
      name="Player"
      position={[0, 1, 0]}
      restitution={0.2}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="mediumpurple" flatShading />
      </mesh>
    </RigidBody>
  );
};

export default Player;
