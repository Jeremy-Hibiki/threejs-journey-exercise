import {
  ContactShadows,
  Environment,
  Float,
  Html,
  PresentationControls,
  Text,
} from '@react-three/drei';
import MacBook from './models/MacBook';

export default function Experience() {
  return (
    <>
      <color args={['#241a1a']} attach="background" />
      {/* <OrbitControls makeDefault /> */}

      <Environment preset="city" />

      <PresentationControls
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        polar={[-0.4, 0.2]}
        rotation={[0.13, 0.1, 0]}
        snap={{ mass: 4, tension: 400 }}
        global
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            color={'#ff6900'}
            height={1.65}
            intensity={65}
            position={[0, 0.55, -1.15]}
            rotation={[0.1, Math.PI, 0]}
            width={2.5}
          />
          <MacBook position-y={-1.2}>
            <Html
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
              wrapperClass="html-screen"
              transform
            >
              <iframe src="https://bruno-simon.com/html/" />
            </Html>
          </MacBook>
          <Text
            font="bangers-v20-latin-regular.woff"
            fontSize={1}
            maxWidth={2}
            position={[2, 0.75, 0.75]}
            rotation-y={-1.25}
            textAlign="center"
          >
            BRUNO SIMON
          </Text>
        </Float>
      </PresentationControls>

      <ContactShadows blur={2.4} opacity={0.4} position-y={-1.2} scale={5} />
    </>
  );
}
