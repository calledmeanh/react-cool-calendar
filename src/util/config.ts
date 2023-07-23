import { TCalendarState } from '../model';

const createCalendarState = (): TCalendarState => {
  const state: TCalendarState = {
    duration: 0,
    timeType: 0,
    groupTime: 0,
    nowIndicator: true,
    mode: 'DAY',
    dateFormat: '',
    datetimeFormat: '',
    timeFormat: '',
    workingTime: {
      start: 0,
      end: 0,
    },
    dayTime: {
      start: 0,
      end: 0,
    },
  };
  return Object.create(state);
};

export const ConfigUtils = {
  createCalendarState,
};
