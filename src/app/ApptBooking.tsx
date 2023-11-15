import React, { useEffect, useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EStatus, TAppointmentForApp } from '../model';
import { Flex } from './common';
import { AppointmentUtils, ElementUtils, TimeUtils } from '../util';
import { useCalendarState } from '../hook';
import { CONFIG } from '../constant';

const Wrapper = styled.div<{ $status: EStatus }>`
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  border: 1px solid ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  border-radius: 4px;
  text-align: left;

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
`;

const Content = styled(Flex)`
  padding: 3px 4px 3px 8px;
  pointer-events: none;
`;

type TApptBooking = {
  value: TAppointmentForApp;
  scrollEl: HTMLDivElement | null;
  mousePosition: { top: number; left: number; pageY: number; pageX: number };
  widthTimeline: number;
  onPressAppt: (value: TAppointmentForApp) => void;
  onReleaseAppt: (id: string, startTime: number) => void;
};

const ApptBooking: React.FC<TApptBooking> = ({
  value,
  scrollEl,
  mousePosition,
  widthTimeline,
  onPressAppt,
  onReleaseAppt,
}) => {
  const calendarState = useCalendarState();

  const isTouchRef = useRef(false);
  const origDeltaX = useRef(0);
  const origDeltaY = useRef(0);
  const topEdgeRef = useRef(0);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const removeAutoScrollInterval = useRef(() => {});

  const autoScrollThreshold = useRef(value.height / 5); // threshold to start auto scroll
  const floorY = Math.floor(mousePosition.pageY / CONFIG.CSS.LINE_HEIGHT) * CONFIG.CSS.LINE_HEIGHT;

  // initial position when calculated by the layout algorithm
  const [position, setPosition] = useState({ top: value.top, left: value.left });

  const lineIdx = position.top / CONFIG.CSS.LINE_HEIGHT;
  const startTime = lineIdx * calendarState.duration + calendarState.dayTime.start;
  const endTime = startTime + ((value.height + 1) * calendarState.duration) / CONFIG.CSS.LINE_HEIGHT;
  const newStartTime = isTouchRef.current ? startTime : value.startTime;
  const newEndTime = isTouchRef.current ? endTime : value.endTime;

  const updatedStartTime = TimeUtils.convertSecondsToHourString(newStartTime);
  const updatedEndTime = TimeUtils.convertSecondsToHourString(newEndTime);
  const updatedWidth = isTouchRef.current ? widthTimeline : value.width;
  const updatedLeft = isTouchRef.current ? mousePosition.left : position.left;

  const calendarHeight = calendarRef.current?.offsetHeight || 0;

  const offsetScrollY = scrollEl?.offsetHeight || 0;
  const maxScrollY = scrollEl?.scrollHeight || 0;

  // distance from mouse to
  const distanceUp = mousePosition.top - origDeltaY.current;
  const distanceLeft = mousePosition.left - origDeltaX.current;
  const distanceDown = mousePosition.top + (value.height - origDeltaY.current);

  const steps = TimeUtils.calcTimeStep(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration);
  const maxGridHeight = steps * CONFIG.CSS.LINE_HEIGHT;

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = true;

    origDeltaX.current = mousePosition.left - position.left;
    origDeltaY.current = mousePosition.top - position.top;

    (e.target as HTMLDivElement).classList.add('drag');

    removeAutoScrollInterval.current && removeAutoScrollInterval.current();

    // save data for later use
    topEdgeRef.current = ElementUtils.getOffsetToDocument(e.currentTarget, 'top');
    calendarRef.current = ElementUtils.getParentNodeFrom(
      e.currentTarget,
      CONFIG.DATA_IDTF.CALENDAR
    ) as HTMLDivElement | null;

    onPressAppt({ ...value, top: position.top, left: position.left });
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = false;

    (e.target as HTMLDivElement).classList.remove('drag');

    onDragging();

    onReleaseAppt(value.id, startTime);
  };

  const onDragging = useCallback(() => {
    let currScrollY = scrollEl?.scrollTop || 0;
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
          currScrollY -= CONFIG.SPEED;
          curApptTop -= CONFIG.SPEED;

          setPosition((prev) => ({
            ...prev,
            top: curApptTop,
          }));

          if (currScrollY <= 0 || position.top <= 0) {
            currScrollY = 0;
            setPosition((prev) => ({
              ...prev,
              top: 0,
            }));

            removeAutoScrollInterval.current && removeAutoScrollInterval.current();
          }

          scrollEl.scrollTop = currScrollY;
        }, CONFIG.FPS);
      }
      // ================ BOTTOM ================
      else if (floorY + autoScrollThreshold.current >= calendarHeight && scrollEl) {
        removeAutoScrollInterval.current && removeAutoScrollInterval.current();

        removeAutoScrollInterval.current = TimeUtils.wrapperSetInterval(() => {
          currScrollY += CONFIG.SPEED;
          curApptTop += CONFIG.SPEED;
          setPosition((prev) => ({
            ...prev,
            top: curApptTop,
          }));

          if (currScrollY + offsetScrollY >= maxScrollY || position.top + value.height >= maxGridHeight) {
            currScrollY = maxScrollY - offsetScrollY;
            setPosition((prev) => ({
              ...prev,
              top: maxGridHeight - value.height,
            }));
            removeAutoScrollInterval.current && removeAutoScrollInterval.current();
          }

          scrollEl.scrollTop = currScrollY;
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
    offsetScrollY,
  ]);

  // re-render the first position of appt
  useEffect(() => {
    setPosition({ top: value.top, left: value.left });
  }, [value.top, value.left]);

  // when move mouse around
  useEffect(() => {
    if (isTouchRef.current) {
      onDragging();
    }
  }, [onDragging]);

  return (
    <Wrapper
      data-idtf={CONFIG.DATA_IDTF.APPT_BOOKING}
      $status={value.status}
      style={{
        transform: `translateX(${updatedLeft}px) translateY(${position.top}px)`,
        width: updatedWidth,
        height: value.height,
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <Content $dir={'column'}>
        <div>
          {updatedStartTime}-{updatedEndTime}
        </div>
        <div>{value.title}</div>
        <div>{value.content}</div>
      </Content>
    </Wrapper>
  );
};

export default ApptBooking;
