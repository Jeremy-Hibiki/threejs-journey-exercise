import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Experience from './Experience';
import './style.css';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);

root.render(
  <StrictMode>
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [4, 2, 6],
      }}
    >
      <Experience />
    </Canvas>
    <Leva theme={{ sizes: { rootWidth: '400px' } }} collapsed />
  </StrictMode>,
);
