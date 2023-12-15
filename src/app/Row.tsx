import React, { useCallback } from "react";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp } from "../model";
import { TimeUtils, clsx } from "../util";
import { Line } from "./common";

const Row: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  const renderRow = useCallback(() => {
    return TimeUtils.createTimes(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration).map((t, i) => {
      const currentTime: number = calendarState.dayTime.start + i * calendarState.duration;
      const workingTime: boolean = TimeUtils.checkWorkingTime(calendarState.dayTime, calendarState.workingTime, currentTime);
      const groupTime: boolean = TimeUtils.checkGroupTime(calendarState.groupTime, calendarState.duration, i, "top");
      const classname: string = clsx({
        wt: workingTime,
        gt: groupTime,
      });
      return <Line data-idtf={"line"} className={classname} key={i}></Line>;
    });
  }, [calendarState.duration, calendarState.dayTime, calendarState.workingTime, calendarState.groupTime]);

  return <div data-idtf={CONFIG.DATA_IDTF.ROW}>{renderRow()}</div>;
};

export default Row;
