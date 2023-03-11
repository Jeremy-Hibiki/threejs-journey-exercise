import styled from '@emotion/styled';
import { useKeyboardControls } from '@react-three/drei';
import { addEffect } from '@react-three/fiber';
import cx from 'classnames';
import { useLayoutEffect, useRef } from 'react';
import { ControlsEnum } from './index';
import { useGame } from './stores';

const InterfaceContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: 'Bebas Neue', cursive;
  pointer-events: none;
`;

const Timer = styled.div`
  position: absolute;
  top: 15%;
  left: 0;
  width: 100%;
  padding-top: 5px;
  font-size: 6vh;
  color: #fff;
  text-align: center;
  background-color: #0003;
`;

const Restart = styled.div`
  position: absolute;
  top: 40%;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 10px;
  font-size: 80px;
  color: #fff;
  pointer-events: auto;
  cursor: pointer;
  background: #0003;
`;

const ControlsIndicator = styled.div`
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 100%;

  & .raw {
    display: flex;
    justify-content: center;
  }

  & .key {
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #fff4;
    border: 2px solid #fff;

    &.space-key {
      width: 144px;
    }

    &.active {
      background: #fff9;
    }
  }
`;

const Interface = () => {
  const forward = useKeyboardControls<ControlsEnum>((state) => state.FORWARD);
  const back = useKeyboardControls<ControlsEnum>((state) => state.BACK);
  const left = useKeyboardControls<ControlsEnum>((state) => state.LEFT);
  const right = useKeyboardControls<ControlsEnum>((state) => state.RIGHT);
  const jump = useKeyboardControls<ControlsEnum>((state) => state.JUMP);

  const phase = useGame((state) => state.phase);
  const restartGame = useGame((state) => state.restart);

  const timeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return addEffect(() => {
      const state = useGame.getState();
      timeRef.current!.textContent = (
        (state.phase === 'playing'
          ? Date.now() - state.startTime
          : state.phase === 'ended'
          ? state.endTime - state.startTime
          : 0) / 1000
      ).toFixed(2);
    });
  }, []);

  return (
    <InterfaceContainer>
      <Timer ref={timeRef}>0.00</Timer>

      {phase !== 'ended' ? null : <Restart onClick={restartGame}>RESTART</Restart>}

      <ControlsIndicator>
        <div className="raw">
          <div className={cx('key', { active: forward })} />
        </div>
        <div className="raw">
          <div className={cx('key', { active: left })} />
          <div className={cx('key', { active: back })} />
          <div className={cx('key', { active: right })} />
        </div>
        <div className="raw">
          <div className={cx('key', 'space-key', { active: jump })} />
        </div>
      </ControlsIndicator>
    </InterfaceContainer>
  );
};

export default Interface;
