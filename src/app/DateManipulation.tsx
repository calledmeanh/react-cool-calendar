import React from 'react';
import { useCalendarDispatch, useCalendarState } from '../hook';
import { EAction } from '../model';
import { DateUtils } from '../util';
import { Flex, Button, Text } from './common';

const DateManipulation: React.FC<{}> = () => {
  const calendarState = useCalendarState();
  const dispath = useCalendarDispatch();

  const curDate = calendarState.currentDate.format(calendarState.dateFormat);
  const today = calendarState.todayGlobalIns.format(calendarState.dateFormat);

  const onPrevDay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const prevDay = DateUtils.prevDay(curDate);
    dispath({ type: EAction.PREV_DAY, payload: prevDay });
  };

  const onNextDay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const nextDay = DateUtils.nextDay(curDate);
    dispath({ type: EAction.NEXT_DAY, payload: nextDay });
  };

  const onPrevWeek = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const prevWeek = DateUtils.prevWeek(curDate);
    dispath({ type: EAction.PREV_WEEK, payload: prevWeek });
  };

  const onNextWeek = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const nextWeek = DateUtils.nextWeek(curDate);
    dispath({ type: EAction.NEXT_WEEK, payload: nextWeek });
  };

  const onToday = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispath({ type: EAction.GET_TODAY, payload: calendarState.todayGlobalIns });
  };

  return (
    <Flex data-idtf={'daytime'} $align={'center'} $justify={'center'}>
      <Button $padding={[8, 12]} onClick={calendarState.viewMode === 'DAY' ? onPrevDay : onPrevWeek}>
        &#x2039;
      </Button>
      <Button
        disabled={curDate === today}
        style={{ borderRight: 'none', borderLeft: 'none' }}
        $padding={[8, 12]}
        onClick={onToday}
      >
        today
      </Button>
      <Text style={{ minWidth: 210 }} $padding={[7, 12]} $align={'center'} $justify={'center'}>
        {calendarState.viewMode === 'DAY'
          ? DateUtils.getCustomDay(calendarState.currentDate)
          : DateUtils.getCustomDateToDate(calendarState.currentDate)}
      </Text>
      <Button
        $padding={[8, 12]}
        style={{ borderLeft: 'none' }}
        onClick={calendarState.viewMode === 'DAY' ? onNextDay : onNextWeek}
      >
        &#x203A;
      </Button>
    </Flex>
  );
};

export default DateManipulation;
