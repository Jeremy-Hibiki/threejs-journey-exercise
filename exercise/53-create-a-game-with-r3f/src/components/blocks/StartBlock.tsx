import { Float, Text } from '@react-three/drei';
import BaseBlock, { BaseBlockProps, materials } from './BaseBlock';

export type StartBlockProps = Pick<BaseBlockProps, 'position'>;

const StartBlock = (props: StartBlockProps) => {
  return (
    <BaseBlock material={materials.floor1Material} name="StartBlock" {...props}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="/bebas-neue-v9-latin-regular.woff"
          lineHeight={0.75}
          maxWidth={0.25}
          name="StartLine"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
          scale={0.5}
          textAlign="right"
        >
          Marbal Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
    </BaseBlock>
  );
};

export default StartBlock;
