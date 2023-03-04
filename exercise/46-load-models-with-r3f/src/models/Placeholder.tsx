import type { MeshProps } from '@react-three/fiber';

type PlaceholderProps = MeshProps;

const Placeholder = (props: PlaceholderProps) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial color="red" wireframe />
    </mesh>
  );
};

export default Placeholder;
