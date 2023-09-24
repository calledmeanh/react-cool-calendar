import React, { useState } from 'react';
import { styled } from 'styled-components';
import { TRect } from '../model';
import { Flex } from './common';
import { useCalendarState } from '../hook';
import { DateUtils, ElementUtils, TimeUtils } from '../util';

const Wrapper = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
`;

const Cell = styled(Flex)<{ $rect: TRect }>`
  width: ${(props) => props.$rect.width}px;
  height: ${(props) => props.$rect.height}px;
  transform: translateX(${(props) => props.$rect.left}px) translateY(${(props) => props.$rect.top}px);
  background: #68a6ec;
  color: #fff;
  position: absolute;
`;

const Ghost: React.FC<{ parentWidth: number }> = ({ parentWidth }) => {
  const calendarState = useCalendarState();
  const [ghost, setGhost] = useState({ rect: { width: 0, height: 0, top: 0, left: 0 }, time: '' });
  const [isShowGhost, setShowGhost] = useState(false);

  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
  const widthTimeline = parentWidth / dateline.length;
  const element = { width: widthTimeline, height: 24 };
  /*
    pageX,Y are relative to the top left corner of the whole rendered page (including parts hidden by scrolling)
    clientX, Y are relative to the top left corner of the visible part of the page, "seen" through browser window
    screenX,Y are relative to the physical screen 
  */
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isShowGhost) setShowGhost(true);

    const gridEl = e.currentTarget.parentElement;
    const leftOutside: number = ElementUtils.getOffsetToDocument(gridEl, 'left');
    const topOutside: number = ElementUtils.getOffsetToDocument(gridEl, 'top');

    const scrollEl = gridEl?.parentElement?.parentElement;
    const scroll = {
      top: scrollEl ? scrollEl.scrollTop : 0,
      left: scrollEl ? scrollEl.scrollLeft : 0,
    };

    const offsetX: number = e.pageX - leftOutside + scroll.left;
    const offsetY: number = e.pageY - topOutside + scroll.top;

    const lineIdx = Math.floor(offsetY / 24); // 24 is the height of line, hardcode for now
    const seconds = lineIdx * calendarState.duration + calendarState.dayTime.start;
    const time = TimeUtils.convertSecondsToHourString(seconds, calendarState.timeType);
    const rect = ElementUtils.calcRectFromMouse(offsetX, offsetY, element);

    setGhost({ rect, time });
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowGhost(false);
  };

  return (
    <Wrapper data-idtf={'ghost'} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {isShowGhost && <Cell $rect={ghost.rect}>{ghost.time}</Cell>}
    </Wrapper>
  );
};

export default Ghost;
