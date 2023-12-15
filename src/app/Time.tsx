import React, { useCallback } from "react";
import styled from "styled-components";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp } from "../model";
import { TimeUtils, clsx } from "../util";
import { Line } from "./common";
import NowIndicator from "./NowIndicator";

const Wrapper = styled.div`
  position: relative;
`;

const Time: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  const renderTime = useCallback(() => {
    return TimeUtils.createTimes(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration).map((t, i) => {
      const currentTime: number = calendarState.dayTime.start + i * calendarState.duration;
      const time: string = TimeUtils.convertSecondsToHourString(currentTime);
      const showTime: boolean = TimeUtils.displayTime(currentTime, calendarState.dayTime.start, calendarState.duration * CONFIG.MAPPING_TIME[calendarState.duration]);
      const classname: string = clsx({
        ngt: true,
      });
      return (
        <Line data-idtf={"line"} $justify={"center"} $align={"center"} className={classname} key={i}>
          {showTime && time}
        </Line>
      );
    });
  }, [calendarState.duration, calendarState.dayTime]);

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.TIME}>
      <NowIndicator type={"PILL"} />
      {renderTime()}
    </Wrapper>
  );
};

export default Time;
