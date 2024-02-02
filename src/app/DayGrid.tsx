import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Dayjs } from "dayjs";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TAppointmentForUser, TCalendarStateForApp } from "../model";
import { DateUtils, clsx } from "../util";
import { Flex } from "./common";
import ApptRectangle from "./ApptRectangle";

const Wrapper = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid black;
  position: relative;
  height: calc(100% - 60px); // 60px is height of dateline
  border-left: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  border-bottom: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
`;

const DayCell = styled.div`
  cursor: pointer;
  overflow-y: hidden;
  background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  border-top: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  border-right: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  &.currMonth {
    color: #000;
    background-color: #fff;
  }
`;

const DayNumber = styled.p`
  margin: 4px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: ${CONFIG.CSS.FONT_LIGHT_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  &.today {
    text-align: center;
    border-radius: 50%;
    color: #fff !important;
    background-color: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
  }
  &.currMonth {
    color: #000;
  }
`;

const EventLeft = styled(Flex)`
  height: calc(100% / 5);
  border-radius: 4px;
  padding: 0 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding-left: 6px;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  &:hover {
    background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  }
`;

type TDayGrid = {
  onShowMoreEvent: (dateInMonth: Dayjs, apptByDay: TAppointmentForUser[]) => void;
};

const DayGrid: React.FC<TDayGrid> = ({ onShowMoreEvent }) => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [dayGridHeight, setDayGridHeight] = useState<number>(0);

  const dayGridRef: React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const firstDayOfMonth: Dayjs = calendarState.currentDate.startOf("month");
  const prevMonth: Dayjs = firstDayOfMonth.subtract(1, "month");
  const nextMonth: Dayjs = firstDayOfMonth.add(1, "month");

  const daysInMonth: number = firstDayOfMonth.daysInMonth();
  const daysInPrevMonth: number = prevMonth.daysInMonth();

  const prevMonthRemainingDays: number = firstDayOfMonth.get("day"); // first day of month, get index of that day in week
  const nearestEndOfMonth: number = daysInPrevMonth - prevMonthRemainingDays;

  const nextMonthRemainingDays: number = 7 - ((prevMonthRemainingDays + daysInMonth) % 7);
  const rows: number = prevMonthRemainingDays >= 4 && nextMonthRemainingDays >= 4 ? 6 : 5;

  const pushDays = useCallback(
    (remainingDays: number, month: Dayjs, dayNumber: number, prefix: string) => {
      const days: JSX.Element[] = [];

      for (let i = 1; i <= remainingDays; i++) {
        const dateInMonth: Dayjs = month.date(dayNumber + i);
        const isToday: boolean = DateUtils.isEqual(dateInMonth, calendarState.todayGlobalIns);

        const classname: string = clsx({
          today: isToday,
          currMonth: remainingDays > 15,
        });

        const apptByDay: TAppointmentForUser[] = calendarState.appointments.filter((appt) => DateUtils.isEqual(dateInMonth, appt.createdAt));
        const apptLeft: number = apptByDay.length - 2;

        days.push(
          <DayCell key={`${prefix}-month-${i}`} className={classname} style={{ height: dayGridHeight / rows }}>
            <DayNumber className={classname}>{dateInMonth.format("DD")}</DayNumber>
            {apptByDay.slice(0, 2).map((a) => (
              <ApptRectangle key={a.id} value={a} mouseCoords={mouseCoords} />
            ))}
            {apptByDay.length > 2 && (
              <EventLeft $align={"center"} onClick={() => onShowMoreEvent(dateInMonth, apptByDay)}>
                {apptLeft} {apptLeft >= 2 ? "events" : "event"} left
              </EventLeft>
            )}
          </DayCell>,
        );
      }

      return days;
    },
    [calendarState.todayGlobalIns, calendarState.appointments, mouseCoords, dayGridHeight, rows, onShowMoreEvent],
  );

  const render = useCallback(() => {
    const days: JSX.Element[] = [];

    days.push(...pushDays(prevMonthRemainingDays, prevMonth, nearestEndOfMonth, "prev"));
    days.push(...pushDays(daysInMonth, firstDayOfMonth, 0, "curr"));
    days.push(...pushDays(nextMonthRemainingDays, nextMonth, 0, "next"));

    return days;
  }, [prevMonthRemainingDays, nearestEndOfMonth, daysInMonth, nextMonthRemainingDays, prevMonth, firstDayOfMonth, nextMonth, pushDays]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseCoords({ x: e.pageX, y: e.pageY });
  };

  useEffect(() => {
    if (dayGridRef && dayGridRef.current) setDayGridHeight(dayGridRef.current.offsetHeight);
  }, []);

  return (
    <Wrapper ref={dayGridRef} onMouseMove={onMouseMove}>
      {render()}
    </Wrapper>
  );
};

export default DayGrid;
