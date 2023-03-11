import { forwardRef, ReactNode } from 'react';
import { BoxGeometry, ColorManagement, Group, MeshStandardMaterial } from 'three';

ColorManagement.legacyMode = false;

export const geometry = new BoxGeometry(1, 1, 1);

export const materials = {
  floor1Material: new MeshStandardMaterial({ color: '#225', metalness: 0, roughness: 0 }),
  floor2Material: new MeshStandardMaterial({ color: '#333', metalness: 0, roughness: 0 }),
  obstacleMaterial: new MeshStandardMaterial({ color: '#f00', metalness: 0, roughness: 1 }),
  wallMaterial: new MeshStandardMaterial({ color: '#877', metalness: 0, roughness: 0 }),
};

export type BaseBlockProps = {
  position?: [number, number, number];
  floorPosition?: [number, number, number];
  material: MeshStandardMaterial;
  name?: string;
  children?: ReactNode;
};

const BaseBlock = forwardRef<Group, BaseBlockProps>((props, ref) => {
  const {
    position = [0, 0, 0],
    floorPosition = [0, -0.1, 0],
    material,
    name = 'BaseBlock',
    children,
  } = props;

  return (
    <group ref={ref} name={name} position={position}>
      <mesh
        geometry={geometry}
        material={material}
        position={floorPosition}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      {children}
    </group>
  );
});

export default BaseBlock;
