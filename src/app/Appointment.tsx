import React, { useState } from 'react';
import { styled } from 'styled-components';
import { CONFIG } from '../constant';
import { useCalendarDispatch, useCalendarState } from '../hook';
import { EAction, TAppointmentForApp, TAppointmentForUser } from '../model';
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
};

const Appointment: React.FC<TAppointment> = ({ scrollEl, widthTimeline, mousePosition }) => {
  const calendarState = useCalendarState();
  const dispath = useCalendarDispatch();
  const [apptClone, setApptClone] = useState<TAppointmentForApp | null>(null);

  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

  const render = (apptProp: TAppointmentForUser[]) => {
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
          <ApptBooking
            key={appt.id}
            value={appt}
            scrollEl={scrollEl}
            widthTimeline={widthTimeline}
            mousePosition={mousePosition}
            onPressAppt={onPressAppt}
            onReleaseAppt={onReleaseAppt}
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
          <ApptBooking
            key={appt.id}
            value={appt}
            scrollEl={scrollEl}
            widthTimeline={widthTimeline}
            mousePosition={mousePosition}
            onPressAppt={onPressAppt}
            onReleaseAppt={onReleaseAppt}
          />
        );
      });
    }
  };

  const onPressAppt = (value: TAppointmentForApp) => {
    if (value.id) setApptClone(value);
  };

  const onReleaseAppt = (id: string, startTime: number) => {
    if (apptClone && id && apptClone.id === id) {
      setApptClone(null);
    }

    const newWeekColIdx = Math.round(mousePosition.left / widthTimeline);
    const dayCustom = dateline[newWeekColIdx];
    const payload = {
      startTime,
      createdAt: dayCustom.origin,
    };

    let apptCopy = calendarState.appointments.slice();
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
  };

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.APPOINTMENT}>
      {apptClone && <ApptClone value={apptClone} />}
      {render(calendarState.appointments)}
    </Wrapper>
  );
};

export default Appointment;
