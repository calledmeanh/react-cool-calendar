import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp, TDateline } from "../model";
import { DateUtils, TimeUtils } from "../util";
import { Flex } from "./common";

const TimePill = styled(Flex)<{ $top: number }>`
  width: 100%;
  height: 20px;
  font-size: 12px;
  line-height: 12px;
  font-weight: 600;
  position: absolute;
  border-radius: 10px;
  z-index: 3;
  transform: translateY(${(props) => props.$top}px);
  -webkit-transform: translateY(${(props) => props.$top}px);
  color: ${CONFIG.CSS.NOWINDICATOR_COLORS.PRIMARY};
  background: ${CONFIG.CSS.NOWINDICATOR_COLORS.SECONDARY};
  border: 1px solid ${CONFIG.CSS.NOWINDICATOR_COLORS.PRIMARY};
`;

const TimeLine = styled.div<{ $top: number; $timelinePos?: { left: number; width: number } }>`
  pointer-events: none;
  -webkit-pointer-events: none;
  position: absolute;
  z-index: 3;
  width: ${(props) => props.$timelinePos?.width}px;
  border-bottom: 1px solid ${CONFIG.CSS.NOWINDICATOR_COLORS.PRIMARY};
  transform: translateX(${(props) => props.$timelinePos?.left}px) translateY(${(props) => props.$top}px);
  -webkit-transform: translateX(${(props) => props.$timelinePos?.left}px) translateY(${(props) => props.$top}px);
`;

type TNowIndicator = {
  type: "PILL" | "LINE";
  widthTimeline?: number;
};

const NowIndicator: React.FC<TNowIndicator> = ({ type, widthTimeline = 0 }) => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const [now, setNow] = useState({ position: 0, text: "00:00" });
  const [timelinePos, setTimelinePos] = useState({ width: 0, left: 0 });

  const getCurrentTime = useCallback(() => {
    const currentHours: number = calendarState.todayGlobalIns.hour();
    const currentMinutes: number = calendarState.todayGlobalIns.minute();
    const res: number = TimeUtils.covertHourMinuteToSeconds(currentHours, currentMinutes);

    return res;
  }, [calendarState.todayGlobalIns]);

  const checkToday = useCallback(() => {
    const res: boolean = DateUtils.isEqual(calendarState.currentDate, calendarState.todayGlobalIns);
    return res;
  }, [calendarState.currentDate, calendarState.todayGlobalIns]);

  const updateEachInterval = useCallback(
    (currentTime: number, today: boolean) => {
      if (currentTime < calendarState.dayTime.end && currentTime > calendarState.dayTime.start && today) {
        const dateEachInterval: Dayjs = dayjs();
        const hourEachInterval: number = dateEachInterval.hour();
        const minuteEachInterval: number = dateEachInterval.minute();

        const timeEachInterval: number = TimeUtils.covertHourMinuteToSeconds(hourEachInterval, minuteEachInterval);

        const position: number = TimeUtils.calcDistanceBetweenTimes(
          timeEachInterval,
          calendarState.dayTime.start,
          calendarState.duration,
          CONFIG.CSS.LINE_HEIGHT,
        );

        const text: string = TimeUtils.convertSecondsToHourString(timeEachInterval, calendarState.timeType);

        setNow({ position, text });
      } else {
        setNow({ position: 0, text: "00:00" });
      }
    },
    [calendarState.dayTime, calendarState.duration, calendarState.timeType],
  );

  /* get position of timeline */
  const getTimelineNowPos = useCallback(() => {
    const dateline: TDateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

    const todayIdx: number = dateline.findIndex((d) => DateUtils.isEqual(d.origin, calendarState.todayGlobalIns));

    if (todayIdx > -1) {
      setTimelinePos({ width: widthTimeline, left: widthTimeline * todayIdx });
    }
  }, [widthTimeline, calendarState.currentDate, calendarState.viewMode, calendarState.todayGlobalIns]);

  useEffect(() => {
    getTimelineNowPos();
  }, [getTimelineNowPos]);

  /* update now-indicator when re-render to fit the position while user is changing duration */
  useEffect(() => {
    const currentTime: number = getCurrentTime();
    const isToday: boolean = checkToday();
    updateEachInterval(currentTime, isToday);
  }, [checkToday, getCurrentTime, updateEachInterval]);

  /* after the user stop to change duration then update now-indicator with setIntervale */
  useEffect(() => {
    const currentTime: number = getCurrentTime();
    const isToday: boolean = checkToday();

    const source: NodeJS.Timeout = setInterval(() => {
      updateEachInterval(currentTime, isToday);
    }, 30000);
    return () => {
      clearInterval(source);
    };
  }, [checkToday, getCurrentTime, updateEachInterval]);

  return (
    <React.Fragment>
      {type === "PILL" && calendarState.viewMode === "DAY" && Boolean(now.position) && calendarState.nowIndicator && (
        <TimePill $align={"center"} $justify={"center"} $top={now.position}>
          {now.text}
        </TimePill>
      )}
      {type === "LINE" && Boolean(now.position) && calendarState.nowIndicator && <TimeLine $top={now.position + 9.5} $timelinePos={timelinePos}></TimeLine>}
    </React.Fragment>
  );
};

export default NowIndicator;
