import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import NowIndicator from './NowIndicator';
import Ghost from './Ghost';
import Appointment from './Appointment';
import Row from './Row';
import { useCalendarState } from '../hook';
import { DateUtils, ElementUtils, TimeUtils } from '../util';
import { CONFIG } from '../constant';

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
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [timeEachCell, setTimeEachCell] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0, pageY: 0, pageX: 0 });
  const [isShowGhost, setShowGhost] = useState(false);

  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
  const widthTimeline = gridWidth / dateline.length;

  /*
    pageX,Y are relative to the top left corner of the whole rendered page (including parts hidden by scrolling)
    clientX, Y are relative to the top left corner of the visible part of the page, "seen" through browser window
    screenX,Y are relative to the physical screen 
  */
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isShowGhost) setShowGhost(true);

    const dataIdtf = (e.target as HTMLDivElement).getAttribute(CONFIG.DATA_IDTF.THIS);
    if (dataIdtf === CONFIG.DATA_IDTF.APPT_BOOKING) {
      setShowGhost(false);
    }

    const topOutside: number = ElementUtils.getOffsetToDocument(gridRef.current, 'top');
    const leftOutside: number = ElementUtils.getOffsetToDocument(gridRef.current, 'left');

    const offsetY: number = e.pageY - topOutside + (scrollEl?.scrollTop || 0);
    const offsetX: number = e.pageX - leftOutside + (scrollEl?.scrollLeft || 0);

    const lineIdx = Math.floor(offsetY / 24); // 24 is the height of line, hardcode for now
    const colIdx: number = Math.floor(offsetX / widthTimeline);

    const top: number = lineIdx * 24;
    const left: number = colIdx * widthTimeline;

    const seconds = lineIdx * calendarState.duration + calendarState.dayTime.start;
    const time = TimeUtils.convertSecondsToHourString(seconds, calendarState.timeType);

    setPosition({ top, left, pageY: e.pageY, pageX: e.pageX });
    setTimeEachCell(time);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowGhost(false);
  };

  useEffect(() => {
    if (gridRef && gridRef.current && gridRef.current.parentElement) {
      setGridWidth(gridRef.current.offsetWidth);
      setScrollEl(gridRef.current.parentElement.parentElement as HTMLDivElement);
    }
  }, []);

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.GRID} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} ref={gridRef}>
      <NowIndicator type={'LINE'} widthTimeline={widthTimeline} />
      {isShowGhost && (
        <Ghost
          timeEachCell={timeEachCell}
          rect={{ top: position.top, left: position.left, width: widthTimeline, height: 24 }}
        />
      )}
      <Appointment scrollEl={scrollEl} widthTimeline={widthTimeline} mousePosition={position} />
      <Row />
    </Wrapper>
  );
};

export default Grid;
