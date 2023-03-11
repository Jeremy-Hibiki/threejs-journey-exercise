import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export type GameStore = {
  blocksCount: number;
  blocksSeed: number;
  phase: 'ready' | 'playing' | 'ended';
  startTime: number;
  endTime: number;
  start: () => void;
  restart: () => void;
  end: () => void;
};

const gameStore = create<GameStore>()(
  subscribeWithSelector(
    devtools((setState) => {
      return {
        blocksCount: 10,
        blocksSeed: 0,
        phase: 'ready',
        startTime: -1,
        endTime: -1,
        start() {
          setState(
            (state) =>
              state.phase === 'ready'
                ? {
                    phase: 'playing',
                    startTime: Date.now(),
                  }
                : {},
            false,
            'game/startGame',
          );
        },
        restart() {
          setState(
            (state) =>
              state.phase !== 'ready'
                ? {
                    phase: 'ready',
                    blocksSeed: Math.random(),
                    startTime: -1,
                    endTime: -1,
                  }
                : {},
            false,
            'game/restartGame',
          );
        },
        end() {
          setState(
            (state) =>
              state.phase === 'playing'
                ? {
                    phase: 'ended',
                    endTime: Date.now(),
                  }
                : {},
            false,
            'game/endGame',
          );
        },
      };
    }),
  ),
);

export default gameStore;
