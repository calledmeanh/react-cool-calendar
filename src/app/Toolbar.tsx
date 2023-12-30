import React from "react";
import styled from "styled-components";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp } from "../model";
import { Flex } from "./common";
import Zoom from "./Zoom";
import DateManipulation from "./DateManipulation";
import ViewMode from "./ViewMode";

const Wrapper = styled(Flex)`
  height: 68px;
  padding: 16px 24px;
`;

const Toolbar: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.TOOLBAR} $justify={"space-between"}>
      {calendarState.viewMode === "DAY" || calendarState.viewMode === "WEEK" ? <Zoom /> : <div></div>}
      <DateManipulation />
      <ViewMode />
    </Wrapper>
  );
};

export default Toolbar;
