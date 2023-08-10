import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Calendar from './app/Calendar';
import { CONFIG } from './constant';
import './index.css';
import { EStatus } from './model';
import dayjs from 'dayjs';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <div style={{ width: '100vw', height: '100vh', padding: '2.4rem' }}>
      {/* Calendar should take props from user pass in, this value below is just for temporary */}
      <Calendar
        duration={CONFIG.VIEWMODE_SMALL}
        timeType={24}
        groupTime={60 * CONFIG.SECONDS_PER_HOUR}
        nowIndicator={true}
        viewMode={'WEEK'}
        dateFormat="MM/DD/YYYY"
        datetimeFormat="MM DD YYYY hh:mm:ss"
        timeFormat="hh:mm:ss"
        locale="en"
        workingTime={{
          start: 7 * CONFIG.SECONDS_PER_HOUR,
          end: 20 * CONFIG.SECONDS_PER_HOUR,
        }}
        dayTime={{
          start: 0 * CONFIG.SECONDS_PER_HOUR,
          end: 24 * CONFIG.SECONDS_PER_HOUR,
        }}
        appointments={[
          {
            id: '1',
            startTime: 18 * CONFIG.SECONDS_PER_HOUR,
            duration: 120,
            title: 'This is an appt 1',
            content: 'You only live once',
            status: EStatus.CREATE,
            createdAt: dayjs(),
          },
          {
            id: '2',
            startTime: 13 * CONFIG.SECONDS_PER_HOUR,
            duration: 168,
            title: 'This is an appt 2',
            content: 'You only live once',
            status: EStatus.DONE,
            createdAt: dayjs(),
          },
          {
            id: '3',
            startTime: 9 * CONFIG.SECONDS_PER_HOUR,
            duration: 180,
            title: 'This is an appt 3',
            content: 'You only live once',
            status: EStatus.CANCEL,
            createdAt: dayjs(),
          },
          {
            id: '4',
            startTime: 7 * CONFIG.SECONDS_PER_HOUR,
            duration: 60,
            title: 'This is an appt 4',
            content: 'You only live once',
            status: EStatus.PROCESS,
            createdAt: dayjs(),
          },
          {
            id: '5',
            startTime: 7 * CONFIG.SECONDS_PER_HOUR,
            duration: 90,
            title: 'This is an appt 5',
            content: 'You only live once',
            status: EStatus.PROCESS,
            createdAt: dayjs(),
          },
          {
            id: '6',
            startTime: 13 * CONFIG.SECONDS_PER_HOUR,
            duration: 45,
            title: 'This is an appt 6',
            content: 'You only live once',
            status: EStatus.PROCESS,
            createdAt: dayjs(),
          },
          {
            id: '7',
            startTime: 18 * CONFIG.SECONDS_PER_HOUR,
            duration: 120,
            title: 'This is an appt 7',
            content: 'You only live once',
            status: EStatus.PROCESS,
            createdAt: dayjs(),
          },
          {
            id: '8',
            startTime: 19 * CONFIG.SECONDS_PER_HOUR,
            duration: 180,
            title: 'This is an appt 8',
            content: 'You only live once',
            status: EStatus.PROCESS,
            createdAt: dayjs(),
          },
        ]}
      />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
