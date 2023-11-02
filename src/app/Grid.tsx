import React, { useEffect, useRef, useState } from 'react';
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

const Grid: React.FC = () => {
  const calendarState = useCalendarState();

  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [timeEachCell, setTimeEachCell] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isShowGhost, setShowGhost] = useState(false);

  const leftOutsideRef = useRef(0);
  const topOutsideRef = useRef(0);

  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
  const widthTimeline = gridWidth / dateline.length;

  /*
    pageX,Y are relative to the top left corner of the whole rendered page (including parts hidden by scrolling)
    clientX, Y are relative to the top left corner of the visible part of the page, "seen" through browser window
    screenX,Y are relative to the physical screen 
  */
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isShowGhost) setShowGhost(true);

    const gridEl = e.currentTarget;
    const dataIdtf = (e.target as HTMLElement).getAttribute('data-idtf');
    if (dataIdtf === 'appt-booking') {
      setShowGhost(false);
    }

    const scrollEl = gridEl.parentElement?.parentElement;
    const scroll = {
      top: scrollEl ? scrollEl.scrollTop : 0,
      left: scrollEl ? scrollEl.scrollLeft : 0,
    };

    const offsetX: number = e.pageX - leftOutsideRef.current + scroll.left;
    const offsetY: number = e.pageY - topOutsideRef.current + scroll.top;

    const colIdx: number = Math.floor(offsetX / widthTimeline);
    const lineIdx = Math.floor(offsetY / 24); // 24 is the height of line, hardcode for now

    const top: number = lineIdx * 24;
    const left: number = colIdx * widthTimeline;

    const seconds = lineIdx * calendarState.duration + calendarState.dayTime.start;
    const time = TimeUtils.convertSecondsToHourString(seconds, calendarState.timeType);

    setPosition({ top, left });
    setTimeEachCell(time);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowGhost(false);
  };

  useEffect(() => {
    if (gridRef && gridRef.current) {
      setGridWidth(gridRef.current.offsetWidth);
      leftOutsideRef.current = ElementUtils.getOffsetToDocument(gridRef.current, 'left');
      topOutsideRef.current = ElementUtils.getOffsetToDocument(gridRef.current, 'top');
    }
  }, []);

  return (
    <Wrapper data-idtf={'grid'} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} ref={gridRef}>
      <NowIndicator type={'LINE'} widthTimeline={widthTimeline} />
      {isShowGhost && (
        <Ghost
          timeEachCell={timeEachCell}
          rect={{ top: position.top, left: position.left, width: widthTimeline, height: 24 }}
        />
      )}
      <Appointment widthTimeline={widthTimeline} mousePosition={position} />
      <Row />
    </Wrapper>
  );
};

export default Grid;
