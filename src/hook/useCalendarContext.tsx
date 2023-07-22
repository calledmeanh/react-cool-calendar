import { Reducer, createContext, useContext, useReducer, ReactNode } from 'react';
import { TCalendarAction, TCalendarState } from '../model';

const CalendarContext = createContext({});
const CalendarDispatchContext = createContext({});

export const useCalendar = () => useContext(CalendarContext);
export const useCalendarDispatch = () => useContext(CalendarDispatchContext);

type Props = {
  children: ReactNode;
  initialState: TCalendarState;
};

const CalendarProvider: React.FC<Props> = ({ children, initialState }) => {
  const [calendar, dispatch] = useReducer<Reducer<TCalendarState, TCalendarAction>>(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={calendar}>
      <CalendarDispatchContext.Provider value={dispatch}>{children}</CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  );
};

function calendarReducer(calendarState: TCalendarState, action: TCalendarAction): TCalendarState {
  switch (action.type) {
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default CalendarProvider;
