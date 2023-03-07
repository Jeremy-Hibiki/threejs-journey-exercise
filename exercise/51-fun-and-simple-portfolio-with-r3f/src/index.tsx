import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import Experience from './Experience';
import './style.pcss';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 2000,
      position: [-3, 1.5, 4],
    }}
  >
    <Experience />
  </Canvas>,
);
