export type TCalendarState = {
  duration: number;
  workingTime: TTime;
  dayTime: TTime;
  timeType: number;
  groupTime: number;
  nowIndicator: boolean;
  mode: 'DAY' | 'WEEK' | 'MONTH';
  dateFormat: string;
  datetimeFormat: string;
  timeFormat: string;
};

export type TTime = {
  start: number;
  end: number;
};

export type TCustomWeek = {
  number: number;
  text: string;
  origin: Date;
};

export type TCalendarAction = {
  type: EAction;
  payload: any;
};

export enum EAction {
  MODE = 'MODE',
}
