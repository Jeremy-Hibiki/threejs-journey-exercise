import { useGLTF } from '@react-three/drei';
import type { Mesh, MeshStandardMaterial } from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader';

type HamburgerGLTF = GLTF & {
  nodes: {
    cheese: Mesh;
    topBun: Mesh;
    meat: Mesh;
    bottomBun: Mesh;
  };
  materials: {
    CheeseMaterial: MeshStandardMaterial;
    BunMaterial: MeshStandardMaterial;
    SteakMaterial: MeshStandardMaterial;
  };
};

const Hamburger = (props: JSX.IntrinsicElements['group']) => {
  const { nodes, materials } = useGLTF('/hamburger.glb') as HamburgerGLTF;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.topBun.geometry}
        material={materials.BunMaterial}
        position={[0, 1.77, 0]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.cheese.geometry}
        material={materials.CheeseMaterial}
        position={[0, 3.04, 0]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.meat.geometry}
        material={materials.SteakMaterial}
        position={[0, 2.82, 0]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.bottomBun.geometry}
        material={materials.BunMaterial}
        castShadow
        receiveShadow
      />
    </group>
  );
};

useGLTF.preload('/hamburger.glb');

export default Hamburger;
