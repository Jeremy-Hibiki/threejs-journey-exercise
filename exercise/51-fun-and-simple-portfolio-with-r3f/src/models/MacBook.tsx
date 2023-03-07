import { useGLTF } from '@react-three/drei';
import { forwardRef } from 'react';
import { Group } from 'three';

const MacBook = forwardRef<Group, JSX.IntrinsicElements['group']>((props, ref) => {
  const { scene } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf',
  );

  return <primitive ref={ref} object={scene} {...props} dispose={null} />;
});

export default MacBook;

useGLTF.preload(
  'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf',
);
