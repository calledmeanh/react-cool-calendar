import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { CONFIG } from '../constant';
import CalendarProvider from '../hook/useCalendarContext';
import { TCalendarStateForUser, TCalendarStateForApp } from '../model';
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
  const appProps: TCalendarStateForApp = { ...userProps, todayGlobalIns: dayjs(), currentDate: dayjs() };
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
