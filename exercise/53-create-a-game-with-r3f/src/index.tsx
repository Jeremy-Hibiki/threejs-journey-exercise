import { css, Global } from '@emotion/react';
import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Experience from './Experience';
import Interface from './Interface';

export enum ControlsEnum {
  FORWARD = 'FORWARD',
  BACK = 'BACK',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  JUMP = 'JUMP',
}

const root = createRoot(document.querySelector('#root') as HTMLElement);

root.render(
  <StrictMode>
    <Global
      styles={css`
        html,
        body,
        #root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ivory;
        }

        /* bebas-neue-regular - latin */
        @font-face {
          font-family: 'Bebas Neue';
          font-style: normal;
          font-weight: 400;
          src: url('/bebas-neue-v9-latin-regular.woff') format('woff'); /* Chrome 5+, Firefox 3.6+, IE 9+, Safari 5.1+ */
          font-display: swap;
        }
      `}
    />
    <KeyboardControls
      map={[
        { name: ControlsEnum.FORWARD, keys: ['ArrowUp', 'KeyW'] },
        { name: ControlsEnum.BACK, keys: ['ArrowDown', 'KeyS'] },
        { name: ControlsEnum.LEFT, keys: ['ArrowLeft', 'KeyA'] },
        { name: ControlsEnum.RIGHT, keys: ['ArrowRight', 'KeyD'] },
        { name: ControlsEnum.JUMP, keys: ['Space'] },
      ]}
    >
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2.5, 4, 6],
        }}
        shadows
      >
        <Experience />
      </Canvas>
      <Interface />
    </KeyboardControls>
  </StrictMode>,
);
