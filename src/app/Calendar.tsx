import React from 'react';
import styled from 'styled-components';
import { Flex } from './common';
import Toolbar from './Toolbar';
import CalendarProvider from '../hook/useCalendarContext';
import { TCalendarStateForUser, TCalendarStateForApp } from '../model';
import Scrolling from './Scrolling';

import dayjs from 'dayjs';
/* 
  By default, Day.js comes with English locale only. If you need other locales, you can load them on demand. 
*/
import 'dayjs/locale/vi';

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  background: #f7f7f8;
  position: relative;
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
      <Wrapper data-idtf={'calendar'} $dir={'column'} $justify={'center'} $align={'center'}>
        <Toolbar />
        <Scrolling />
      </Wrapper>
    </CalendarProvider>
  );
};

export default Calendar;
