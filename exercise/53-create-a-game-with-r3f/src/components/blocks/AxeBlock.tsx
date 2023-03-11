import { useFrame } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { AxeObstacle } from '../obstacles';
import BaseBlock, { BaseBlockProps, materials } from './BaseBlock';

export type AxeBlockProps = Pick<BaseBlockProps, 'position'>;

const AxeBlock = (props: AxeBlockProps) => {
  const { position = [0, 0, 0] } = props;

  const obstacleRef = useRef<RapierRigidBody>(null);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const [x, y, z] = position;
    const offsetX = Math.sin(elapsedTime + timeOffset) * 1.25;
    obstacleRef.current?.setNextKinematicTranslation(new Vector3(x + offsetX, y + 0.75, z));
  });

  return (
    <BaseBlock material={materials.floor2Material} name="AxeBlock" {...props}>
      <AxeObstacle ref={obstacleRef} />
    </BaseBlock>
  );
};

export default AxeBlock;
