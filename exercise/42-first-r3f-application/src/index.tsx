import { Canvas } from '@react-three/fiber';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ACESFilmicToneMapping, sRGBEncoding } from 'three';
import Experience from './r3f-components/Experience';
import './style.css';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Canvas
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [3, 2, 1],
      }}
      gl={{
        antialias: false,
        toneMapping: ACESFilmicToneMapping,
        outputEncoding: sRGBEncoding,
      }}
    >
      <Experience />
    </Canvas>
  </React.StrictMode>,
);
