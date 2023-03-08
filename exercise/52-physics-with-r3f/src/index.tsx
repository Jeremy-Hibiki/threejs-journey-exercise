import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import Experience from './Experience';
import './style.css';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [4, 2, 6],
    }}
    shadows
  >
    <Experience />
  </Canvas>,
);
