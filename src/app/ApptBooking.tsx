import React, { useEffect, useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { CONFIG } from '../constant';
import { useCalendarState } from '../hook';
import { EStatus, TAppointmentForApp } from '../model';
import { AppointmentUtils, ElementUtils, TimeUtils } from '../util';
import { Flex } from './common';

const Wrapper = styled.div<{ $status: EStatus }>`
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  border: 1px solid ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  border-radius: 4px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  cursor: pointer;
  position: absolute;
  &:hover {
    box-shadow: 0 3px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
  }
  &.drag {
    box-shadow: 0 10px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
    cursor: move;
    z-index: 50;
  }
  &.resize {
    z-index: 50;
  }
`;

const Content = styled(Flex)`
  padding: 3px 4px 3px 8px;
  pointer-events: none;
`;

const Resize = styled.div`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: 0;
  cursor: row-resize;
  z-index: 11;
`;

type TApptBooking = {
  value: TAppointmentForApp;
  scrollEl: HTMLDivElement | null;
  mousePosition: { top: number; left: number; pageY: number; pageX: number };
  widthTimeline: number;
  onPressAppt: (value: TAppointmentForApp) => void;
  onReleaseAppt: (id: string, startTime: number, duration: number) => void;
  onFireEvent: (value: boolean) => void;
};

const ApptBooking: React.FC<TApptBooking> = ({
  value,
  scrollEl,
  mousePosition,
  widthTimeline,
  onPressAppt,
  onReleaseAppt,
  onFireEvent,
}) => {
  const calendarState = useCalendarState();

  const isDragRef = useRef(false);
  const isResizeRef = useRef(false);
  const origDeltaX = useRef(0);
  const origDeltaY = useRef(0);
  const lastMouseTopPosition = useRef(0);
  const topEdgeRef = useRef(0);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const removeAutoScrollInterval = useRef(() => {});
  const preventDragEvent = useRef(() => {});

  const autoScrollThreshold = useRef(value.height / 5); // threshold to start auto scroll
  const floorY = Math.floor(mousePosition.pageY / CONFIG.CSS.LINE_HEIGHT) * CONFIG.CSS.LINE_HEIGHT;

  // initial position when calculated by the layout algorithm
  const [position, setPosition] = useState({ top: value.top, left: value.left });
  const [size, setSize] = useState({ width: value.width, height: value.height });

  const lineIdx = position.top / CONFIG.CSS.LINE_HEIGHT;
  const startTime = lineIdx * calendarState.duration + calendarState.dayTime.start;
  const endTimeByDragging = startTime + ((value.height + 1) * calendarState.duration) / CONFIG.CSS.LINE_HEIGHT;
  const endTimeByResizing = startTime + ((size.height + 1) * calendarState.duration) / CONFIG.CSS.LINE_HEIGHT;
  const newStartTime = isDragRef.current ? startTime : value.startTime;
  const newEndTime = isDragRef.current ? endTimeByDragging : isResizeRef.current ? endTimeByResizing : value.endTime;
  /* let newEndTime = 0;
  if (isDragRef.current) newEndTime = endTimeByDragging;
  else if (isResizeRef.current) newEndTime = endTimeByResizing;
  else newEndTime = value.endTime; */

  const updatedStartTime = TimeUtils.convertSecondsToHourString(newStartTime);
  const updatedEndTime = TimeUtils.convertSecondsToHourString(newEndTime);
  const updatedWidth = isDragRef.current ? widthTimeline : size.width;
  const updatedLeft = isDragRef.current ? mousePosition.left : position.left;
  const updatedHeight = isResizeRef.current ? size.height : value.height;

  const calendarHeight = calendarRef.current?.offsetHeight || 0;

  const scrollBarHeight = scrollEl?.offsetHeight || 0;
  const maxScrollY = scrollEl?.scrollHeight || 0;

  // distance from mouse to
  const distanceUp = mousePosition.top - origDeltaY.current;
  const distanceLeft = mousePosition.left - origDeltaX.current;
  const distanceDown = mousePosition.top + (value.height - origDeltaY.current);

  const steps = TimeUtils.calcTimeStep(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration);
  const maxGridHeight = steps * CONFIG.CSS.LINE_HEIGHT;

  /* handle drag event */
  const onStartDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventDragEvent.current = TimeUtils.wrapperSetTimeout(() => {
      isDragRef.current = true;
      onFireEvent(true);
      (e.target as HTMLDivElement).classList.add('drag');
    }, 250);

    origDeltaX.current = mousePosition.left - position.left;
    origDeltaY.current = mousePosition.top - position.top;

    // save data for later use
    topEdgeRef.current = ElementUtils.getOffsetToDocument(e.currentTarget, 'top');
    calendarRef.current = ElementUtils.getParentNodeFrom(
      e.currentTarget,
      CONFIG.DATA_IDTF.CALENDAR
    ) as HTMLDivElement | null;

    onPressAppt({ ...value, top: position.top, left: position.left });
  };

  const onEndDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // if still false means the user is not drag at all, just click
    if (isDragRef.current === false) preventDragEvent.current && preventDragEvent.current();
    else {
      isDragRef.current = false;
      onFireEvent(false);
      (e.target as HTMLDivElement).classList.remove('drag');
      onReleaseAppt(value.id, startTime, value.duration);
    }
  };

  const onDragging = useCallback(() => {
    let currScrollBarTop = scrollEl?.scrollTop || 0;
    let curApptTop = position.top;

    // touch the edge of top
    if (distanceUp <= 0) {
      setPosition({
        top: 0,
        left: distanceLeft,
      });
    }
    // touch the edge of botoom
    else if (distanceDown >= maxGridHeight) {
      setPosition({
        top: maxGridHeight - value.height,
        left: distanceLeft,
      });
    } else {
      /* auto scroll to top while dragging if match condition */
      // ================ TOP ================
      if (floorY - autoScrollThreshold.current <= topEdgeRef.current && scrollEl) {
        removeAutoScrollInterval.current && removeAutoScrollInterval.current();

        removeAutoScrollInterval.current = TimeUtils.wrapperSetInterval(() => {
          currScrollBarTop -= CONFIG.SPEED;
          curApptTop -= CONFIG.SPEED;

          setPosition((prev) => ({
            ...prev,
            top: curApptTop,
          }));

          if (currScrollBarTop <= 0 || position.top <= 0) {
            currScrollBarTop = 0;
            setPosition((prev) => ({
              ...prev,
              top: 0,
            }));

            removeAutoScrollInterval.current && removeAutoScrollInterval.current();
          }

          scrollEl.scrollTop = currScrollBarTop;
        }, CONFIG.FPS);
      }
      // ================ BOTTOM ================
      else if (floorY + autoScrollThreshold.current >= calendarHeight && scrollEl) {
        removeAutoScrollInterval.current && removeAutoScrollInterval.current();

        removeAutoScrollInterval.current = TimeUtils.wrapperSetInterval(() => {
          currScrollBarTop += CONFIG.SPEED;
          curApptTop += CONFIG.SPEED;
          setPosition((prev) => ({
            ...prev,
            top: curApptTop,
          }));

          if (currScrollBarTop + scrollBarHeight >= maxScrollY || position.top + value.height >= maxGridHeight) {
            currScrollBarTop = maxScrollY - scrollBarHeight;
            setPosition((prev) => ({
              ...prev,
              top: maxGridHeight - value.height,
            }));
            removeAutoScrollInterval.current && removeAutoScrollInterval.current();
          }

          scrollEl.scrollTop = currScrollBarTop;
        }, CONFIG.FPS);
      } else {
        removeAutoScrollInterval.current && removeAutoScrollInterval.current();
        setPosition({
          top: distanceUp,
          left: distanceLeft,
        });
      }
    }
  }, [
    value.height,
    autoScrollThreshold,
    floorY,
    position.top,
    scrollEl,
    calendarHeight,
    distanceDown,
    distanceLeft,
    distanceUp,
    maxGridHeight,
    maxScrollY,
    scrollBarHeight,
  ]);
  /* handle drag event */

  /* handle resize event */
  const onStartResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // prevent to fire a drag event on parent div
    isResizeRef.current = true;
    onFireEvent(true);
    if (e.currentTarget && e.currentTarget.parentElement) {
      e.currentTarget.parentElement.classList.add('resize');
    }

    lastMouseTopPosition.current = mousePosition.top;
  };

  const onResizing = useCallback(() => {
    const distance = lastMouseTopPosition.current - mousePosition.top;
    const newHeight = value.height - distance;
    setSize((s) => ({ ...s, height: newHeight }));
  }, [mousePosition.top, value.height]);

  const onEndResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // prevent to fire a drag event on parent div
    isResizeRef.current = false;
    onFireEvent(false);
    if (e.currentTarget && e.currentTarget.parentElement) {
      e.currentTarget.parentElement.classList.remove('resize');
    }

    const newDuration = TimeUtils.convertHeightToDuration(
      size.height + 1,
      CONFIG.CSS.LINE_HEIGHT,
      calendarState.duration
    );
    onReleaseAppt(value.id, startTime, newDuration);
  };
  /* handle resize event */

  // re-render the first position of appt
  useEffect(() => {
    setSize({ width: value.width, height: value.height });
    setPosition({ top: value.top, left: value.left });
  }, [value.width, value.height, value.top, value.left]);

  // when move mouse around
  useEffect(() => {
    if (isDragRef.current) {
      onDragging();
    } else if (isResizeRef.current) {
      onResizing();
    }
  }, [onDragging, onResizing]);

  return (
    <Wrapper
      data-idtf={CONFIG.DATA_IDTF.APPT_BOOKING}
      $status={value.status}
      style={{
        transform: `translateX(${updatedLeft}px) translateY(${position.top}px)`,
        width: updatedWidth,
        height: updatedHeight,
      }}
      onMouseDown={onStartDragging}
      onMouseUp={onEndDragging}
    >
      <Content $dir={'column'}>
        <div>
          {updatedStartTime}-{updatedEndTime}
        </div>
        <div>{value.title}</div>
        <div>{value.content}</div>
      </Content>
      <Resize data-idtf={CONFIG.DATA_IDTF.APPT_RESIZE} onMouseDown={onStartResize} onMouseUp={onEndResize}></Resize>
    </Wrapper>
  );
};

export default ApptBooking;
