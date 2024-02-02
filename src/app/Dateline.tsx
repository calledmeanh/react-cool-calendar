import React, { useCallback } from "react";
import styled from "styled-components";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp, TDateline } from "../model";
import { TimeUtils, clsx, DateUtils } from "../util";
import { Flex } from "./common";

const Wrapper = styled(Flex)`
  position: sticky;
  top: 0;
  z-index: 4;
  height: ${CONFIG.CSS.DATELINE_HEIGHT}px;
  background: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
`;

const DatelineHeader = styled(Flex)<{ $afterPseudoHeight: number }>`
  flex: 1;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  background: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  &:hover {
    background: ${CONFIG.CSS.DATELINE_COLORS.BG_HOVER};
    box-shadow: 0 3px 5px 0 ${CONFIG.CSS.BOX_SHADOW_COLOR};
  }
  &:active {
    box-shadow: none;
  }
  &::after {
    width: 1px;
    position: absolute;
    top: 0;
    right: 0;
    content: "";
    pointer-events: none;
    -webkit-pointer-events: none;
    background: ${CONFIG.CSS.GRAY_SECONDARY_COLOR};
    height: ${(props) => props.$afterPseudoHeight}px;
  }
`;

const DatelineNumber = styled.div`
  font-size: 26px;
  margin-right: 6px;
  color: ${CONFIG.CSS.FONT_LIGHT_COLOR};
  &.today {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    background: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
    color: ${CONFIG.CSS.HIGHLIGHT_SECONDARY_COLOR};
  }
`;

const DatelineText = styled.div`
  text-transform: capitalize;
  font-size: ${CONFIG.CSS.FONT_SIZE_MEDIUM}px;
  color: ${CONFIG.CSS.FONT_LIGHT_COLOR};
  &.today {
    color: ${CONFIG.CSS.HIGHLIGHT_PRIMARY_COLOR};
  }
`;

const Dateline: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  const render = useCallback(() => {
    const steps: number = TimeUtils.calcTimeStep(calendarState.dayTime.end, calendarState.dayTime.start, calendarState.duration);
    const maxGridHeight: number = calendarState.viewMode === "MONTH" ? CONFIG.CSS.DATELINE_HEIGHT : steps * CONFIG.CSS.LINE_HEIGHT;

    const dateline: TDateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);

    return dateline.map((d, i) => {
      const isToday: boolean = DateUtils.isEqual(d.origin, calendarState.todayGlobalIns);
      const classname: string = clsx({
        today: isToday,
      });
      return (
        <DatelineHeader key={i} $justify={"center"} $align={"center"} $afterPseudoHeight={maxGridHeight}>
          {calendarState.viewMode !== "MONTH" && <DatelineNumber className={classname}>{d.number}</DatelineNumber>}
          <DatelineText className={classname}>{d.text}</DatelineText>
        </DatelineHeader>
      );
    });
  }, [
    calendarState.viewMode,
    calendarState.currentDate,
    calendarState.todayGlobalIns,
    calendarState.dayTime.end,
    calendarState.dayTime.start,
    calendarState.duration,
  ]);

  return <Wrapper data-idtf={CONFIG.DATA_IDTF.DATELINE}>{render()}</Wrapper>;
};

export default Dateline;
