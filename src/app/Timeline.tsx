import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { CONFIG } from '../constant';
import { clsx } from '../util';
import { DateUtils } from '../util';
import { Flex } from './common';

const Wrapper = styled(Flex)`
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 52;
  background: #f7f7f8;
`;

const TimelineHeader = styled(Flex)`
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
    height: 2304px;
    position: absolute;
    top: 60px;
    right: 0;
    content: '';
  }
`;

const TimelineNumber = styled.div`
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

const TimelineText = styled.div`
  font-size: 14px;
  color: #67768c;
  &.today {
    color: #037aff;
  }
`;

const Timeline: React.FC<{}> = () => {
  return (
    <Wrapper data-idtf={'timeline'}>
      {DateUtils.getWeek().map((week, i) => {
        const today: string = moment(week.origin).format(CONFIG.DEFAULT.DATE_FORMAT);
        const isToday: boolean = DateUtils.isToday(today);
        const classname = clsx({
          today: isToday,
        });
        return (
          <TimelineHeader key={i} $justify={'center'} $align={'center'}>
            <TimelineNumber className={classname}>{week.number}</TimelineNumber>
            <TimelineText className={classname}>{week.text}</TimelineText>
          </TimelineHeader>
        );
      })}
    </Wrapper>
  );
};

export default Timeline;
