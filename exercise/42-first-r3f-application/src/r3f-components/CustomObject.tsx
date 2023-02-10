import { useEffect, useMemo, useRef } from 'react';
import type { BufferGeometry } from 'three';
import { DoubleSide } from 'three';

const CustomObject = () => {
  const bufferRef = useRef<BufferGeometry>(null);

  const count = 30;
  const positions = useMemo(() => {
    const arr = new Float32Array(100 * 3);
    arr.forEach((v, idx) => {
      arr[idx] = (Math.random() - 0.5) * 3;
    });
    return arr;
  }, []);

  useEffect(() => {
    bufferRef.current?.computeVertexNormals();
  }, [bufferRef]);

  return (
    <mesh>
      <bufferGeometry ref={bufferRef}>
        <bufferAttribute
          array={positions}
          attach="attributes-position"
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={DoubleSide} />
    </mesh>
  );
};

export default CustomObject;
