import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CONFIG } from '../constant';
import { useCalendarState } from '../hook';
import { DateUtils, ElementUtils, TimeUtils } from '../util';
import NowIndicator from './NowIndicator';
import Appointment from './Appointment';
import Ghost from './Ghost';
import Row from './Row';

const Wrapper = styled.div`
  touch-action: pan-y;
  position: relative;
  background-size: 8px 8px;
  background-image: linear-gradient(
    45deg,
    ${CONFIG.CSS.WT_COLORS.STROKE.SECONDARY} 46%,
    ${CONFIG.CSS.WT_COLORS.STROKE.PRIMARY},
    ${CONFIG.CSS.WT_COLORS.STROKE.PRIMARY} 51%,
    ${CONFIG.CSS.WT_COLORS.STROKE.SECONDARY} 55%
  );
  background-color: ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
  box-shadow: -2px 0px 4px 0px ${CONFIG.CSS.BOX_SHADOW_COLOR};
`;

const Grid: React.FC = () => {
  const calendarState = useCalendarState();

  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [timeEachCell, setTimeEachCell] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0, pageY: 0, pageX: 0 });
  const [isShowGhost, setShowGhost] = useState(false);
  const [isFireEvent, setFireEvent] = useState(false);

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
    if (dataIdtf === CONFIG.DATA_IDTF.APPT_BOOKING || dataIdtf === CONFIG.DATA_IDTF.APPT_RESIZE || isFireEvent) {
      setShowGhost(false);
    }

    const topOutside: number = ElementUtils.getOffsetToDocument(gridRef.current, 'top');
    const leftOutside: number = ElementUtils.getOffsetToDocument(gridRef.current, 'left');

    const offsetY: number = e.pageY - topOutside + (scrollEl?.scrollTop || 0);
    const offsetX: number = e.pageX - leftOutside + (scrollEl?.scrollLeft || 0);

    const lineIdx = Math.floor(offsetY / CONFIG.CSS.LINE_HEIGHT);
    const colIdx: number = Math.floor(offsetX / widthTimeline);

    const top: number = lineIdx * CONFIG.CSS.LINE_HEIGHT;
    const left: number = colIdx * widthTimeline;

    const seconds = lineIdx * calendarState.duration + calendarState.dayTime.start;
    const time = TimeUtils.convertSecondsToHourString(seconds, calendarState.timeType);

    setPosition({ top, left, pageY: e.pageY, pageX: e.pageX });
    setTimeEachCell(time);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => setShowGhost(false);
  /* disabled right click on grid */
  const onRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.preventDefault();
  
  const onFireEvent = (value: boolean) => setFireEvent(value);

  useEffect(() => {
    if (gridRef && gridRef.current && gridRef.current.parentElement) {
      setGridWidth(gridRef.current.offsetWidth);
      setScrollEl(gridRef.current.parentElement.parentElement as HTMLDivElement);
    }
  }, []);

  return (
    <Wrapper
      data-idtf={CONFIG.DATA_IDTF.GRID}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onContextMenu={onRightClick}
      ref={gridRef}
    >
      <NowIndicator type={'LINE'} widthTimeline={widthTimeline} />
      {isShowGhost && (
        <Ghost
          timeEachCell={timeEachCell}
          rect={{ top: position.top, left: position.left, width: widthTimeline, height: CONFIG.CSS.LINE_HEIGHT }}
        />
      )}
      <Appointment
        scrollEl={scrollEl}
        widthTimeline={widthTimeline}
        mousePosition={position}
        onFireEvent={onFireEvent}
      />
      <Row />
    </Wrapper>
  );
};

export default Grid;
