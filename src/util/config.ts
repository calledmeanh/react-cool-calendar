import { TCalendarState } from '../model';

export const ConfigUtil = {
  create,
};

function create(config: TCalendarState): TCalendarState {
  const output: TCalendarState = {
    duration: config.duration,
    displayDuration: config.displayDuration,
    workingTime: config.workingTime,
    dayTime: config.dayTime,
    groupTime: config.groupTime,
    timeType: config.timeType,
    nowIndicator: config.nowIndicator,
  };

  return output;
}
