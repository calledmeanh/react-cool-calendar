import React from 'react';
import { styled } from 'styled-components';
import { TAppointmentForApp } from '../model';
import { Flex } from './common';
import { TimeUtils } from '../util';
import { CONFIG } from '../constant';

const Wrapper = styled.div`
  background: ${CONFIG.CSS.APPT_BG_COLORS.CLONE};
  border: 1px solid ${CONFIG.CSS.APPT_BG_COLORS.BOOKED};
  opacity: 0.5;

  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: 12px;
  line-height: 16px;
  border-radius: 4px;
  text-align: left;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  position: absolute;
`;

const Content = styled(Flex)`
  padding: 3px 4px 3px 8px;
  pointer-events: none;
`;

type TApptClone = {
  value: TAppointmentForApp;
};

const ApptClone: React.FC<TApptClone> = ({ value }) => {
  const start = TimeUtils.convertSecondsToHourString(value.startTime);
  const end = TimeUtils.convertSecondsToHourString(value.endTime);

  return (
    <Wrapper
      data-idtf={CONFIG.DATA_IDTF.APPT_CLONE}
      style={{
        transform: `translateX(${value.left}px) translateY(${value.top}px)`,
        width: value.width,
        height: value.height,
      }}
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

export default ApptClone;
