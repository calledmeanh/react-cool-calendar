import React from 'react';
import { CONFIG } from '../constant';
import { useCalendarDispatch, useCalendarState } from '../hook';
import { EAction, TCalendarAction, TCalendarStateForApp, TViewMode } from '../model';
import { ElementUtils } from '../util';
import { Select, Option } from './common';

type Opts = { value: TViewMode; text: string }[];
const options: Opts = [
  { value: 'DAY', text: 'day' },
  { value: 'WEEK', text: 'week' },
  // { value: 'MONTH', text: 'month' },
];

const ViewMode: React.FC = () => {
  const calendarState: TCalendarStateForApp = useCalendarState();
  const dispath: React.Dispatch<TCalendarAction> = useCalendarDispatch();

  const onSelectMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: string = ElementUtils.getValueFromUserInput(e);
    dispath({ type: EAction.CHANGE_MODE, payload: value });
  };

  return (
    <Select
      data-idtf={CONFIG.DATA_IDTF.VIEWMODE}
      $padding={[8, 12]}
      $isborderradius
      value={calendarState.viewMode}
      onChange={onSelectMode}
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

export default ViewMode;
