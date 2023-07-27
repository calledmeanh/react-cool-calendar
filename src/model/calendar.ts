import { Dayjs } from 'dayjs';

export type TCalendarStateForUser = {
  duration: number;
  timeType: number;
  groupTime: number;
  nowIndicator: boolean;
  viewMode: TViewMode;
  dateFormat: string;
  datetimeFormat: string;
  timeFormat: string;
  locale: string;
  workingTime: TTime;
  dayTime: TTime;
};

export type TCalendarStateForApp = TCalendarStateForUser & {
  todayGlobalIns: Dayjs;
  currentDate: Dayjs;
};

export type TTime = {
  start: number;
  end: number;
};

export type TViewMode = 'DAY' | 'WEEK' | 'MONTH';

export type TDay = { number: string; text: string; date: string };
export type TDateline = {
  week: TDay[];
  today: TDay;
};

export type TCalendarAction = {
  type: EAction;
  payload: any;
};

export enum EAction {
  CHANGE_MODE = 'CHANGE_MODE',
  CHANGE_ZOOM = 'CHANGE_ZOOM',
  PREV_DAY = 'PREV_DAY',
  NEXT_DAY = 'NEXT_DAY',
  PREV_WEEK = 'PREV_WEEK',
  NEXT_WEEK = 'NEXT_WEEK',
  GET_TODAY = 'GET_TODAY',
}

export enum EViewMode {
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
  SMALL = 'SMALL',
}
