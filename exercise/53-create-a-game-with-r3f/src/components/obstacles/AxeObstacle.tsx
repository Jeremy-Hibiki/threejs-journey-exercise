import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { forwardRef } from 'react';
import { geometry, materials } from '../blocks';

const AxeObstacle = forwardRef<RapierRigidBody>((props, ref) => {
  return (
    <RigidBody
      ref={ref}
      friction={0}
      position={[0, 0.3, 0]}
      restitution={0.2}
      type="kinematicPosition"
    >
      <mesh
        geometry={geometry}
        material={materials.obstacleMaterial}
        scale={[1.5, 1.5, 0.3]}
        castShadow
      />
    </RigidBody>
  );
});

export default AxeObstacle;
