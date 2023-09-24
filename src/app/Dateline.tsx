import React, { useCallback } from 'react';
import styled from 'styled-components';
import { clsx } from '../util';
import { DateUtils } from '../util';
import { Flex } from './common';
import { useCalendarState } from '../hook';

const Wrapper = styled(Flex)`
  height: 60px;
  background: #f7f7f8;
  position: sticky;
  top: 0;
  z-index: 4;
`;

const DatelineHeader = styled(Flex)<{ $afterPseudoHeight: number }>`
  flex: 1;
  background: transparent;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0, 0, 1, 1);
  position: relative;
  &:hover {
    background: #fff;
    box-shadow: 0 3px 5px 0 rgba(164, 173, 186, 0.25);
  }
  &:active {
    box-shadow: none;
  }
  &::after {
    width: 1px;
    background: #eef0f2;
    height: ${(props) => props.$afterPseudoHeight}px;
    position: absolute;
    top: 0;
    right: 0;
    content: '';
    pointer-events: none;
  }
`;

const DatelineNumber = styled.div`
  font-size: 26px;
  margin-right: 6px;
  color: #67768c;
  &.today {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    background: #037aff;
    color: #fff;
  }
`;

const DatelineText = styled.div`
  font-size: 14px;
  color: #67768c;
  text-transform: capitalize;
  &.today {
    color: #037aff;
  }
`;

type TDateline = { afterPseudoHeight: number };
const Dateline: React.FC<TDateline> = ({ afterPseudoHeight }) => {
  const calendarState = useCalendarState();

  const render = useCallback(() => {
    const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

    return dateline.map((d, i) => {
      const isToday: boolean = DateUtils.isEqual(d.origin, calendarState.todayGlobalIns);
      const classname = clsx({
        today: isToday,
      });
      return (
        <DatelineHeader key={i} $justify={'center'} $align={'center'} $afterPseudoHeight={afterPseudoHeight}>
          <DatelineNumber className={classname}>{d.number}</DatelineNumber>
          <DatelineText className={classname}>{d.text}</DatelineText>
        </DatelineHeader>
      );
    });
  }, [afterPseudoHeight, calendarState.viewMode, calendarState.currentDate, calendarState.todayGlobalIns]);

  return <Wrapper data-idtf={'dateline'}>{render()}</Wrapper>;
};

export default Dateline;
