import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EStatus, TAppointmentForApp } from '../model';
import { Flex } from './common';
import { AppointmentUtils, TimeUtils } from '../util';
import { useCalendarDispatch, useCalendarState } from '../hook';

const Wrapper = styled.div<{ $status: EStatus }>`
  // background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)}

  background: #a5dff8;
  border: 1px solid #a5dff8;

  color: #101928;
  font-size: 12px;
  line-height: 16px;
  border-radius: 4px;
  text-align: left;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  cursor: pointer;
  position: absolute;
  transition: transform 0.15s cubic-bezier(0, 0, 1, 1), width 0.15s cubic-bezier(0, 0, 1, 1);
  &:hover {
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 25%);
  }
  &.drag {
    box-shadow: 0 10px 5px 0 rgb(0 0 0 / 25%);
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
  mousePosition: { top: number; left: number };
  widthTimeline: number;
  onPressAppt: (value: TAppointmentForApp) => void;
  onReleaseAppt: (id: string, startTime: number) => void;
};

const ApptBooking: React.FC<TApptBooking> = ({ value, mousePosition, widthTimeline, onPressAppt, onReleaseAppt }) => {
  const calendarState = useCalendarState();

  const isTouchRef = useRef(false);
  const shiftXRef = useRef(0);
  const shiftYRef = useRef(0);

  // vị trí ban đầu khi được tính toán xong bởi thuật toán layout
  const [position, setPosition] = useState({ top: value.top, left: value.left });

  const lineIdx = position.top / 24;
  const startTime = lineIdx * calendarState.duration + calendarState.dayTime.start;
  const endTime = startTime + ((value.height + 1) * calendarState.duration) / 24; // vi da -1 height nen phai +1 lai
  const newStartTime = isTouchRef.current ? startTime : value.startTime;
  const newEndTime = isTouchRef.current ? endTime : value.endTime;

  const updatedStartTime = TimeUtils.convertSecondsToHourString(newStartTime);
  const updatedEndTime = TimeUtils.convertSecondsToHourString(newEndTime);
  const updatedWidth = isTouchRef.current ? widthTimeline : value.width;
  const updatedLeft = isTouchRef.current ? mousePosition.left : position.left;

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = true;

    shiftXRef.current = mousePosition.left - position.left;
    shiftYRef.current = mousePosition.top - position.top;

    (e.target as HTMLElement).classList.add('drag');

    onPressAppt({ ...value, top: position.top, left: position.left });
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = false;

    setPosition({
      top: mousePosition.top - shiftYRef.current,
      left: mousePosition.left - shiftXRef.current,
    });

    (e.target as HTMLElement).classList.remove('drag');

    onReleaseAppt(value.id, startTime);
  };

  // re-render the position of appt
  useEffect(() => {
    setPosition({ top: value.top, left: value.left });
  }, [value.top, value.left]);

  // when move mouse around
  useEffect(() => {
    if (isTouchRef.current) {
      setPosition({
        top: mousePosition.top - shiftYRef.current,
        left: mousePosition.left - shiftXRef.current,
      });
    }
  }, [mousePosition.left, mousePosition.top]);

  return (
    <Wrapper
      data-idtf={'appt-booking'}
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
