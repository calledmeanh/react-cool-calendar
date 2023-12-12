import React, { useState } from 'react';
import { styled } from 'styled-components';
import { CONFIG } from '../constant';
import { useCalendarDispatch, useCalendarState } from '../hook';
import {
  EAction,
  TAppointmentForApp,
  TAppointmentForUser,
  TCalendarAction,
  TCalendarStateForApp,
  TDateline,
  TDay,
} from '../model';
import { AppointmentUtils, DateUtils } from '../util';
import ApptBooking from './ApptBooking';
import ApptClone from './ApptClone';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
`;

type TAppointment = {
  scrollEl: HTMLDivElement | null;
  widthTimeline: number;
  mousePosition: { top: number; left: number; pageY: number; pageX: number };
  onFireEvent: (value: boolean) => void;
};

const Appointment: React.FC<TAppointment> = ({ scrollEl, widthTimeline, mousePosition, onFireEvent }) => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dispath: React.Dispatch<TCalendarAction> = useCalendarDispatch();
  const [apptClone, setApptClone] = useState<TAppointmentForApp | null>(null);

  const dateline: TDateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

  const render = (apptProp: TAppointmentForUser[]) => {
    // appt origin
    let apptCopy: TAppointmentForUser[] = apptProp.slice();

    if (calendarState.viewMode === 'DAY') {
      const apptByDate: TAppointmentForUser[] = apptCopy.filter((a) => {
        return DateUtils.isEqual(a.createdAt, calendarState.currentDate);
      });

      return AppointmentUtils.layoutAlgorithm(apptByDate, {
        daytimeStart: calendarState.dayTime.start,
        duration: calendarState.duration,
        columnWidth: widthTimeline,
        weekcolumnIndex: 0,
      }).map((appt: TAppointmentForApp) => {
        return (
          <ApptBooking
            key={appt.id}
            value={appt}
            scrollEl={scrollEl}
            widthTimeline={widthTimeline}
            mousePosition={mousePosition}
            onPressAppt={onPressAppt}
            onReleaseAppt={onReleaseAppt}
            onFireEvent={onFireEvent}
          />
        );
      });
    } else if (calendarState.viewMode === 'WEEK') {
      // iterate over the array to sort the appointment's "createdAt" attribute relative to the column
      const apptByGrid: TAppointmentForUser[][] = [];
      dateline.forEach((d) => {
        const apptCell: TAppointmentForUser[] = [];
        apptCopy.forEach((a) => {
          const res: boolean = DateUtils.isEqual(d.origin, a.createdAt);
          if (res) apptCell.push(a);
        });
        apptByGrid.push(apptCell);
      });

      // iterate over the 2D-array and convert it to 1D-array with applied "layout algorithm"
      const apptByWeek: TAppointmentForApp[] = [];
      apptByGrid.forEach((ca, i) => {
        const apptReodered: TAppointmentForApp[] = AppointmentUtils.layoutAlgorithm(ca, {
          daytimeStart: calendarState.dayTime.start,
          duration: calendarState.duration,
          columnWidth: widthTimeline,
          weekcolumnIndex: i,
        });
        apptByWeek.push(...apptReodered);
      });

      return apptByWeek.map((appt: TAppointmentForApp) => {
        return (
          <ApptBooking
            key={appt.id}
            value={appt}
            scrollEl={scrollEl}
            widthTimeline={widthTimeline}
            mousePosition={mousePosition}
            onPressAppt={onPressAppt}
            onReleaseAppt={onReleaseAppt}
            onFireEvent={onFireEvent}
          />
        );
      });
    }
  };

  const onPressAppt = (value: TAppointmentForApp) => {
    if (value.id) setApptClone(value);
    calendarState.apptClick && calendarState.apptClick(value);
  };

  const onReleaseAppt = (id: string, startTime: number, duration: number) => {
    if (apptClone && id && apptClone.id === id) {
      setApptClone(null);
    }

    const weekColIdx: number = Math.round(mousePosition.left / widthTimeline);
    const dayCustom: TDay = dateline[weekColIdx];
    const payload: any = {
      startTime,
      duration,
      createdAt: dayCustom.origin,
    };

    let apptCopy: TAppointmentForUser[] = calendarState.appointments.slice();
    for (let i = 0; i < apptCopy.length; i++) {
      if (id === apptCopy[i].id) {
        apptCopy[i] = {
          ...apptCopy[i],
          ...payload,
        };
        break;
      }
    }
    dispath({ type: EAction.UPDATE_APPT, payload: apptCopy });

    calendarState.apptChange && calendarState.apptChange(apptCopy);
  };

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.APPOINTMENT}>
      {apptClone && <ApptClone value={apptClone} />}
      {render(calendarState.appointments)}
    </Wrapper>
  );
};

export default Appointment;
