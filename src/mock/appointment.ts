import dayjs from 'dayjs';
import { CONFIG } from '../constant';
import { EStatus } from '../model';

export const ElementMocks = {
  getDataSource,
};

function getDataSource() {
  return [
    {
      id: '1',
      startTime: 7 * CONFIG.SECONDS_PER_HOUR,
      duration: 120,
      title: '1',
      content: 'You only live once',
      status: EStatus.BOOKED,
      createdAt: dayjs(),
    },
    {
      id: '2',
      startTime: 8 * CONFIG.SECONDS_PER_HOUR,
      duration: 200,
      title: '2',
      content: 'You only live once',
      status: EStatus.CONFIRMED,
      createdAt: dayjs(),
    },
    {
      id: '3',
      startTime: 9 * CONFIG.SECONDS_PER_HOUR,
      duration: 150,
      title: '3',
      content: 'You only live once',
      status: EStatus.ARRIVED,
      createdAt: dayjs(),
    },
    {
      id: '4',
      startTime: 7 * CONFIG.SECONDS_PER_HOUR,
      duration: 120,
      title: '4',
      content: 'You only live once',
      status: EStatus.NOSHOW,
      createdAt: dayjs(),
    },
    {
      id: '5',
      startTime: 6 * CONFIG.SECONDS_PER_HOUR,
      duration: 120,
      title: '5',
      content: 'You only live once',
      status: EStatus.BOOKED,
      createdAt: dayjs(),
    },
    {
      id: '6',
      startTime: 9 * CONFIG.SECONDS_PER_HOUR,
      duration: 90,
      title: '6',
      content: 'You only live once',
      status: EStatus.CONFIRMED,
      createdAt: dayjs(),
    },
    {
      id: '7',
      startTime: 9 * CONFIG.SECONDS_PER_HOUR,
      duration: 90,
      title: '7',
      content: 'You only live once',
      status: EStatus.ARRIVED,
      createdAt: dayjs().subtract(1, 'd'),
    },
    {
      id: '8',
      startTime: 7 * CONFIG.SECONDS_PER_HOUR,
      duration: 90,
      title: '8',
      content: 'You only live once',
      status: EStatus.STARTED,
      createdAt: dayjs().add(1, 'd'),
    },
    {
      id: '9',
      startTime: 7 * CONFIG.SECONDS_PER_HOUR,
      duration: 90,
      title: '9',
      content: 'You only live once',
      status: EStatus.NOSHOW,
      createdAt: dayjs().add(2, 'd'),
    },
    {
      id: '10',
      startTime: 7 * CONFIG.SECONDS_PER_HOUR,
      duration: 90,
      title: '10',
      content: 'You only live once',
      status: EStatus.BOOKED,
      createdAt: dayjs().add(2, 'd'),
    },
    {
      id: '11',
      startTime: 8 * CONFIG.SECONDS_PER_HOUR,
      duration: 180,
      title: '11',
      content: 'You only live once',
      status: EStatus.CONFIRMED,
      createdAt: dayjs().add(2, 'd'),
    },
    {
      id: '12',
      startTime: 8 * CONFIG.SECONDS_PER_HOUR,
      duration: 180,
      title: '12',
      content: 'You only live once',
      status: EStatus.NOSHOW,
      createdAt: dayjs().subtract(2, 'd'),
    },
    {
      id: '13',
      startTime: 8 * CONFIG.SECONDS_PER_HOUR,
      duration: 60,
      title: '13',
      content: 'You only live once',
      status: EStatus.BOOKED,
      createdAt: dayjs().subtract(2, 'd'),
    },
    {
      id: '14',
      startTime: 6 * CONFIG.SECONDS_PER_HOUR,
      duration: 135,
      title: '14',
      content: 'You only live once',
      status: EStatus.BOOKED,
      createdAt: dayjs().subtract(2, 'd'),
    },
    {
      id: '15',
      startTime: 6 * CONFIG.SECONDS_PER_HOUR,
      duration: 300,
      title: '15',
      content: 'You only live once',
      status: EStatus.ARRIVED,
      createdAt: dayjs().subtract(3, 'd'),
    },
    {
      id: '16',
      startTime: 6 * CONFIG.SECONDS_PER_HOUR,
      duration: 300,
      title: '16',
      content: 'You only live once',
      status: EStatus.CONFIRMED,
      createdAt: dayjs().subtract(4, 'd'),
    },
  ];
}