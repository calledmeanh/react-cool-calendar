import React, { useCallback } from 'react';
import styled from 'styled-components';
import { AppointmentUtils, DateUtils, TimeUtils } from '../util';
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

  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
  const widthTimeline = parentWidth / dateline.length;

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
        return <Appointment key={appt.id} value={appt} />;
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
        return <Appointment key={appt.id} value={appt} />;
      });
    }
  };

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
    <Wrapper data-idtf={'grid'}>
      <NowIndicator type={'LINE'} parentWidth={parentWidth} />
      <Ghost parentWidth={parentWidth} />

      {renderAppt(calendarState.appointments)}

      {renderRow()}
    </Wrapper>
  );
};

export default Grid;
