import { useFrame } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { StickObstacle } from '../obstacles';
import BaseBlock, { BaseBlockProps, materials } from './BaseBlock';

export type LimboBlockProps = Pick<BaseBlockProps, 'position'>;

const LimboBlock = (props: LimboBlockProps) => {
  const { position = [0, 0, 0] } = props;

  const obstacleRef = useRef<RapierRigidBody>(null);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const [x, , z] = position;
    const y = Math.sin(elapsedTime + timeOffset) + 1.15;
    obstacleRef.current?.setNextKinematicTranslation(new Vector3(x, y, z));
  });

  return (
    <BaseBlock material={materials.floor2Material} name="LimboBlock" {...props}>
      <StickObstacle ref={obstacleRef} />
    </BaseBlock>
  );
};

export default LimboBlock;
