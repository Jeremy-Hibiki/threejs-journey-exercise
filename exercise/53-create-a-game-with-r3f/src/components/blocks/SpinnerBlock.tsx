import { useFrame } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import { Euler, Quaternion } from 'three';
import { StickObstacle } from '../obstacles';
import BaseBlock, { BaseBlockProps, materials } from './BaseBlock';

export type SpinnerBlockProps = Pick<BaseBlockProps, 'position'>;

const SpinnerBlock = (props: SpinnerBlockProps) => {
  const obstacleRef = useRef<RapierRigidBody>(null);
  const speedScale = useMemo(() => (Math.random() + 0.2) * Math.sign(Math.random() - 0.5), []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const rot = new Quaternion().setFromEuler(new Euler(0, elapsedTime * speedScale, 0));
    obstacleRef.current?.setNextKinematicRotation(rot);
  });

  return (
    <BaseBlock material={materials.floor2Material} name="AxeBlock" {...props}>
      <StickObstacle ref={obstacleRef} />
    </BaseBlock>
  );
};

export default SpinnerBlock;
