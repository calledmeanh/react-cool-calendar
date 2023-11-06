import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Line } from './common';
import { TimeUtils } from '../util';
import { CONFIG } from '../constant';
import { clsx } from '../util';
import { useCalendarState } from '../hook';
import NowIndicator from './NowIndicator';

const Wrapper = styled.div`
  position: relative;
`;

const Time: React.FC = () => {
  const calendarState = useCalendarState();

  const renderTime = useCallback(() => {
    return TimeUtils.createTimes(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration).map(
      (t, i) => {
        const currentTime: number = calendarState.dayTime.start + i * calendarState.duration;
        const time: string = TimeUtils.convertSecondsToHourString(currentTime);
        const showTime: boolean = TimeUtils.displayTime(
          currentTime,
          calendarState.dayTime.start,
          calendarState.duration * CONFIG.MAPPING_TIME[calendarState.duration]
        );
        const classname = clsx({
          ngt: true,
        });
        return (
          <Line data-idtf={'line'} $justify={'center'} $align={'center'} className={classname} key={i}>
            {showTime && time}
          </Line>
        );
      }
    );
  }, [calendarState.duration, calendarState.dayTime]);

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.TIME}>
      <NowIndicator type={'PILL'} />
      {renderTime()}
    </Wrapper>
  );
};

export default Time;
