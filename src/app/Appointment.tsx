import React from 'react';
import { styled } from 'styled-components';
import { TAppointment } from '../model';
import { Flex } from './common';
import { TimeUtils } from '../util';

const Wrapper = styled.div<{
  $rect: {
    top: number;
    height: number;
  };
}>`
  top: ${(props) => props.$rect.top}px;
  left: 0px;
  width: 150px;
  height: ${(props) => props.$rect.height}px;

  border: 1px solid black;
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

  z-index: 1;
`;

const Content = styled(Flex)`
  padding: 3px 4px 3px 8px;
`;

type TApptCus = TAppointment & {
  rect: {
    top: number;
    height: number;
  };
};

const Appointment: React.FC<{ value: TApptCus }> = ({ value }) => {
  const start = TimeUtils.convertSecondsToHourString(value.startTime);
  const end = TimeUtils.convertSecondsToHourString(value.startTime + TimeUtils.convertMinuteToSeconds(value.duration));
  return (
    <Wrapper $rect={value.rect}>
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

export default Appointment;
