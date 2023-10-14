import React, { useState } from 'react';
import styled from 'styled-components';
import NowIndicator from './NowIndicator';
import Ghost from './Ghost';
import Appointment from './Appointment';
import Row from './Row';
import { useCalendarState } from '../hook';
import { ElementUtils, TimeUtils } from '../util';

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

type TGrid = { widthTimeline: number };

const Grid: React.FC<TGrid> = ({ widthTimeline }) => {
  const calendarState = useCalendarState();

  const [time, setTime] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isShowGhost, setShowGhost] = useState(false);

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

    const colIdx: number = Math.floor(offsetX / element.width);
    const lineIdx = Math.floor(offsetY / element.height); // 24 is the height of line, hardcode for now

    const top: number = lineIdx * element.height;
    const left: number = colIdx * element.width;

    const seconds = lineIdx * calendarState.duration + calendarState.dayTime.start;
    const time = TimeUtils.convertSecondsToHourString(seconds, calendarState.timeType);

    setPosition({ top, left });
    setTime(time);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowGhost(false);
  };

  return (
    <Wrapper data-idtf={'grid'} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <NowIndicator type={'LINE'} widthTimeline={widthTimeline} />
      {isShowGhost && (
        <Ghost
          time={time}
          rect={{ top: position.top, left: position.left, width: element.width, height: element.height }}
        />
      )}
      <Appointment widthTimeline={widthTimeline} mousePosition={position} />
      <Row />
    </Wrapper>
  );
};

export default Grid;
