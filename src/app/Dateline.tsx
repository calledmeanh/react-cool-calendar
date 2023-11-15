import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TimeUtils, clsx } from '../util';
import { DateUtils } from '../util';
import { Flex } from './common';
import { useCalendarState } from '../hook';
import { CONFIG } from '../constant';

const Wrapper = styled(Flex)`
  height: ${CONFIG.CSS.DATELINE_HEIGHT}px;
  background: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  position: sticky;
  top: 0;
  z-index: 4;
`;

const DatelineHeader = styled(Flex)<{ $afterPseudoHeight: number }>`
  flex: 1;
  background: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  font-weight: 500;
  cursor: pointer;
  position: relative;
  &:hover {
    background: ${CONFIG.CSS.DATELINE_COLORS.BG_HOVER};
    box-shadow: 0 3px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
  }
  &:active {
    box-shadow: none;
  }
  &::after {
    width: 1px;
    background: ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
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
  color: ${CONFIG.CSS.FONT_LIGHT_COLOR};
  &.today {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    background: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
    color: ${CONFIG.CSS.HIGHLIGHT_SECONDARY_COLOR};
  }
`;

const DatelineText = styled.div`
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  color: ${CONFIG.CSS.FONT_LIGHT_COLOR};
  text-transform: capitalize;
  &.today {
    color: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
  }
`;

const Dateline: React.FC = () => {
  const calendarState = useCalendarState();

  const steps = TimeUtils.calcTimeStep(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration);
  const maxGridHeight = steps * CONFIG.CSS.LINE_HEIGHT;

  const render = useCallback(() => {
    const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

    return dateline.map((d, i) => {
      const isToday: boolean = DateUtils.isEqual(d.origin, calendarState.todayGlobalIns);
      const classname = clsx({
        today: isToday,
      });
      return (
        <DatelineHeader key={i} $justify={'center'} $align={'center'} $afterPseudoHeight={maxGridHeight}>
          <DatelineNumber className={classname}>{d.number}</DatelineNumber>
          <DatelineText className={classname}>{d.text}</DatelineText>
        </DatelineHeader>
      );
    });
  }, [maxGridHeight, calendarState.viewMode, calendarState.currentDate, calendarState.todayGlobalIns]);

  return <Wrapper data-idtf={CONFIG.DATA_IDTF.DATELINE}>{render()}</Wrapper>;
};

export default Dateline;
