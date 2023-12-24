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

  const onPrevDay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const prevDay: Dayjs = DateUtils.getPrevDay(curDate);
    dispath({ type: EAction.PREV_DAY, payload: prevDay });
  };

  const onNextDay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const nextDay: Dayjs = DateUtils.getNextDay(curDate);
    dispath({ type: EAction.NEXT_DAY, payload: nextDay });
  };

  const onPrevWeek = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const prevWeek: Dayjs = DateUtils.getPrevWeek(curDate);
    dispath({ type: EAction.PREV_WEEK, payload: prevWeek });
  };

  const onNextWeek = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const nextWeek: Dayjs = DateUtils.getNextWeek(curDate);
    dispath({ type: EAction.NEXT_WEEK, payload: nextWeek });
  };

  const onToday = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispath({ type: EAction.GET_TODAY, payload: calendarState.todayGlobalIns });
  };

  return (
    <Flex data-idtf={CONFIG.DATA_IDTF.DAYTIME}>
      <Button $padding={[8, 12]} onClick={calendarState.viewMode === "DAY" ? onPrevDay : onPrevWeek}>
        &#x2039;
      </Button>
      {(calendarState.viewMode === "DAY" || calendarState.viewMode === "WEEK") && (
        <Button disabled={curDate === today} style={{ borderRight: "none", borderLeft: "none" }} $padding={[8, 12]} onClick={onToday}>
          today
        </Button>
      )}
      <Text style={{ minWidth: 200, fontSize: 14 }} $padding={[7, 12]} $align={"center"} $justify={"center"}>
        {calendarState.viewMode === "DAY" && DateUtils.getCustomDay(calendarState.currentDate)}
        {calendarState.viewMode === "WEEK" && DateUtils.getCustomDateToDate(calendarState.currentDate)}
        {calendarState.viewMode === "MONTH" && "December"}
      </Text>
      <Button $padding={[8, 12]} style={{ borderLeft: "none" }} onClick={calendarState.viewMode === "DAY" ? onNextDay : onNextWeek}>
        &#x203A;
      </Button>
    </Flex>
  );
};

export default DateManipulation;
