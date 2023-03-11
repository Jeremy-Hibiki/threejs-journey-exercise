import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { geometry, materials } from './index';

export type BoundsProps = {
  length?: number;
};

const Bounds = (props: BoundsProps) => {
  const { length = 1 } = props;

  return (
    <>
      <RigidBody friction={0} name="Bounds" restitution={0.2} type="fixed">
        {/* Right Wall */}
        <mesh
          geometry={geometry}
          material={materials.wallMaterial}
          position={[2.15, 0.65, -length * 2 + 2]}
          scale={[0.3, 1.7, length * 4]}
          castShadow
        />
        {/* Left Wall */}
        <mesh
          geometry={geometry}
          material={materials.wallMaterial}
          position={[-2.15, 0.65, -length * 2 + 2]}
          scale={[0.3, 1.7, length * 4]}
          receiveShadow
        />
        {/* Finishing Line Wall */}
        <mesh
          geometry={geometry}
          material={materials.wallMaterial}
          position={[0, 0.65, -length * 4 + 1.85]}
          scale={[4.6, 1.7, 0.3]}
          receiveShadow
        />
        {/* Dummy Floor */}
        <CuboidCollider
          args={[2, 0.1, length * 2]}
          friction={1}
          position={[0, -0.1, -length * 2 + 2]}
          restitution={0.2}
        />
        {/* Dummy Ceiling */}
        <CuboidCollider
          args={[2, 0.1, length * 2]}
          friction={1}
          position={[0, 2, -length * 2 + 2]}
          restitution={0.2}
        />
      </RigidBody>
    </>
  );
};

export default Bounds;
