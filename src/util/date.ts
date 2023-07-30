import { CONFIG } from '../constant';
import dayjs, { Dayjs } from 'dayjs';
import { TDateline, TViewMode } from '../model';

export const DateUtils = {
  prevDay,
  nextDay,
  prevWeek,
  nextWeek,
  getDateline,
  getCustomDateToDate,
  getCustomDay,
  checkToday,
};

function prevDay(currentDate: string): Dayjs {
  return dayjs(currentDate).subtract(1, 'days');
}

function nextDay(currentDate: string): Dayjs {
  return dayjs(currentDate).add(1, 'days');
}

function prevWeek(currentDate: string): Dayjs {
  return dayjs(currentDate).subtract(7, 'days');
}

function nextWeek(currentDate: string): Dayjs {
  return dayjs(currentDate).add(7, 'days');
}

function getDateline(todayGlobal: Dayjs, viewMode: TViewMode): TDateline {
  let startOfWeek = todayGlobal.startOf('weeks'); // monday
  let endOfWeek = todayGlobal.endOf('weeks'); // sunday

  const dateline: TDateline = [];

  if (viewMode === 'DAY') {
    const today = {
      number: todayGlobal.format('DD'),
      text: todayGlobal.format('dddd'),
      date: todayGlobal.format(CONFIG.DATE_FORMAT),
    };
    dateline.push(today);
  } else if (viewMode === 'WEEK') {
    while (startOfWeek <= endOfWeek) {
      dateline.push({
        number: startOfWeek.format('DD'),
        text: startOfWeek.format('dddd'),
        date: startOfWeek.format(CONFIG.DATE_FORMAT),
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

function checkToday(date: string, todayGlobal: Dayjs): boolean {
  const todayString = todayGlobal.format(CONFIG.DATE_FORMAT);
  const isToday: boolean = todayString === date;
  return isToday;
}
