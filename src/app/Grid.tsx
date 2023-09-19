import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AppointmentUtils, DateUtils, ElementUtils, TimeUtils } from '../util';
import { clsx } from '../util';
import { Line } from './common';
import { useCalendarState } from '../hook';
import NowIndicator from './NowIndicator';
import Ghost from './Ghost';
import Appointment from './Appointment';
import { TAppointmentForUser, TAppointmentForApp } from '../model';

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

type TGrid = {
  parentWidth: number;
};

const Grid: React.FC<TGrid> = ({ parentWidth }) => {
  const calendarState = useCalendarState();
  const [ghost, setGhost] = useState({ rect: { width: 0, height: 0, top: 0, left: 0 }, time: '' });
  const [isShowGhost, setShowGhost] = useState(false);
  /*
    pageX,Y are relative to the top left corner of the whole rendered page (including parts hidden by scrolling)
    clientX, Y are relative to the top left corner of the visible part of the page, "seen" through browser window
    screenX,Y are relative to the physical screen 
  */
  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
  const widthTimeline = parentWidth / dateline.length;
  const element = { width: widthTimeline, height: 24 };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isShowGhost) setShowGhost(true);

    const gridEl = e.currentTarget;
    const leftOutside: number = ElementUtils.getOffsetToDocument(gridEl, 'left');
    const topOutside: number = ElementUtils.getOffsetToDocument(gridEl, 'top');

    const scrollEl = gridEl.parentElement?.parentElement;
    const scroll = {
      top: scrollEl ? scrollEl.scrollTop : 0,
      left: scrollEl ? scrollEl.scrollLeft : 0,
    };

    const offsetX: number = e.pageX - leftOutside + scroll.left;
    const offsetY: number = e.pageY - topOutside + scroll.top;

    const lineIdx = Math.floor(offsetY / 24); // 24 is the height of line, hardcode for now
    const seconds = lineIdx * calendarState.duration + calendarState.dayTime.start;

    const time = TimeUtils.convertSecondsToHourString(seconds, calendarState.timeType);
    const rect = ElementUtils.calcRectFromMouse(offsetX, offsetY, element);
    setGhost({ rect, time });
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowGhost(false);
  };

  const renderAppt = (apptProp: TAppointmentForUser[]) => {
    let appts = apptProp.slice();
    if (calendarState.viewMode === 'DAY') {
      appts = appts.filter((a) => {
        return DateUtils.isEqual(a.createdAt, calendarState.currentDate);
      });

      return AppointmentUtils.layoutAlgorithm(appts, {
        daytimeStart: calendarState.dayTime.start,
        duration: calendarState.duration,
        columnWidth: widthTimeline,
        datelineLength: dateline.length,
      }).map((appt: TAppointmentForApp) => {
        return <Appointment key={appt.id} value={appt} />;
      });
    } else if (calendarState.viewMode === 'WEEK') {
      /* 
        neu la week thi phai chinh lai cai vi tri left cua appts theo dung column
        loc appts theo dung ngay` trong tuan (tao. thanh` cai mang 2 chieu xong roi duyet no de hien len) -- checked
        sau do chay mang 2 chieu roi ap dung thuat toan layout algorithm events
      */
      const columnAppt: TAppointmentForUser[][] = [];
      // console.log('dateline:', dateline);
      dateline.forEach((d) => {
        const apptBox: TAppointmentForUser[] = [];
        appts.forEach((a) => {
          const res = DateUtils.isEqual(d.origin, a.createdAt);
          if (res) {
            apptBox.push(a);
          }
        });
        columnAppt.push(apptBox);
      });
      console.log('dateline.forEach ~ columnAppt:', columnAppt);
    }
  };

  /* {AppointmentUtils.layoutAlgorithm(calendarState.appointments, {
        daytimeStart: calendarState.dayTime.start,
        duration: calendarState.duration,
        columnWidth: widthTimeline,
        datelineLength: dateline.length,
      }).map((appt: TAppointmentForApp) => {
        return <Appointment key={appt.id} value={appt} />;
      })} */

  const renderRow = useCallback(() => {
    return TimeUtils.createTimes(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration).map(
      (t, i) => {
        const currentTime: number = calendarState.dayTime.start + i * calendarState.duration;
        const workingTime: boolean = TimeUtils.checkWorkingTime(
          calendarState.dayTime,
          calendarState.workingTime,
          currentTime
        );
        const groupTime: boolean = TimeUtils.checkGroupTime(calendarState.groupTime, calendarState.duration, i, 'top');
        const classname = clsx({
          wt: workingTime,
          gt: groupTime,
        });
        return <Line data-idtf={'line'} className={classname} key={i}></Line>;
      }
    );
  }, [calendarState.duration, calendarState.dayTime, calendarState.workingTime, calendarState.groupTime]);
  return (
    <Wrapper data-idtf={'grid'} /* onMouseMove={onMouseMove} */ onMouseLeave={onMouseLeave}>
      <NowIndicator type={'LINE'} parentWidth={parentWidth} />
      {isShowGhost && <Ghost value={{ ...ghost }} />}

      {renderAppt(calendarState.appointments)}

      {renderRow()}
    </Wrapper>
  );
};

export default Grid;
