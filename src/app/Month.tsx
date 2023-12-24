import React from "react";
import { CONFIG } from "../constant";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp } from "../model";

const Month: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  return <div data-idtf={CONFIG.DATA_IDTF.MONTH}>This is where a month comes in</div>;
};

export default Month;
