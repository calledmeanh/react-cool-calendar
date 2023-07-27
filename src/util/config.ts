import dayjs from 'dayjs';
import { TCalendarStateForApp } from '../model';

const createExampleCalendarState = (): TCalendarStateForApp => {
  const state: TCalendarStateForApp = {
    duration: 0,
    timeType: 0,
    groupTime: 0,
    nowIndicator: true,
    viewMode: 'WEEK',
    dateFormat: '',
    datetimeFormat: '',
    timeFormat: '',
    locale: '',
    workingTime: {
      start: 0,
      end: 0,
    },
    dayTime: {
      start: 0,
      end: 0,
    },
    todayGlobalIns: dayjs(),
    currentDate: dayjs(),
  };
  return Object.create(state);
};

export const ConfigUtils = {
  createExampleCalendarState,
};
