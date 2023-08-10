import { TAppointment } from '../model';
import { TimeUtils } from './time';
import { CONFIG } from '../constant';

export const AppointmentUtils = {
  layoutAlgorithm,
};

/* 
  this algorithm takes a list of appointment and return them in ordered by time, filtered by day
 */
function layoutAlgorithm(
  appts: TAppointment[],
  opts: {
    daytimeStart: number;
    duration: number;
  }
) {
  // tạm thời bỏ qua lọc ngày
  // ...

  /* const apptOrderd = appts.sort((a: TAppointment, b: TAppointment) => a.startTime - b.startTime);
  console.log('layoutAlgorithm ~ apptOrderd:', apptOrderd); */

  // tính top, height của appt
  const apptWithTopHeigt = appts.reduce((init: any, a) => {
    const top: number = TimeUtils.calcDistanceBetweenTimes(a.startTime, opts.daytimeStart, opts.duration, 24);
    const endTime = a.startTime + a.duration * CONFIG.SECONDS_PER_MINUTE;

    const mapDuration = CONFIG.MAPPING_TIME[opts.duration];

    const height = TimeUtils.calcDistanceBetweenTimes(
      endTime,
      a.startTime,
      mapDuration,
      (24 * mapDuration) / opts.duration
    );
    init.push({
      ...a,
      rect: {
        top,
        height,
      },
    });
    return init;
  }, []);

  const apptInOrdered = apptWithTopHeigt.sort((a: TAppointment, b: TAppointment) => a.startTime - b.startTime);

  // check đụng chạm
  for (let i = 0; i < apptInOrdered.length - 1; i++) {
    console.log('i')
    console.log(apptInOrdered[i]);
    for (let j = i + 1; j < apptInOrdered.length; j++) {
      console.log('jjj', apptInOrdered[j]);
    }
  }

  return apptInOrdered;
  // làm thé nào để tính width và left?
  // - left dựa trên ngày (createdAt) của appt đê biết nằm cột nào
  // - width dựa theo group overlapped của appt
}

function collidesWith(a: any, b: any) {
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
