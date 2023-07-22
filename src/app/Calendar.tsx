import React from 'react';
import styled from 'styled-components';
import { Flex } from './common';
import Toolbar from './Toolbar';
import Content from './Content';
import CalendarProvider from '../hook/useCalendarContext';
import { TCalendarState } from '../model';

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  background: #f7f7f8;
  position: relative;
`;

/**
 * Calendar takes props by user pass in
 */
const Calendar: React.FC<TCalendarState> = (props) => {
  return (
    <CalendarProvider initialState={props}>
      <Wrapper data-idtf={'calendar'} $dir={'column'} $justify={'center'} $align={'center'}>
        <Toolbar />
        <Content />
      </Wrapper>
    </CalendarProvider>
  );
};

export default Calendar;
