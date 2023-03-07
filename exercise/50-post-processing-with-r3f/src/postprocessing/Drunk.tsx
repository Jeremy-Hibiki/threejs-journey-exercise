import { forwardRef } from 'react';
import DrunkEffect, { DrunkProps } from './effects/DrunkEffect';

const Drunk = forwardRef<DrunkEffect, DrunkProps>((props, ref) => {
  const effect = new DrunkEffect(props);

  return <primitive ref={ref} object={effect} />;
});

export default Drunk;
