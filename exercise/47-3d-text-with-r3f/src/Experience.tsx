import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Mesh, MeshMatcapMaterial, sRGBEncoding, TorusGeometry } from 'three';

export default function Experience() {
  const [donutMatcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

  const [donutGeometry] = useState(new TorusGeometry(1, 0.6, 16, 32));
  const commonMaterial = useMemo(() => new MeshMatcapMaterial({ matcap: donutMatcapTexture }), []);

  const donutsRef = useRef<Mesh[]>([]);

  useEffect(() => {
    donutMatcapTexture.encoding = sRGBEncoding;
    donutMatcapTexture.needsUpdate = true;
  }, []);

  useFrame((s, delta) => {
    donutsRef.current.forEach((donut) => {
      donut.rotation.y += delta * 0.2 * donut.userData.rotateSpeed;
    });
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <Center>
        <Text3D
          bevelOffset={0}
          bevelSegments={5}
          bevelSize={0.02}
          bevelThickness={0.02}
          curveSegments={12}
          font="/fonts/inter/Inter_Regular.json"
          height={0.2}
          material={commonMaterial}
          scale={2}
          size={0.75}
          bevelEnabled
        >
          Hello R3F
        </Text3D>
      </Center>

      {Array(100)
        .fill(undefined)
        .map((_, idx) => (
          <mesh
            key={`donut${idx}`}
            ref={(instance: Mesh) => {
              donutsRef.current[idx] = instance;
            }}
            geometry={donutGeometry}
            material={commonMaterial}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            scale={Math.random() * 0.2 + 0.1}
            userData={{
              rotateSpeed: Math.random() * 5,
            }}
          />
        ))}
    </>
  );
}
