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
      <Calendar
        duration={CONFIG.DEFAULT.DURATION}
        displayDuration={CONFIG.DEFAULT.DURATION}
        workingTime={CONFIG.DEFAULT.WORKING_TIME}
        dayTime={CONFIG.DEFAULT.DAY_TIME}
        timeType={CONFIG.DEFAULT.TIME_TYPE}
        groupTime={CONFIG.DEFAULT.GROUP_TIME}
        nowIndicator={true}
      />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
