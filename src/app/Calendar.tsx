import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { CONFIG } from '../constant';
import CalendarProvider from '../hook/useCalendarContext';
import { TCalendarStateForUser, TCalendarStateForApp, TAppointmentForUser } from '../model';
import { Flex } from './common';
import Toolbar from './Toolbar';
import Scrolling from './Scrolling';

/* 
  By default, Day.js comes with English locale only. If you need other locales, you can load them on demand. 
*/
import 'dayjs/locale/vi';

const Wrapper = styled(Flex)`
  height: 100%;
  background: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  user-select: none;
`;

/**
 * Calendar takes props by user pass in
 */
const Calendar: React.FC<TCalendarStateForUser> = (userProps) => {
  dayjs.locale(userProps.locale);

  /* modified userprops with some necessary value for app */
  const apptCopy: TAppointmentForUser[] = userProps.appointments.slice();
  const modifiedAppt = apptCopy.map((appt) => {
    return {
      ...appt,
      startTime: appt.startTime * CONFIG.SECONDS_PER_HOUR,
    };
  });

  const appProps: TCalendarStateForApp = {
    ...userProps,
    duration: userProps.duration * CONFIG.SECONDS_PER_MINUTE,
    groupTime: userProps.groupTime * CONFIG.SECONDS_PER_HOUR,
    workingTime: {
      start: userProps.workingTime.start * CONFIG.SECONDS_PER_HOUR,
      end: userProps.workingTime.end * CONFIG.SECONDS_PER_HOUR,
    },
    dayTime: {
      start: userProps.dayTime.start * CONFIG.SECONDS_PER_HOUR,
      end: userProps.dayTime.end * CONFIG.SECONDS_PER_HOUR,
    },
    appointments: [...modifiedAppt],
    todayGlobalIns: dayjs(),
    currentDate: dayjs(),

    isFireEvent: false
  };
  return (
    <CalendarProvider initialState={appProps}>
      <Wrapper data-idtf={CONFIG.DATA_IDTF.CALENDAR} $dir={'column'}>
        <Toolbar />
        <Scrolling />
      </Wrapper>
    </CalendarProvider>
  );
};

export default Calendar;
