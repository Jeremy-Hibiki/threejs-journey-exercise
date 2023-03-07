/**
 * Fix wrong typing for `Vector2` like props
 */

import { Vector2 } from '@react-three/fiber';
import { GlitchEffect, GlitchMode } from 'postprocessing';
import React from 'react';
import { O } from 'ts-toolbelt';

declare module '@react-three/postprocessing' {
  type GlitchProps = O.Merge<
    ConstructorParameters<typeof GlitchEffect>[0],
    Partial<{
      mode: (typeof GlitchMode)[keyof typeof GlitchMode];
      active: boolean;
      delay: Vector2;
      duration: Vector2;
      chromaticAberrationOffset: Vector2;
      strength: Vector2;
    }>
  >;
  const Glitch: React.ForwardRefExoticComponent<GlitchProps & React.RefAttributes<GlitchEffect>>;
}
