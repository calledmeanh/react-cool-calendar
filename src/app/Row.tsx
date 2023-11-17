import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CONFIG } from '../constant';
import { useCalendarState } from '../hook';
import { TimeUtils, clsx } from '../util';
import { Line } from './common';

const Wrapper = styled.div``;

const Row: React.FC = () => {
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
        return <Line data-idtf={'line'} className={classname} key={i}></Line>;
      }
    );
  }, [calendarState.duration, calendarState.dayTime, calendarState.workingTime, calendarState.groupTime]);

  return <Wrapper data-idtf={CONFIG.DATA_IDTF.ROW}>{renderRow()}</Wrapper>;
};

export default Row;
