import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EStatus, TAppointmentForApp } from '../model';
import { Flex } from './common';
import { AppointmentUtils, TimeUtils, clsx } from '../util';

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
  const isTouchRef = useRef(false);
  const shiftXRef = useRef(0);
  const shiftYRef = useRef(0);

  // vị trí ban đầu khi được tính toán xong bởi thuật toán layout
  const [position, setPosition] = useState({ top: value.top, left: value.left });

  const start = TimeUtils.convertSecondsToHourString(value.startTime);
  const end = TimeUtils.convertSecondsToHourString(value.endTime);

  let classname = clsx({
    drag: false,
  });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setTimeout(() => {
      isTouchRef.current = true;

      shiftXRef.current = mousePosition.left - position.left;
      shiftYRef.current = mousePosition.top - position.top;

      (e.target as HTMLElement).classList.add('drag');

      onCreateClone({ ...value, top: position.top, left: position.left });
    }, 250);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = false;

    setPosition({
      top: mousePosition.top - shiftYRef.current,
      left: mousePosition.left - shiftXRef.current,
    });

    (e.target as HTMLElement).classList.remove('drag');

    onDeleteClone(value.id);
  };

  useEffect(() => {
    setPosition({ top: value.top, left: value.left });
  }, [value.top, value.left]);

  useEffect(() => {
    if (isTouchRef.current) {
      setPosition({
        top: mousePosition.top - shiftYRef.current,
        left: mousePosition.left - shiftXRef.current,
      });
    }
  }, [mousePosition.left, mousePosition.top]);

  const updatedWidth = isTouchRef.current ? widthTimeline : value.width;
  const updatedLeft = isTouchRef.current ? mousePosition.left : position.left;
  // TODO: làm tiếp tục với thời gian appt
  return (
    <Wrapper
      data-idtf={'appt-booking'}
      $status={value.status}
      style={{
        transform: `translateX(${updatedLeft}px) translateY(${position.top}px)`,
        width: updatedWidth,
        height: value.height,
      }}
      className={classname}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <Content $dir={'column'}>
        <div>
          {start}-{end}
        </div>
        <div>{value.title}</div>
        <div>{value.content}</div>
      </Content>
    </Wrapper>
  );
};

export default ApptBooking;
