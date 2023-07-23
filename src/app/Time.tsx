import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Flex, Line } from './common';
import { TimeUtils } from '../util';
import { CONFIG } from '../constant';
import { clsx } from '../util';
import { useCalendar } from '../hook';

const Wrapper = styled(Flex)`
  width: 48px;
  height: max-content;
  padding-top: 60px;
  border-right: 1px solid #d5d7da;
`;

const Time: React.FC<{}> = () => {
  const calendarState = useCalendar();

  const renderTime = useCallback(() => {
    return TimeUtils.createTimes(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration).map(
      (t, i) => {
        const currentTime: number = calendarState.dayTime.start + i * calendarState.duration;
        const time: string = TimeUtils.convertSecondsToHourString(currentTime);
        const showTime: boolean = TimeUtils.displayTime(
          currentTime,
          calendarState.dayTime.start,
          calendarState.duration * CONFIG.MAPPING_TIME[900]
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
    <Wrapper data-idtf={'time'} $dir={'column'}>
      {renderTime()}
    </Wrapper>
  );
};

export default Time;
