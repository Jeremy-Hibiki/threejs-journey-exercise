import { Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import { useMemo } from 'react';
import { AxeBlock, Level, Lights, LimboBlock, Player, SpinnerBlock } from './components';
import Effects from './components/Effects';
import { useGame } from './stores';

const Experience = () => {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  const isDebug = useMemo(
    () => new URLSearchParams(document.location.search).get('debug'),
    [document.location.search],
  );

  return (
    <>
      {isDebug !== null ? <Perf /> : null}

      <Sky inclination={0.5} />

      <Physics>
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} types={[SpinnerBlock, LimboBlock, AxeBlock]} />
        <Player />
      </Physics>

      <Effects />
    </>
  );
};

export default Experience;
