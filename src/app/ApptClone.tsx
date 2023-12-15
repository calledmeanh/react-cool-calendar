import React from "react";
import { styled } from "styled-components";
import { CONFIG } from "../constant";
import { TAppointmentForApp } from "../model";
import { TimeUtils } from "../util";
import { Flex } from "./common";

const Wrapper = styled.div`
  background: ${CONFIG.CSS.APPT_BG_COLORS.CLONE};
  border: 1px solid ${CONFIG.CSS.APPT_BG_COLORS.BOOKED};
  opacity: 0.5;

  color: ${CONFIG.CSS.FONT_DARK_COLOR};
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
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
  const startTime: string = TimeUtils.convertSecondsToHourString(value.startTime);
  const endTime: string = TimeUtils.convertSecondsToHourString(value.endTime);

  return (
    <Wrapper
      data-idtf={CONFIG.DATA_IDTF.APPT_CLONE}
      style={{
        transform: `translateX(${value.left}px) translateY(${value.top}px)`,
        width: value.width,
        height: value.height,
      }}
    >
      <Content $dir={"column"}>
        <div>
          {startTime}-{endTime}
        </div>
        <div>{value.title}</div>
        <div>{value.content}</div>
      </Content>
    </Wrapper>
  );
};

export default ApptClone;
