import { OrbitControls } from '@react-three/drei';
import { EffectComposer } from '@react-three/postprocessing';
import { useControls } from 'leva';
import { InputWithSettings, NumberSettings } from 'leva/dist/declarations/src/types';
import { BlendFunction } from 'postprocessing';
import { Perf } from 'r3f-perf';
import { useRef } from 'react';
import Drunk from './postprocessing/Drunk';
import DrunkEffect from './postprocessing/effects/DrunkEffect';

export default function Experience() {
  const ssrProps = useControls<SSRPropsSchema, string, SSRPropsSchema>('SSR Props', {
    temporalResolve: true,
    STRETCH_MISSED_RAYS: true,
    USE_MRT: true,
    USE_NORMALMAP: true,
    USE_ROUGHNESSMAP: true,
    ENABLE_JITTERING: true,
    ENABLE_BLUR: true,
    temporalResolveMix: { value: 0.9, min: 0, max: 1 },
    temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
    maxSamples: { value: 0, min: 0, max: 1 },
    resolutionScale: { value: 1, min: 0, max: 1 },
    blurMix: { value: 0.5, min: 0, max: 1 },
    blurKernelSize: { value: 8, min: 0, max: 8 },
    blurSharpness: { value: 0.5, min: 0, max: 1 },
    rayStep: { value: 0.3, min: 0, max: 1 },
    intensity: { value: 1, min: 0, max: 5 },
    maxRoughness: { value: 0.1, min: 0, max: 1 },
    jitter: { value: 0.7, min: 0, max: 5 },
    jitterSpread: { value: 0.45, min: 0, max: 1 },
    jitterRough: { value: 0.1, min: 0, max: 1 },
    roughnessFadeOut: { value: 1, min: 0, max: 1 },
    rayFadeOut: { value: 0, min: 0, max: 1 },
    MAX_STEPS: { value: 20, min: 0, max: 20 },
    NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
    maxDepthDifference: { value: 3, min: 0, max: 10 },
    maxDepth: { value: 1, min: 0, max: 1 },
    thickness: { value: 10, min: 0, max: 10 },
    ior: { value: 1.45, min: 0, max: 2 },
  });

  const drunkProps = useControls<DrunkPropsSchema, string, DrunkPropsSchema>('Drunk Props', {
    frequency: { value: 6, min: 1, max: 20, step: 0.1 },
    amplitude: { value: 0.1, min: 0, max: 1, step: 0.1 },
  });

  const drunkRef = useRef<DrunkEffect>(null);

  return (
    <>
      <color args={['white']} attach="background" />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <EffectComposer>
        {/* <Vignette blendFunction={BlendFunction.NORMAL} darkness={0.9} offset={0.3} /> */}
        {/* <Glitch delay={[0.5, 1]} duration={[0.1, 0.3]} strength={[0.2, 0.4]} /> */}
        {/* <Noise blendFunction={BlendFunction.SOFT_LIGHT} premultiply /> */}
        {/* <Bloom intensity={0.2} luminanceThreshold={0} mipmapBlur /> */}
        {/* <DepthOfField bokehScale={6} focalLength={0.025} focusDistance={0.025} /> */}
        {/* <SSR {...ssrProps} /> */}
        <Drunk ref={drunkRef} {...drunkProps} blendFunction={BlendFunction.DARKEN} />
      </EffectComposer>

      <directionalLight intensity={1.5} position={[1, 2, 3]} castShadow />
      <ambientLight intensity={0.5} />

      <mesh position-x={-2} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh position-x={2} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} receiveShadow>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" metalness={0} roughness={0} />
      </mesh>
    </>
  );
}

type SSRPropsSchema = {
  temporalResolve: boolean;
  STRETCH_MISSED_RAYS: boolean;
  USE_MRT: boolean;
  USE_NORMALMAP: boolean;
  USE_ROUGHNESSMAP: boolean;
  ENABLE_JITTERING: boolean;
  ENABLE_BLUR: boolean;
  temporalResolveMix: InputWithSettings<number, NumberSettings>;
  temporalResolveCorrectionMix: InputWithSettings<number, NumberSettings>;
  maxSamples: InputWithSettings<number, NumberSettings>;
  resolutionScale: InputWithSettings<number, NumberSettings>;
  blurMix: InputWithSettings<number, NumberSettings>;
  blurKernelSize: InputWithSettings<number, NumberSettings>;
  blurSharpness: InputWithSettings<number, NumberSettings>;
  rayStep: InputWithSettings<number, NumberSettings>;
  intensity: InputWithSettings<number, NumberSettings>;
  maxRoughness: InputWithSettings<number, NumberSettings>;
  jitter: InputWithSettings<number, NumberSettings>;
  jitterSpread: InputWithSettings<number, NumberSettings>;
  jitterRough: InputWithSettings<number, NumberSettings>;
  roughnessFadeOut: InputWithSettings<number, NumberSettings>;
  rayFadeOut: InputWithSettings<number, NumberSettings>;
  MAX_STEPS: InputWithSettings<number, NumberSettings>;
  NUM_BINARY_SEARCH_STEPS: InputWithSettings<number, NumberSettings>;
  maxDepthDifference: InputWithSettings<number, NumberSettings>;
  maxDepth: InputWithSettings<number, NumberSettings>;
  thickness: InputWithSettings<number, NumberSettings>;
  ior: InputWithSettings<number, NumberSettings>;
};

type DrunkPropsSchema = {
  frequency: InputWithSettings<number, NumberSettings>;
  amplitude: InputWithSettings<number, NumberSettings>;
};
