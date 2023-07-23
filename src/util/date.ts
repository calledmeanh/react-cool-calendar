import moment from 'moment';
import { CONFIG } from '../constant';
import { TCustomWeek } from '../model';

export const DateUtils = {
  prev,
  next,
  today,
  getWeek,
  isToday,
};

function prev(currentDate: string): string {
  return moment(currentDate).subtract(1, 'days').format(CONFIG.DATE_FORMAT);
}

function next(currentDate: string): string {
  return moment(currentDate).add(1, 'days').format(CONFIG.DATE_FORMAT);
}
function today(): string {
  return moment().format(CONFIG.DATE_FORMAT);
}

function getWeek(): TCustomWeek[] {
  const week: TCustomWeek[] = [];

  let startOfWeek: moment.Moment = moment().startOf('isoWeek');
  let endOfWeek: moment.Moment = moment().endOf('isoWeek');

  while (startOfWeek <= endOfWeek) {
    const JSDate = startOfWeek.toDate();
    week.push({ number: JSDate.getDate(), text: CONFIG.WEEK[JSDate.getDay()], origin: JSDate });
    startOfWeek = startOfWeek.clone().add(1, 'd');
  }
  return week;
}

function isToday(date: string): boolean {
  const today = moment().format(CONFIG.DATE_FORMAT);
  const anotherDay = moment(date).format(CONFIG.DATE_FORMAT);

  const isToday: boolean = today === anotherDay;
  return isToday;
}
