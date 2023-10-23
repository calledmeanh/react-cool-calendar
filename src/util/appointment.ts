import { EStatus, TAppointmentForApp, TAppointmentForUser } from '../model';
import { TimeUtils } from './time';
import { CONFIG } from '../constant';

export const AppointmentUtils = {
  layoutAlgorithm,
  getApptColorByStatus,
  getApptTime
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
      // cellWidth * i + i: là vị trí của các phần tử con bên trong cột tuần
      // otps.columnWidth * otps.weekcolumnIndex: là vị trí bắt đầu left của các ptử con
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

function getApptTime(startTime: number, duration: number, lineHeight: number, apptHeight: number, timeType: number) {
  let startTimeStr: string = TimeUtils.convertSecondsToHourString(startTime, timeType);
  let endTime: number = startTime + ((apptHeight + 1) * duration) / lineHeight; // vi da -1 height nen phai +1 lai
  let endTimeStr: string = TimeUtils.convertSecondsToHourString(endTime, timeType);

  return {
    startTimeStr,
    endTimeStr,
  };
}

function getApptColorByStatus(color: EStatus) {
  switch (color) {
    case EStatus.BOOKED:
      return '#3093e8';
    case EStatus.CONFIRMED:
      return '#6950f3';
    case EStatus.ARRIVED:
      return '#f19101';
    case EStatus.STARTED:
      return '#00a36d';
    case EStatus.NOSHOW:
      return '#da2346';
    default:
      return '#3093e8';
  }
}
