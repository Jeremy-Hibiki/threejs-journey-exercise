import {
  Center,
  OrbitControls,
  shaderMaterial,
  Sparkles,
  useGLTF,
  useTexture,
} from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, DoubleSide, Mesh, ShaderMaterial, Texture } from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader';
import portalFragmentShader from './shaders/portal/portal.frag';
import portalVertexShader from './shaders/portal/portal.vert';

type PortalGLTF = GLTF & {
  nodes: {
    PoleLight1: Mesh;
    PortalLight: Mesh;
    PoleLight2: Mesh;
    Baked: Mesh;
  };
  materials: Record<string, never>;
};

type PortalMaterialProps = {
  uTime: number;
  uColorCenter: Color;
  uColorEdge: Color;
};

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorCenter: new Color('#7a4e7e'),
    uColorEdge: new Color('#f9b4cc'),
  } as PortalMaterialProps,
  portalVertexShader,
  portalFragmentShader,
  (material) => {
    material!.side = DoubleSide;
  },
);

extend({ PortalMaterial });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      portalMaterial: JSX.IntrinsicElements['shaderMaterial'] & Partial<PortalMaterialProps>;
    }
  }
}
export default function Experience() {
  const portalMaterialRef = useRef<ShaderMaterial & PortalMaterialProps>(null!);

  const bakedTexture = useTexture('/model/Baked.jpg', (texture) => {
    (texture as Texture).flipY = false;
  });

  const { nodes } = useGLTF('/model/portal-merged.glb') as PortalGLTF;

  useFrame((state, delta) => {
    portalMaterialRef.current.uTime += delta;
  });

  return (
    <>
      <color args={['#030202']} attach="background" />

      <OrbitControls makeDefault />

      <Center>
        <mesh geometry={nodes.Baked.geometry} position={nodes.Baked.position}>
          <meshBasicMaterial map={bakedTexture} />
        </mesh>
        <mesh geometry={nodes.PoleLight1.geometry} position={nodes.PoleLight1.position}>
          <meshBasicMaterial color="#7bb6ff" />
        </mesh>
        <mesh geometry={nodes.PoleLight2.geometry} position={nodes.PoleLight2.position}>
          <meshBasicMaterial color="#7bb6ff" />
        </mesh>
        <mesh geometry={nodes.PortalLight.geometry} position={nodes.PortalLight.position}>
          <portalMaterial ref={portalMaterialRef} />
        </mesh>

        <Sparkles
          color="rgb(255, 51, 51)"
          count={30}
          opacity={0.5}
          position-y={1}
          scale={[4, 2, 4]}
          size={6}
          speed={0.3}
        />
      </Center>
    </>
  );
}

useGLTF.preload('/model/portal-merged.glb');
