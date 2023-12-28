import React from "react";
import { Dayjs } from "dayjs";
import { CONFIG } from "../constant";
import { useCalendarDispatch, useCalendarState } from "../hook";
import { EAction, TCalendarAction, TCalendarStateForApp } from "../model";
import { DateUtils } from "../util";
import { Flex, Button, Text } from "./common";

const DateManipulation: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dispath: React.Dispatch<TCalendarAction> = useCalendarDispatch();

  const curDate: string = calendarState.currentDate.format(calendarState.dateFormat);
  const today: string = calendarState.todayGlobalIns.format(calendarState.dateFormat);

  const onPrevDay = () => {
    const prevDay: Dayjs = DateUtils.getPrevDay(curDate);
    dispath({ type: EAction.PREV_DAY, payload: prevDay });
  };

  const onNextDay = () => {
    const nextDay: Dayjs = DateUtils.getNextDay(curDate);
    dispath({ type: EAction.NEXT_DAY, payload: nextDay });
  };

  const onPrevWeek = () => {
    const prevWeek: Dayjs = DateUtils.getPrevWeek(curDate);
    dispath({ type: EAction.PREV_WEEK, payload: prevWeek });
  };

  const onNextWeek = () => {
    const nextWeek: Dayjs = DateUtils.getNextWeek(curDate);
    dispath({ type: EAction.NEXT_WEEK, payload: nextWeek });
  };

  const onPrevMonth = () => {
    const prevMonth: Dayjs = DateUtils.getPrevMonth(curDate);
    dispath({ type: EAction.PREV_MONTH, payload: prevMonth });
  };

  const onNextMonth = () => {
    const nextMonth: Dayjs = DateUtils.getNextMonth(curDate);
    dispath({ type: EAction.NEXT_MONTH, payload: nextMonth });
  };

  const prevBtnFactory = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch (calendarState.viewMode) {
      case "DAY":
        onPrevDay();
        break;
      case "WEEK":
        onPrevWeek();
        break;
      case "MONTH":
        onPrevMonth();
        break;
      default:
        break;
    }
  };

  const nextBtnFactory = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch (calendarState.viewMode) {
      case "DAY":
        onNextDay();
        break;
      case "WEEK":
        onNextWeek();
        break;
      case "MONTH":
        onNextMonth();
        break;
      default:
        break;
    }
  };

  const onToday = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispath({ type: EAction.GET_TODAY, payload: calendarState.todayGlobalIns });
  };

  return (
    <Flex data-idtf={CONFIG.DATA_IDTF.DAYTIME}>
      <Button $padding={[8, 12]} onClick={prevBtnFactory}>
        &#x2039;
      </Button>
      <Button disabled={curDate === today} style={{ borderRight: "none", borderLeft: "none" }} $padding={[8, 12]} onClick={onToday}>
        today
      </Button>
      <Text style={{ minWidth: 200, fontSize: 14 }} $padding={[7, 12]} $align={"center"} $justify={"center"}>
        {calendarState.viewMode === "DAY" && DateUtils.getCustomDay(calendarState.currentDate)}
        {calendarState.viewMode === "WEEK" && DateUtils.getCustomDateToDate(calendarState.currentDate)}
        {calendarState.viewMode === "MONTH" && DateUtils.getCustomMonth(calendarState.currentDate)}
      </Text>
      <Button $padding={[8, 12]} style={{ borderLeft: "none" }} onClick={nextBtnFactory}>
        &#x203A;
      </Button>
    </Flex>
  );
};

export default DateManipulation;
