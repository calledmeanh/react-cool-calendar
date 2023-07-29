import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Calendar from './app/Calendar';
import { CONFIG } from './constant';
import './index.css';

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
      />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
