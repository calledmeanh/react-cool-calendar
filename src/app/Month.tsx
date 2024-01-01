import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dayjs } from "dayjs";
import styled from "styled-components";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { EStatus, TAppointmentForUser, TCalendarStateForApp } from "../model";
import { AppointmentUtils, DateUtils, TimeUtils, clsx } from "../util";
import { Flex } from "./common";
import Dateline from "./Dateline";

const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const DayGrid = styled(Flex)`
  height: calc(100% - 60px); // 60px is height of dateline
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  border-left: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
`;

const DayCell = styled.div`
  cursor: pointer;
  overflow-y: hidden;
  border-top: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  border-right: 1px solid ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  &.currMonth {
    color: #000;
    background-color: #fff;
  }
`;

const DayText = styled.p`
  margin: 4px;
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  color: ${CONFIG.CSS.FONT_LIGHT_COLOR};
  width: 30px;
  height: 30px;
  line-height: 30px;
  &.today {
    text-align: center;
    border-radius: 50%;
    background-color: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
    color: #fff !important;
  }
  &.currMonth {
    color: #000;
  }
`;

const RectWrapper = styled(Flex)<{ $status: EStatus }>`
  height: calc(100% / 5);
  border-radius: 4px;
  padding: 0 4px;
  &:hover {
    background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  }
`;

const RectDotCircle = styled.div<{ $status: EStatus }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  border: 1px solid ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
`;

const RectText = styled.span`
  width: calc(100% - 20px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
`;

const ApptRectangle: React.FC<{ value: TAppointmentForUser }> = ({ value }) => {
  const startTime: string = TimeUtils.convertSecondsToHourString(value.startTime);
  return (
    <RectWrapper $align={"center"} $status={value.status}>
      <RectDotCircle $status={value.status} />{" "}
      <RectText title={value.title}>
        {startTime} - {value.title}
      </RectText>
    </RectWrapper>
  );
};

const Month: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dayGridRef: React.MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const [dayGridHeight, setDayGridHeight] = useState<number>(0);

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

        const apptByDay = calendarState.appointments.filter((appt) => DateUtils.isEqual(dateInMonth, appt.createdAt));

        days.push(
          <DayCell key={`${prefix}-month-${i}`} className={classname} style={{ height: dayGridHeight / rows }}>
            <DayText className={classname}>{dateInMonth.date()}</DayText>
            {apptByDay.map((a) => (
              <ApptRectangle key={a.id} value={a} />
            ))}
          </DayCell>,
        );
      }

      return days;
    },
    [calendarState.todayGlobalIns, calendarState.appointments, dayGridHeight, rows],
  );

  const render = useCallback(() => {
    const days: JSX.Element[] = [];

    days.push(...pushDays(prevMonthRemainingDays, prevMonth, nearestEndOfMonth, "prev"));
    days.push(...pushDays(daysInMonth, firstDayOfMonth, 0, "curr"));
    days.push(...pushDays(nextMonthRemainingDays, nextMonth, 0, "next"));

    return days;
  }, [prevMonthRemainingDays, nearestEndOfMonth, daysInMonth, nextMonthRemainingDays, prevMonth, firstDayOfMonth, nextMonth, pushDays]);

  useEffect(() => {
    if (dayGridRef && dayGridRef.current) setDayGridHeight(dayGridRef.current.offsetHeight);
  }, []);

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.MONTH}>
      <Dateline></Dateline>
      <DayGrid ref={dayGridRef}>{render()}</DayGrid>
    </Wrapper>
  );
};

export default Month;
