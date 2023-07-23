import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { clsx } from '../util';
import { DateUtils } from '../util';
import { Flex } from './common';
import { useCalendar } from '../hook';

const Wrapper = styled(Flex)`
  height: 60px;
  background: #f7f7f8;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const DatelineHeader = styled(Flex)<{ $height: number }>`
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
    background: #eef0f2;
    width: 1px;
    height: ${(props) => props.$height}px;
    position: absolute;
    top: 0;
    right: 0;
    content: '';
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
  &.today {
    color: #037aff;
  }
`;

const Dateline: React.FC<{ height: any }> = ({ height }) => {
  const calendarState = useCalendar();

  const render = () => {
    //TODO: when user change week to day, the day should be today!
    let week = DateUtils.getWeek();
    if (calendarState.mode === 'DAY') week = week.slice(0, 1);

    return week.map((w, i) => {
      const today: string = moment(w.origin).format(calendarState.dateFormat);
      const isToday: boolean = DateUtils.isToday(today);
      const classname = clsx({
        today: isToday,
      });
      return (
        <DatelineHeader key={i} $justify={'center'} $align={'center'} $height={height || 0}>
          <DatelineNumber className={classname}>{w.number}</DatelineNumber>
          <DatelineText className={classname}>{w.text}</DatelineText>
        </DatelineHeader>
      );
    });
  };

  return <Wrapper data-idtf={'dateline'}>{render()}</Wrapper>;
};

export default Dateline;
