import { CONFIG } from '../constant';
import dayjs, { Dayjs } from 'dayjs';
import { TDateline, TViewMode } from '../model';

export const DateUtils = {
  getPrevDay,
  getNextDay,
  getPrevWeek,
  getNextWeek,
  getDateline,
  getCustomDateToDate,
  getCustomDay,
  isEqual,
};

function getPrevDay(currentDate: string): Dayjs {
  return dayjs(currentDate).subtract(1, 'd');
}

function getNextDay(currentDate: string): Dayjs {
  return dayjs(currentDate).add(1, 'd');
}

function getPrevWeek(currentDate: string): Dayjs {
  return dayjs(currentDate).subtract(7, 'd');
}

function getNextWeek(currentDate: string): Dayjs {
  return dayjs(currentDate).add(7, 'd');
}

function getDateline(currentDate: Dayjs, viewMode: TViewMode): TDateline {
  let startOfWeek = currentDate.startOf('weeks'); // monday
  let endOfWeek = currentDate.endOf('weeks'); // sunday

  const dateline: TDateline = [];

  if (viewMode === 'DAY') {
    const today = {
      number: currentDate.format('DD'),
      text: currentDate.format('dddd'),
      origin: currentDate,
    };
    dateline.push(today);
  } else if (viewMode === 'WEEK') {
    while (startOfWeek <= endOfWeek) {
      dateline.push({
        number: startOfWeek.format('DD'),
        text: startOfWeek.format('dddd'),
        origin: startOfWeek,
      });
      startOfWeek = startOfWeek.clone().add(1, 'd');
    }
  }

  return dateline;
}

function getCustomDateToDate(currentDate: Dayjs): string {
  const startOrigin = currentDate.startOf('weeks'); // monday
  const start = {
    date: startOrigin.format('D'),
    month: startOrigin.format('MMM'),
  };

  const endOrigin = currentDate.endOf('weeks'); // sunday
  const end = {
    date: endOrigin.format('D'),
    month: endOrigin.format('MMM'),
    year: endOrigin.format('YYYY'),
  };

  let res = '';
  if (start.month === end.month) {
    res = `${start.date} - ${end.date} ${end.month}, ${end.year} `;
  } else {
    res = `${start.date} ${start.month} - ${end.date} ${end.month}, ${end.year} `;
  }

  return res;
}

function getCustomDay(currentDate: Dayjs): string {
  const number = currentDate.format('D');
  const text = currentDate.format('dddd');
  const month = currentDate.format('MMM');
  const year = currentDate.format('YYYY');

  const res = `${text} ${number} ${month}, ${year}`;
  return res;
}


function isEqual(dayA: Dayjs, dayB: Dayjs) {
  const dayAStr = dayA.format(CONFIG.DATE_FORMAT);
  const dayBStr = dayB.format(CONFIG.DATE_FORMAT);
  const res = dayAStr === dayBStr;
  return res;
}
