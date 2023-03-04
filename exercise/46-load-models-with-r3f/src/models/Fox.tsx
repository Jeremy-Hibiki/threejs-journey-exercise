import { useAnimations, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import type { InputOptions } from 'leva/dist/declarations/src/types';
import { useEffect, useRef } from 'react';
import type { AnimationClip, Bone, Group, MeshStandardMaterial, SkinnedMesh } from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader';

type FoxGLTF = GLTF & {
  nodes: {
    fox: SkinnedMesh;
    _rootJoint: Bone;
  };
  materials: {
    fox_material: MeshStandardMaterial;
  };
  animations: FoxGLTFActions[];
};

type FoxActionName = 'Survey' | 'Walk' | 'Run';
type FoxGLTFActions = AnimationClip & {
  name: FoxActionName;
};

type ActionSchema = {
  actionName: InputOptions & {
    options: FoxActionName[] | Record<string, FoxActionName>;
    value?: FoxActionName;
  };
};

const Fox = (props: JSX.IntrinsicElements['group']) => {
  const group = useRef<Group>(null!);
  const { nodes, materials, animations } = useGLTF('/Fox/glTF-Binary/Fox.glb') as FoxGLTF;
  const { actions, names } = useAnimations<FoxGLTFActions>(animations, group);

  const { actionName } = useControls<ActionSchema, string, ActionSchema>('Fox Animation Action', {
    actionName: { value: 'Survey' as FoxActionName, options: names, label: 'Action' },
  });

  useEffect(() => {
    actions[actionName]?.reset().fadeIn(1).play();

    return () => {
      actions[actionName]?.fadeOut(1);
    };
  }, [actionName]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group>
        <group name="root">
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            geometry={nodes.fox.geometry}
            material={materials.fox_material}
            name="fox"
            skeleton={nodes.fox.skeleton}
          />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload('/Fox/glTF-Binary/Fox.glb');

export default Fox;
