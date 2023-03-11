import { useMemo } from 'react';
import { AxeBlock, EndBlock, LimboBlock, SpinnerBlock, StartBlock } from './blocks';
import Bounds from './blocks/Bounds';

type ObstacleBlockType = typeof SpinnerBlock | typeof LimboBlock | typeof AxeBlock;

type LevelProps = {
  count?: number;
  seed?: number;
  types?: ObstacleBlockType[];
};

const Level = (props: LevelProps) => {
  const { count = 5, seed = 0, types = [SpinnerBlock, LimboBlock, AxeBlock] } = props;

  const blocks = useMemo(() => {
    const blocks = [] as ObstacleBlockType[];

    for (let i = 0; i < count; i++) {
      const typeIdx = Math.floor(Math.random() * types.length);
      blocks.push(types[typeIdx]);
    }

    return blocks;
  }, [count, seed, types]);

  return (
    <>
      <StartBlock position={[0, 0, 0]} />
      {blocks.map((Block, idx) => (
        <Block key={idx} position={[0, 0, -(idx + 1) * 4]} />
      ))}
      <EndBlock position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  );
};

export default Level;
