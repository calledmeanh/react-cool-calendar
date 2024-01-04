import React from "react";
import styled from "styled-components";
import { CONFIG } from "../constant";
import { EStatus, TAppointmentForUser } from "../model";
import { AppointmentUtils, TimeUtils } from "../util";
import { Flex } from "./common";

const Wrapper = styled(Flex)<{ $status: EStatus }>`
  height: calc(100% / 5);
  border-radius: 4px;
  padding: 0 4px;
  cursor: pointer;
  &:hover {
    background-color: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  }
`;

const DotCircle = styled.div<{ $status: EStatus }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
  border: 1px solid ${(props) => AppointmentUtils.getApptColorByStatus(props.$status)};
`;

const Content = styled.span`
  width: calc(100% - 20px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
`;

type TApptRectangle = {
  value: TAppointmentForUser;
};

const ApptRectangle: React.FC<TApptRectangle> = ({ value }) => {
  const startTime: string = TimeUtils.convertSecondsToHourString(value.startTime);
  return (
    <Wrapper $align={"center"} $status={value.status}>
      <DotCircle $status={value.status} />{" "}
      <Content title={value.title}>
        {startTime} - {value.title}
      </Content>
    </Wrapper>
  );
};

export default ApptRectangle;
