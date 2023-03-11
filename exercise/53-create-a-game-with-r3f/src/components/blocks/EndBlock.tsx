import { Text, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect } from 'react';
import BaseBlock, { BaseBlockProps, materials } from './BaseBlock';

export type EndBlockProps = Pick<BaseBlockProps, 'position'>;

const EndBlock = (props: EndBlockProps) => {
  const { scene: hamburger } = useGLTF('/hamburger.glb');

  useEffect(() => {
    hamburger.children.forEach((mesh) => {
      mesh.castShadow = true;
    });
  }, [hamburger]);

  return (
    <BaseBlock
      floorPosition={[0, 0, 0]}
      material={materials.floor1Material}
      name="EndBlock"
      {...props}
    >
      <RigidBody
        colliders="hull"
        friction={0}
        position={[0, 0.25, 0]}
        restitution={0.2}
        type="fixed"
      >
        <primitive object={hamburger} scale={0.2} />
      </RigidBody>
      <Text
        font="/bebas-neue-v9-latin-regular.woff"
        maxWidth={0.25}
        name="FinishingLine"
        position={[0, 2.25, 2]}
      >
        GOAL
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </BaseBlock>
  );
};

export default EndBlock;
