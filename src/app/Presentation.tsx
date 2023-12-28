import React from "react";
import { useCalendarState } from "../hook";
import { TCalendarStateForApp } from "../model";
import Scrolling from "./Scrolling";
import Month from "./Month";

const Presentation: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();

  return (
    <React.Fragment>
      {(calendarState.viewMode !== "MONTH") && <Scrolling />}
      {calendarState.viewMode === "MONTH" && <Month />}
    </React.Fragment>
  );
};

export default Presentation;
