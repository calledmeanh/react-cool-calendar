import React from 'react';
import { Select, Option } from './common';
import { EAction, TViewMode } from '../model';
import { getValueFromUserInput } from '../util';
import { useCalendarDispatch, useCalendarState } from '../hook';

type Opts = { value: TViewMode; text: string }[];
const options: Opts = [
  { value: 'DAY', text: 'day' },
  { value: 'WEEK', text: 'week' },
  // { value: 'MONTH', text: 'month' },
];

const ViewMode: React.FC<{}> = () => {
  const calendarState = useCalendarState();
  const dispath = useCalendarDispatch();

  const onSelectMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = getValueFromUserInput(e);
    dispath({ type: EAction.CHANGE_MODE, payload: value });
  };

  return (
    <Select
      data-idtf={'mode'}
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
