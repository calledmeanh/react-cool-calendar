import React from "react";
import { CONFIG } from "../constant";
import { useCalendarState, useCalendarDispatch } from "../hook";
import { EAction, EViewMode, TCalendarAction, TCalendarStateForApp } from "../model";
import { TimeUtils, ElementUtils } from "../util";
import { Select, Option } from "./common";

type Opts = { value: EViewMode; text: string }[];
const options: Opts = [
  { value: EViewMode.LARGE, text: "large" },
  { value: EViewMode.SMALL, text: "small" },
];

const Zoom: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dispath: React.Dispatch<TCalendarAction> = useCalendarDispatch();

  const onSelectZoom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: string = ElementUtils.getValueFromUserInput(e);
    switch (value) {
      case EViewMode.LARGE:
        dispath({ type: EAction.CHANGE_ZOOM, payload: CONFIG.ZOOMMODE_LARGE });
        break;
      case EViewMode.SMALL:
        dispath({ type: EAction.CHANGE_ZOOM, payload: CONFIG.ZOOMMODE_SMALL });
        break;
      default:
        dispath({ type: EAction.CHANGE_ZOOM, payload: CONFIG.ZOOMMODE_SMALL });
        break;
    }
  };

  return (
    <Select
      data-idtf={CONFIG.DATA_IDTF.ZOOM}
      $padding={[8, 12]}
      $isborderradius
      value={TimeUtils.parseDurationToViewMode(calendarState.duration)}
      onChange={onSelectZoom}
    >
      {options.map((o, i) => {
        return (
          <Option key={i} value={o.value}>
            {o.text}
          </Option>
        );
      })}
    </Select>
  );
};

export default Zoom;
