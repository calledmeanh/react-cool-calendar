import React, { useRef, useState } from "react";
import { styled } from "styled-components";
import { CONFIG } from "../constant";
import { useCalendarDispatch, useCalendarState } from "../hook";
import { EAction, TAppointmentForApp, TAppointmentForUser, TCalendarAction, TCalendarStateForApp, TDateline, TDay } from "../model";
import { AppointmentUtils, DateUtils } from "../util";
import ApptBooking from "./ApptBooking";
import ApptClone from "./ApptClone";

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
  coords: { x: number; y: number; pageX: number; pageY: number };
};

const Appointment: React.FC<TAppointment> = ({ scrollEl, widthTimeline, coords }) => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dispath: React.Dispatch<TCalendarAction> = useCalendarDispatch();

  const [apptClone, setApptClone] = useState<TAppointmentForApp | null>(null);
  const cloneBackerRef: React.MutableRefObject<TAppointmentForApp> = useRef({} as TAppointmentForApp);
  const isPressRef: React.MutableRefObject<boolean> = useRef(false);

  const dateline: TDateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

  const renderByDayMode = (apptProp: TAppointmentForUser[]) => {
    const apptByDate: TAppointmentForUser[] = apptProp.filter((a) => DateUtils.isEqual(calendarState.currentDate, a.createdAt));

    const apptReordered: TAppointmentForApp[] = AppointmentUtils.layoutAlgorithm(apptByDate, {
      daytimeStart: calendarState.dayTime.start,
      duration: calendarState.duration,
      columnWidth: widthTimeline,
      weekcolumnIndex: 0,
    });

    return apptReordered;
  };

  const renderByWeekMode = (apptProp: TAppointmentForUser[]) => {
    const apptReordered: TAppointmentForApp[] = [];

    // iterate over the array to sort the appointment's "createdAt" attribute relative to the column
    const apptByWeek: TAppointmentForUser[][] = [];
    dateline.forEach((d) => {
      const apptCell: TAppointmentForUser[] = [];
      apptProp.forEach((a) => {
        const res: boolean = DateUtils.isEqual(d.origin, a.createdAt);
        if (res) apptCell.push(a);
      });
      apptByWeek.push(apptCell);
    });

    // iterate over the 2D-array and convert it to 1D-array with applied "layout algorithm"
    apptByWeek.forEach((ca, i) => {
      const apptReodered: TAppointmentForApp[] = AppointmentUtils.layoutAlgorithm(ca, {
        daytimeStart: calendarState.dayTime.start,
        duration: calendarState.duration,
        columnWidth: widthTimeline,
        weekcolumnIndex: i,
      });
      apptReordered.push(...apptReodered);
    });

    return apptReordered;
  };

  const render = (apptProp: TAppointmentForUser[]) => {
    let apptRender: TAppointmentForApp[] = [];
    if (calendarState.viewMode === "DAY") apptRender = renderByDayMode(apptProp);
    else if (calendarState.viewMode === "WEEK") apptRender = renderByWeekMode(apptProp);

    return apptRender;
  };

  const onPressApptBooking = (value: TAppointmentForApp) => {
    if (value.id) {
      setApptClone(value);
      cloneBackerRef.current = value;
      isPressRef.current = true;
    }
    calendarState.apptClick && calendarState.apptClick(value);
  };

  const onReleaseApptBooking = (id: string, startTime: number, duration: number) => {
    if (apptClone && id && apptClone.id === id) {
      setApptClone(null);
    }

    const weekColIdx: number = Math.round(coords.x / widthTimeline);
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
    isPressRef.current = false;
  };

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isPressRef.current) setApptClone(cloneBackerRef.current);
  };
  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => setApptClone(null);

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.APPOINTMENT} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {apptClone && <ApptClone value={apptClone} />}
      {render(calendarState.appointments).map((appt: TAppointmentForApp) => (
        <ApptBooking
          key={appt.id}
          value={appt}
          scrollEl={scrollEl}
          widthTimeline={widthTimeline}
          coords={coords}
          onPressAppt={onPressApptBooking}
          onReleaseAppt={onReleaseApptBooking}
        />
      ))}
    </Wrapper>
  );
};

export default Appointment;
