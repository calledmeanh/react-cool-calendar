import React, { useCallback } from "react";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp } from "../model";
import { DateUtils, clsx } from "../util";
import { Flex } from "./common";
import Dateline from "./Dateline";

const DayGrid = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  border-left: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
`;

const DayCell = styled.div`
  height: 108px;
  cursor: pointer;
  border-top: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  border-right: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  &.currMonth {
    color: #000;
    background-color: #fff;
  }
  &:hover {
    background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  }
`;

const DayText = styled.p`
  margin: 4px;
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  color: ${CONFIG.CSS.FONT_LIGHT_COLOR};
  &.today {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background-color: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
    color: #fff !important;
  }
  &.currMonth {
    color: #000;
  }
`;

const Month: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  const daysInMonth: number = calendarState.currentDate.daysInMonth();
  const startIdx: number = calendarState.currentDate.startOf("month").get("day");

  const render = useCallback(() => {
    const days: JSX.Element[] = [];

    for (let i = 1; i <= startIdx; i++) {
      const prevMonthDay: number = dayjs(calendarState.currentDate).subtract(1, "month").endOf("month").date() - startIdx + i;
      days.push(
        <DayCell key={`prev-month-${i}`}>
          <DayText>{prevMonthDay}</DayText>
        </DayCell>,
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isCurrentDay: Dayjs = calendarState.currentDate.date(i);
      const isToday: boolean = DateUtils.isEqual(isCurrentDay, calendarState.todayGlobalIns);

      const classname: string = clsx({
        today: isToday,
        currMonth: true,
      });

      days.push(
        <DayCell key={`curr-month-${i}`} className="currMonth">
          <DayText className={classname}>{i}</DayText>
        </DayCell>,
      );
    }

    const remainingDays = 7 - ((startIdx + daysInMonth) % 7);
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <DayCell key={`next-month-${i}`}>
          <DayText>{i}</DayText>
        </DayCell>,
      );
    }

    return days;
  }, [calendarState.currentDate]);

  return (
    <div data-idtf={CONFIG.DATA_IDTF.MONTH}>
      <Dateline></Dateline>
      <DayGrid>{render()}</DayGrid>
    </div>
  );
};

export default Month;
