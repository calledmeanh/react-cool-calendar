export type TCalendarState = {
  duration: number;
  displayDuration: number;
  workingTime: TTime;
  dayTime: TTime;
  timeType: number;
  groupTime: number;
  nowIndicator: boolean;
};

export type TCalendarAction = {
  type: string;
  payload: any;
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
