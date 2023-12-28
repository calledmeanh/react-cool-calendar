import React, { useCallback } from "react";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp } from "../model";
import { Flex } from "./common";
import Dateline from "./Dateline";

const DayGrid = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayCell = styled.div<{ $isCurrentMonth: boolean }>`
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  color: ${(props) => (props.$isCurrentMonth ? "#000" : CONFIG.CSS.FONT_LIGHT_COLOR)};
  border: 1px solid ${CONFIG.CSS.GRAY_THIRD_COLOR};
  text-align: center;
  line-height: 108px;
  height: 108px;
  cursor: pointer;
  &:hover {
    background-color: ${CONFIG.CSS.HIGHLIGHT_SECONDARY_COLOR};
  }
`;

const Month: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  const daysInMonth: number = calendarState.currentDate.daysInMonth();
  const startIdx: number = calendarState.currentDate.startOf("month").get("day");

  const render = useCallback(() => {
    const days: JSX.Element[] = [];

    for (let i = 1; i <= startIdx; i++) {
      const prevMonthDay = dayjs(calendarState.currentDate).subtract(1, "month").endOf("month").date() - startIdx + i;
      days.push(
        <DayCell key={`prev-month-${i}`} $isCurrentMonth={false}>
          {prevMonthDay}
        </DayCell>,
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <DayCell key={i} $isCurrentMonth={true}>
          {i}
        </DayCell>,
      );
    }

    const remainingDays = 7 - ((startIdx + daysInMonth) % 7);
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <DayCell key={`empty-end-${i}`} $isCurrentMonth={false}>
          {i}
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
