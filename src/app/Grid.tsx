import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TimeUtils } from '../util';
import { clsx } from '../util';
import { Line } from './common';
import { useCalendarState } from '../hook';

const Wrapper = styled.div`
  touch-action: pan-y;
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 8px 8px;
  background-image: linear-gradient(
    45deg,
    transparent 46%,
    rgba(16, 25, 40, 0.2) 49%,
    rgba(16, 25, 40, 0.2) 51%,
    transparent 55%
  );
  background-color: #eef0f2;
  box-shadow: -2px 0px 4px 0px rgba(164, 173, 186, 0.5);
`;

const Grid: React.FC<{}> = () => {
  const calendarState = useCalendarState();

  const renderRow = useCallback(() => {
    return TimeUtils.createTimes(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration).map(
      (t, i) => {
        const currentTime: number = calendarState.dayTime.start + i * calendarState.duration;
        const workingTime: boolean = TimeUtils.checkWorkingTime(
          calendarState.dayTime,
          calendarState.workingTime,
          currentTime
        );
        const groupTime: boolean = TimeUtils.checkGroupTime(calendarState.groupTime, calendarState.duration, i, 'top');
        const classname = clsx({
          wt: workingTime,
          gt: groupTime,
        });
        return <Line data-idtf={'line'} $justify={'flex-start'} $align={'center'} className={classname} key={i}></Line>;
      }
    );
  }, [calendarState.duration, calendarState.dayTime, calendarState.workingTime, calendarState.groupTime]);

  return <Wrapper data-idtf={'grid'}>{renderRow()}</Wrapper>;
};

export default Grid;
