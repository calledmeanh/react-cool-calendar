import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EStatus, TAppointmentForApp, TAppointmentForUser } from '../model';
import { Flex } from './common';
import { AppointmentUtils, DateUtils, TimeUtils } from '../util';
import { useCalendarState } from '../hook';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
`;

type TAppointment = {
  widthTimeline: number;
  mousePosition: { top: number; left: number };
};

// Appointment is the place to hold these "appt" down-belown
const Appointment: React.FC<TAppointment> = ({ widthTimeline, mousePosition }) => {
  const appointmentRef = useRef<HTMLDivElement | null>(null);
  const calendarState = useCalendarState();
  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

  const renderAppt = (apptProp: TAppointmentForUser[]) => {
    // appt origin
    let appts = apptProp.slice();

    if (calendarState.viewMode === 'DAY') {
      const showAppt = appts.filter((a) => {
        return DateUtils.isEqual(a.createdAt, calendarState.currentDate);
      });

      return AppointmentUtils.layoutAlgorithm(showAppt, {
        daytimeStart: calendarState.dayTime.start,
        duration: calendarState.duration,
        columnWidth: widthTimeline,
        weekcolumnIndex: 0,
      }).map((appt: TAppointmentForApp) => {
        return (
          <Appt
            key={appt.id}
            value={appt}
            mousePosition={mousePosition}
            onCreateClone={onCreateClone}
            onDeleteClone={onDeleteClone}
          />
        );
      });
    } else if (calendarState.viewMode === 'WEEK') {
      // iterate over the array to sort the appointment's "createdAt" attribute relative to the column
      const columnAppt: TAppointmentForUser[][] = [];
      dateline.forEach((d) => {
        const apptBox: TAppointmentForUser[] = [];
        appts.forEach((a) => {
          const res = DateUtils.isEqual(d.origin, a.createdAt);
          if (res) apptBox.push(a);
        });
        columnAppt.push(apptBox);
      });

      // iterate over the 2D-array and convert it to 1D-array with applied "layout algorithm"
      const showAppt: TAppointmentForApp[] = [];
      columnAppt.forEach((ca, i) => {
        const apptReodered = AppointmentUtils.layoutAlgorithm(ca, {
          daytimeStart: calendarState.dayTime.start,
          duration: calendarState.duration,
          columnWidth: widthTimeline,
          weekcolumnIndex: i,
        });
        showAppt.push(...apptReodered);
      });

      return showAppt.map((appt: TAppointmentForApp) => {
        return (
          <Appt
            key={appt.id}
            value={appt}
            mousePosition={mousePosition}
            onCreateClone={onCreateClone}
            onDeleteClone={onDeleteClone}
          />
        );
      });
    }
  };

  const onCreateClone = (el: HTMLElement) => {
    const nodeClone = el.cloneNode(true) as HTMLElement;
    if (appointmentRef && appointmentRef.current) {
      nodeClone.classList.add('clone');
      appointmentRef.current.insertBefore(nodeClone, el);
    }
  };

  const onDeleteClone = () => {
    // TODO: lam tiep delete
  };

  return (
    <Wrapper data-idtf={'appointment'} ref={appointmentRef}>
      {renderAppt(calendarState.appointments)}
    </Wrapper>
  );
};

// appt children
const Container = styled.div<{ $status: EStatus }>`
  border: 1px solid black;
  // background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  background: #a5dff8;
  border-color: #a5dff8;
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
  transition: transform 0.15s cubic-bezier(0, 0, 1, 1);
  &:hover {
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 25%);
  }
  &.dragging {
    box-shadow: 0 10px 5px 0 rgb(0 0 0 / 25%);
    cursor: move;
    z-index: 50;
  }
  &.clone {
    background: #fff;
    border: 1px solid #a5dff8;
    opacity: 0.5;
  }
`;

const Content = styled(Flex)`
  padding: 3px 4px 3px 8px;
  pointer-events: none;
`;

type TAppt = {
  value: TAppointmentForApp;
  mousePosition: { top: number; left: number };
  onCreateClone: (el: HTMLElement) => void;
  onDeleteClone: () => void;
};

const Appt: React.FC<TAppt> = ({ value, mousePosition, onCreateClone, onDeleteClone }) => {
  const isTouchRef = useRef(false);
  const shiftXRef = useRef(0);
  const shiftYRef = useRef(0);

  const [position, setPosition] = useState({ top: value.top, left: value.left }); // vị trí ban đầu khi được tính toán xong bởi thuật toán layout

  const start = TimeUtils.convertSecondsToHourString(value.startTime);
  const end = TimeUtils.convertSecondsToHourString(value.endTime);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setTimeout(() => {
      isTouchRef.current = true;

      shiftXRef.current = mousePosition.left - position.left;
      shiftYRef.current = mousePosition.top - position.top;

      const apptEl = e.target as HTMLElement;
      apptEl.classList.add('dragging');
      apptEl.id = 'appt-drag';
      onCreateClone(apptEl);
    }, 250);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isTouchRef.current = false;

    setPosition({
      top: mousePosition.top - shiftYRef.current,
      left: mousePosition.left - shiftXRef.current,
    });

    (e.target as HTMLElement).classList.remove('dragging');
    onDeleteClone();
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

  return (
    <Container
      data-idtf={'appt'}
      $status={value.status}
      // di chuyen rect vao style thay vi css
      style={{
        transform: `translateX(${position.left}px) translateY(${position.top}px)`,
        width: value.width,
        height: value.height,
      }}
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
    </Container>
  );
};

export default Appointment;
