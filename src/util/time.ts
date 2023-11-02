import { CONFIG } from '../constant';
import { EViewMode, TTime } from '../model';

export const TimeUtils = {
  calcDistanceBetweenTimes,
  calcTimeStep,
  createTimes,

  checkGroupTime,
  displayTime,
  checkWorkingTime,

  covertHourMinuteToSeconds,
  covertSecondsToHourMinute,
  convertSecondsToHourString,
  convertMinuteToSeconds,

  parseDurationToViewMode,
  wrapperSetInterval
};

/* calculate top position based-on time */
function calcDistanceBetweenTimes(end: number, start: number, duration: number, lineHeight: number): number {
  const jumps = calcTimeStep(end, start, duration);
  let height: number = jumps * lineHeight;

  const rest = end - (duration * jumps + start);
  const restHeight = (rest * lineHeight) / duration;

  return height + restHeight;
}

/* calculate total steps based-on start and end time */
function calcTimeStep(end: number, start: number, duration: number): number {
  const S = end - start;
  const step = S / duration;
  return Math.floor(step);
}

function createTimes(end: number, start: number, duration: number): number[] {
  const timeStep: number = calcTimeStep(end, start, duration);
  const times: number[] = new Array(timeStep).fill(0);
  return times;
}

/* get something like that --> 00:00 AM */
function convertSecondsToHourString(seconds: number, timeType = 24): string {
  let tempSeconds = seconds;
  if (timeType === 12 && seconds >= 13 * CONFIG.SECONDS_PER_HOUR) {
    tempSeconds = seconds - 12 * CONFIG.SECONDS_PER_HOUR;
  }
  let time = covertSecondsToHourMinute(Math.abs(tempSeconds));

  let timeString = `${formatHourOrMinute(time.hour)}:${formatHourOrMinute(time.minute)}`;

  if (timeType === 12) {
    timeString = `${timeString} ${seconds <= CONFIG.HAFT_DAY_SECONDS ? 'AM' : 'PM'}`;
  }

  return timeString;
}

function covertSecondsToHourMinute(seconds: number): { hour: number; minute: number } {
  const hour = Math.floor(seconds / CONFIG.SECONDS_PER_HOUR);
  const minute = (seconds - hour * CONFIG.SECONDS_PER_HOUR) / CONFIG.SECONDS_PER_MINUTE;
  return {
    hour,
    minute: Math.floor(minute),
  };
}

function formatHourOrMinute(data: number): string {
  return ('0' + data).slice(-2);
}

function covertHourMinuteToSeconds(hour: number, minute: number): number {
  return convertHourToSeconds(hour) + convertMinuteToSeconds(minute);
}

function convertHourToSeconds(hour: number) {
  return hour * CONFIG.SECONDS_PER_HOUR;
}

function convertMinuteToSeconds(minute: number) {
  return minute * CONFIG.SECONDS_PER_MINUTE;
}

/* display time followed by duration */
function displayTime(current: number, start: number, duration: number): boolean {
  return (current - start) % duration === 0 ? true : false;
}

function checkWorkingTime(dayTime: TTime, workingTime: TTime, current: number): boolean {
  if (dayTime.end === workingTime.end && dayTime.start === workingTime.start) {
    return false;
  }

  if (workingTime.start <= current && current < workingTime.end) {
    return true;
  }

  return false;
}

function checkGroupTime(
  groupTimeDuration: number,
  duration: number,
  timeJumpIndex: number,
  groupBy: 'bottom' | 'top' = 'bottom'
): boolean {
  const groupStep = groupTimeDuration / duration;
  let index = timeJumpIndex + 1;
  if (groupBy === 'top') {
    index = timeJumpIndex;
  }
  if (index % groupStep === 0) {
    return true;
  }
  return false;
}

function parseDurationToViewMode(duration: number): string {
  let res = '';
  switch (duration) {
    case CONFIG.VIEWMODE_LARGE:
      res = EViewMode.LARGE;
      break;
    case CONFIG.ZOOMMODE_SMALL:
      res = EViewMode.SMALL;
      break;
    default:
      res = EViewMode.SMALL;
      break;
  }
  return res;
}

function wrapperSetInterval(handler: Function, time: number) {
  const intervalId: number = setInterval(handler, time);
  return () => {
    clearInterval(intervalId);
  };
}
