import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DateUtils, TimeUtils } from '../util';
import { clsx } from '../util';
import { Line } from './common';
import { useCalendarState } from '../hook';
import NowIndicator from './NowIndicator';

const Wrapper = styled.div`
  touch-action: pan-y;
  position: relative;
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

const Grid: React.FC<{ parentWidth: number }> = ({ parentWidth }) => {
  const calendarState = useCalendarState();
  const [timelinePos, setTimelinePos] = useState({ left: 0, width: 0 });

  const getTimelinePos = useCallback(() => {
    const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
    const widthTimeline = parentWidth / dateline.length - 1; // 1 is border width

    const today = calendarState.todayGlobalIns.format(calendarState.dateFormat);
    const todayIdx = dateline.findIndex((d) => d.date === today);

    if (todayIdx > -1) {
      setTimelinePos({ left: widthTimeline * todayIdx, width: widthTimeline });
    }
  }, [
    parentWidth,
    calendarState.currentDate,
    calendarState.viewMode,
    calendarState.dateFormat,
    calendarState.todayGlobalIns,
  ]);

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

  useEffect(() => {
    getTimelinePos();
  }, [getTimelinePos]);

  return (
    <Wrapper data-idtf={'grid'}>
      <NowIndicator type={'LINE'} timelinePos={timelinePos} />
      {renderRow()}
    </Wrapper>
  );
};

export default Grid;
