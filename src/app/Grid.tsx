import React, { useState } from 'react';
import styled from 'styled-components';
import NowIndicator from './NowIndicator';
import Ghost from './Ghost';
import Appointment from './Appointment';
import Row from './Row';
import { useCalendarState } from '../hook';
import { DateUtils, ElementUtils, TimeUtils } from '../util';

const Wrapper = styled.div`
  touch-action: pan-y;
  position: relative;
  background-size: 8px 8px;
  background-image: linear-gradient(
    45deg,
    transparent 46%,
    rgba(16, 25, 40, 0.2) 49%,
    rgba(16, 25, 40, 0.2) 51%,
    transparent 55%
  );
  background-color: #eef0f2;
  box-shadow: -2px 0px 4px 0px rgba(164, 173, 186, 0.5);
`;

type TGrid = { parentWidth: number };

const Grid: React.FC<TGrid> = ({ parentWidth }) => {
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

    const gridEl = e.currentTarget;
    const dataIdtf = (e.target as HTMLElement).getAttribute('data-idtf');
    if (dataIdtf === 'appt') {
      setShowGhost(false);
    }

    const leftOutside: number = ElementUtils.getOffsetToDocument(gridEl, 'left');
    const topOutside: number = ElementUtils.getOffsetToDocument(gridEl, 'top');

    const scrollEl = gridEl.parentElement?.parentElement;
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
    <Wrapper data-idtf={'grid'} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <NowIndicator type={'LINE'} parentWidth={parentWidth} />
      {isShowGhost && <Ghost value={ghost} />}
      <Appointment parentWidth={parentWidth} />
      <Row />
    </Wrapper>
  );
};

export default Grid;
