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
  appointments: TAppointmentForUser[];
};

export type TCalendarStateForApp = TCalendarStateForUser & {
  todayGlobalIns: Dayjs;
  currentDate: Dayjs;
};

export type TAppointmentForUser = {
  id: string;
  startTime: number;
  duration: number;
  title: string;
  content: string;
  status: EStatus;
  createdAt: Dayjs;
};

export type TAppointmentForApp = TAppointmentForUser & TRect & {
    endTime: number;
    weekcolumnIndex: number;
};

export type TTime = {
  start: number;
  end: number;
};

export type TViewMode = 'DAY' | 'WEEK' | 'MONTH';

export type TDay = { number: string; text: string; origin: Dayjs };
export type TDateline = TDay[];

export type TRect = { width: number; height: number; top: number; left: number };

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
  SMALL = 'SMALL',
}

export enum EStatus {
  BOOKED = 'BOOKED', // #3093e8 - blue
  CONFIRMED = 'CONFIRMED', // #6950f3 - orange
  ARRIVED = 'ARRIVED', // #f19101 - purple
  STARTED = 'STARTED', // #00a36d - green
  NOSHOW = 'NOWSHOW', // #da2346 - red
}
