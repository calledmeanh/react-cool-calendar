import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EAction, EStatus, TAppointmentForApp } from '../model';
import { Flex } from './common';
import { AppointmentUtils, DateUtils, TimeUtils } from '../util';
import { useCalendarDispatch, useCalendarState } from '../hook';
import dayjs from 'dayjs';

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
  onCreateClone: (value: TAppointmentForApp) => void;
  onDeleteClone: (id: string) => void;
};

const ApptBooking: React.FC<TApptBooking> = ({ value, mousePosition, widthTimeline, onCreateClone, onDeleteClone }) => {
  const calendarState = useCalendarState();
  const dispath = useCalendarDispatch();

  const isTouchRef = useRef(false);
  const shiftXRef = useRef(0);
  const shiftYRef = useRef(0);

  // vị trí ban đầu khi được tính toán xong bởi thuật toán layout
  const [position, setPosition] = useState({ top: value.top, left: value.left });

  const startStr = TimeUtils.convertSecondsToHourString(value.startTime);
  const endStr = TimeUtils.convertSecondsToHourString(value.endTime);

  const lineIdx = position.top / 24;
  const startTime = lineIdx * calendarState.duration + calendarState.dayTime.start;
  const { startTimeStr, endTimeStr } = AppointmentUtils.getApptTime(
    startTime,
    calendarState.duration,
    24,
    value.height,
    calendarState.timeType
  );

  const updatedWidth = isTouchRef.current ? widthTimeline : value.width;
  const updatedLeft = isTouchRef.current ? mousePosition.left : position.left;
  const updatedStartTime = isTouchRef.current ? startTimeStr : startStr;
  const updatedEndTime = isTouchRef.current ? endTimeStr : endStr;

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = true;

    shiftXRef.current = mousePosition.left - position.left;
    shiftYRef.current = mousePosition.top - position.top;

    (e.target as HTMLElement).classList.add('drag');

    onCreateClone({ ...value, top: position.top, left: position.left });
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = false;

    setPosition({
      top: mousePosition.top - shiftYRef.current,
      left: mousePosition.left - shiftXRef.current,
    });

    (e.target as HTMLElement).classList.remove('drag');

    onDeleteClone(value.id);

    /* 
      TODO: update appt when finish drag
      Hiện tại chức năng kéo và thả về mặt cơ bản là đã xong (thay đổi vị trí top,left & start,end)
      Tiếp theo là refactor code của 2 Appointment và ApptBooking
        - Chuyển hết logic xử lý drag & drop về Appointment
        - ApptBooking chỉ có nhiệm vụ là nhận dữ liệu truyền đến và hiện
      Sau đó refactor lại toàn bộ code để nắm trc khi làm feature tiếp theo
    */
    const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
    const newWeekColIdx = Math.round(mousePosition.left / widthTimeline);
    const dayCustom = dateline[newWeekColIdx];
    const payload = {
      startTime,
      createdAt: dayCustom.origin,
    };

    let apptCopy = calendarState.appointments.slice();
    for (let i = 0; i < apptCopy.length; i++) {
      if (value.id === apptCopy[i].id) {
        apptCopy[i] = {
          ...apptCopy[i],
          ...payload,
        };
        break;
      }
    }

    dispath({ type: EAction.UPDATE_APPT, payload: apptCopy });
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
