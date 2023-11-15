import { EStatus, TAppointmentForApp, TAppointmentForUser } from '../model';
import { TimeUtils } from './time';
import { CONFIG } from '../constant';

export const AppointmentUtils = {
  layoutAlgorithm,
  getApptColorByStatus,
};

/* 
  this algorithm takes a list of appointment and return the appointment with top,left,width,height attribute
  https://stackoverflow.com/questions/11311410/visualization-of-calendar-events-algorithm-to-layout-events-with-maximum-width 
 */
function layoutAlgorithm(
  appts: TAppointmentForUser[],
  opts: {
    daytimeStart: number;
    duration: number;
    columnWidth: number;
    weekcolumnIndex: number;
  }
) {
  let columns: TAppointmentForApp[][] = [];
  let lastEventEnding: number | null = null;

  let events: TAppointmentForApp[] = appts.map((appt) => {
    return { ...appt, ...calcApptPos(appt, { ...opts }), width: 0, left: 0, weekcolumnIndex: opts.weekcolumnIndex };
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
      packEvents(columns, { ...opts });
      columns = [];
      lastEventEnding = null;
    }

    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      let col = columns[i];
      if (!checkOverlapped(col[col.length - 1], e)) {
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
    packEvents(columns, { ...opts });
  }
  return events;
}

function packEvents(
  columnAppt: TAppointmentForApp[][],
  otps: {
    columnWidth: number;
    weekcolumnIndex: number;
  }
) {
  let n = columnAppt.length;
  for (let i = 0; i < n; i++) {
    let col = columnAppt[i];
    for (let j = 0; j < col.length; j++) {
      // cell.l eft = ((i / n) * 100) / datelineLength;
      const cell = col[j];
      const cellWidth = otps.columnWidth / n - 1;
      // cellWidth * i + i: is the position of child elements inside week column
      // otps.columnWidth * otps.weekcolumnIndex: is the left position of child elements
      const cellLeft = cellWidth * i + i + otps.columnWidth * otps.weekcolumnIndex;
      cell.left = cellLeft;
      cell.width = cellWidth;
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

  const top: number = TimeUtils.calcDistanceBetweenTimes(startTime, opts.daytimeStart, opts.duration, CONFIG.CSS.LINE_HEIGHT);

  const mapDuration = CONFIG.MAPPING_TIME[opts.duration];
  const height: number = TimeUtils.calcDistanceBetweenTimes(
    endTime,
    startTime,
    mapDuration,
    (CONFIG.CSS.LINE_HEIGHT * mapDuration) / opts.duration
  );

  return {
    top,
    height: height - 1,
    startTime,
    endTime,
  };
}

function checkOverlapped(a: TAppointmentForApp, b: TAppointmentForApp) {
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

function getApptColorByStatus(color: EStatus) {
  switch (color) {
    case EStatus.BOOKED:
      return CONFIG.CSS.APPT_BG_COLORS.BOOKED;
    case EStatus.CONFIRMED:
      return CONFIG.CSS.APPT_BG_COLORS.CONFIRMED;
    case EStatus.ARRIVED:
      return CONFIG.CSS.APPT_BG_COLORS.ARRIVED;
    case EStatus.STARTED:
      return CONFIG.CSS.APPT_BG_COLORS.STARTED;
    case EStatus.NOSHOW:
      return CONFIG.CSS.APPT_BG_COLORS.NOSHOW;
    default:
      return CONFIG.CSS.APPT_BG_COLORS.BOOKED;
  }
}
