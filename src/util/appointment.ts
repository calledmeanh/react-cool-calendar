import { TAppointmentForApp, TAppointmentForUser } from '../model';
import { TimeUtils } from './time';
import { CONFIG } from '../constant';

export const AppointmentUtils = {
  layoutAlgorithm,
};

/* 
  this algorithm takes a list of appointment and return the ordered appointments: 
  https://stackoverflow.com/questions/11311410/visualization-of-calendar-events-algorithm-to-layout-events-with-maximum-width 
 */
function layoutAlgorithm(
  appts: TAppointmentForUser[],
  opts: {
    daytimeStart: number;
    duration: number;
    columnWidth: number;
  }
) {
  let columns: TAppointmentForApp[][] = [];
  let lastEventEnding: number | null = null;

  let events: TAppointmentForApp[] = appts.map((appt) => {
    return { ...appt, ...calcApptPos(appt, { ...opts }), width: 0, left: 0 };
  });

  // sort it by starting time, and then by ending time.
  events = events.sort(function (e1, e2) {
    if (e1.top < e2.top) return -1;
    if (e1.top > e2.top) return 1;
    if (e1.top + e1.height < e2.top + e2.height) return -1;
    if (e1.top + e1.height > e2.top + e2.height) return 1;
    return 0;
  });

  // iterate over the sorted array
  events.forEach((e: TAppointmentForApp) => {
    if (lastEventEnding !== null && e.top >= lastEventEnding) {
      packEvents(columns, opts.columnWidth);
      columns = [];
      lastEventEnding = null;
    }

    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      let col = columns[i];
      if (!isOverlapped(col[col.length - 1], e)) {
        col.push(e);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([e]);
    }

    if (lastEventEnding === null || e.top + e.height > lastEventEnding) {
      lastEventEnding = e.top + e.height;
    }
  });

  if (columns.length > 0) {
    packEvents(columns, opts.columnWidth);
  }
  return events;
}

function packEvents(columns: TAppointmentForApp[][], columnWidth: number) {
  let n = columns.length;
  for (let i = 0; i < n; i++) {
    let col = columns[i];
    for (let j = 0; j < col.length; j++) {
      let cell = col[j];
      cell.left = (i / n) * 100;
      cell.width = columnWidth / n - 1;
    }
  }
}

/* get top, height, startTime, endTime of appt */
function calcApptPos(
  appt: TAppointmentForUser,
  opts: {
    daytimeStart: number;
    duration: number;
  }
) {
  const startTime = appt.startTime;
  const endTime = startTime + TimeUtils.convertMinuteToSeconds(appt.duration);

  const top: number = TimeUtils.calcDistanceBetweenTimes(startTime, opts.daytimeStart, opts.duration, 24);

  const mapDuration = CONFIG.MAPPING_TIME[opts.duration];
  const height: number = TimeUtils.calcDistanceBetweenTimes(
    endTime,
    startTime,
    mapDuration,
    (24 * mapDuration) / opts.duration
  );

  return {
    top,
    height: height - 1,
    startTime,
    endTime,
  };
}

function isOverlapped(a: TAppointmentForApp, b: TAppointmentForApp) {
  const { top: start } = a;
  const { top: otherStart } = b;
  const end = start + a.height;
  const otherEnd = otherStart + b.height;

  if (
    (start < otherStart && otherStart < end) ||
    (start < otherEnd && otherEnd < end) ||
    (otherStart < start && start < otherEnd) ||
    (otherStart < end && end < otherEnd) ||
    (otherStart === start && otherEnd === end)
  ) {
    return true;
  }

  return false;
}
