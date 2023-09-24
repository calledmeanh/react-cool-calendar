import React from 'react';
import { styled } from 'styled-components';
import { EStatus, TAppointmentForApp, TAppointmentForUser, TRect } from '../model';
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
// Appointment is the place to hold these "appt" down-belown
const Appointment: React.FC<{ parentWidth: number }> = ({ parentWidth }) => {
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
        return <Appt key={appt.id} value={appt} />;
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
        return <Appt key={appt.id} value={appt} />;
      });
    }
  };

  return <Wrapper data-idtf={'appointment'}>{renderAppt(calendarState.appointments)}</Wrapper>;
};

// appt children
const Container = styled.div<{ $rect: TRect; $status: EStatus }>`
  width: ${(props) => props.$rect.width}px;
  height: ${(props) => props.$rect.height}px;
  top: ${(props) => props.$rect.top}px;
  left: ${(props) => props.$rect.left}px;

  border: 1px solid black;
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
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
  &:hover {
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 25%);
  }
`;

const Content = styled(Flex)`
  padding: 3px 4px 3px 8px;
  pointer-events: none;
`;

const Appt: React.FC<{ value: TAppointmentForApp }> = ({ value }) => {
  const start = TimeUtils.convertSecondsToHourString(value.startTime);
  const end = TimeUtils.convertSecondsToHourString(value.endTime);

  const rect = {
    top: value.top,
    left: value.left,
    width: value.width,
    height: value.height,
  };

  return (
    <Container data-idtf={'appt'} $rect={rect} $status={value.status}>
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
