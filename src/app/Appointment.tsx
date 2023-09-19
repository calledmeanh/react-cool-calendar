import React from 'react';
import { styled } from 'styled-components';
import { TAppointmentForApp, TRect } from '../model';
import { Flex } from './common';
import { TimeUtils } from '../util';

const Wrapper = styled.div<{ $rect: TRect }>`
  width: ${(props) => props.$rect.width}px;
  height: ${(props) => props.$rect.height}px;
  top: ${(props) => props.$rect.top}px;
  left: ${(props) => props.$rect.left}%;

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

const Appointment: React.FC<{ value: TAppointmentForApp }> = ({ value }) => {
  const start = TimeUtils.convertSecondsToHourString(value.startTime);
  const end = TimeUtils.convertSecondsToHourString(value.endTime);

  const rect = {
    top: value.top,
    left: value.left,
    width: value.width,
    height: value.height,
  };

  return (
    <Wrapper $rect={rect}>
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
