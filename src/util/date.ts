import dayjs, { Dayjs } from 'dayjs';
import { CONFIG } from '../constant';
import { TDateline, TDay, TViewMode } from '../model';

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
  let startOfWeek: Dayjs = currentDate.startOf('weeks'); // monday
  let endOfWeek: Dayjs = currentDate.endOf('weeks'); // sunday

  const dateline: TDateline = [];

  if (viewMode === 'DAY') {
    const today: TDay = {
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

type TStartOrigCustom = { date: string; month: string };
type TEndOrigCustom = { date: string; month: string; year: string };

function getCustomDateToDate(currentDate: Dayjs): string {
  const startOrigin: Dayjs = currentDate.startOf('weeks'); // monday
  const start: TStartOrigCustom = {
    date: startOrigin.format('D'),
    month: startOrigin.format('MMM'),
  };

  const endOrigin: Dayjs = currentDate.endOf('weeks'); // sunday
  const end: TEndOrigCustom = {
    date: endOrigin.format('D'),
    month: endOrigin.format('MMM'),
    year: endOrigin.format('YYYY'),
  };

  let res: string = '';
  if (start.month === end.month) {
    res = `${start.date} - ${end.date} ${end.month}, ${end.year} `;
  } else {
    res = `${start.date} ${start.month} - ${end.date} ${end.month}, ${end.year} `;
  }

  return res;
}

function getCustomDay(currentDate: Dayjs): string {
  const number: string = currentDate.format('D');
  const text: string = currentDate.format('dddd');
  const month: string = currentDate.format('MMM');
  const year: string = currentDate.format('YYYY');

  const res: string = `${text} ${number} ${month}, ${year}`;
  return res;
}

function isEqual(dayA: Dayjs, dayB: Dayjs): boolean {
  const dayAStr: string = dayA.format(CONFIG.DATE_FORMAT);
  const dayBStr: string = dayB.format(CONFIG.DATE_FORMAT);
  const res: boolean = dayAStr === dayBStr;
  return res;
}
