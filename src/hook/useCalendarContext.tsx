import { Reducer, createContext, useContext, useReducer, ReactNode } from 'react';
import { TCalendarState, TCalendarAction, EAction } from '../model';
import { ConfigUtils } from '../util';

const CalendarContext = createContext<TCalendarState>(ConfigUtils.createCalendarState());
const CalendarDispatchContext = createContext<React.Dispatch<TCalendarAction>>(function (value: TCalendarAction) {});

export const useCalendar = () => useContext(CalendarContext);
export const useCalendarDispatch = () => useContext(CalendarDispatchContext);

type TProps = {
  children: ReactNode;
  initialState: TCalendarState;
};

/**
 * CalendarProvider is a single source of truth for app state, 
 * this takes props from Calendar
 */
const CalendarProvider: React.FC<TProps> = ({ children, initialState }) => {
  const [state, dispatch] = useReducer<Reducer<TCalendarState, TCalendarAction>>(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={state}>
      <CalendarDispatchContext.Provider value={dispatch}>{children}</CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  );
};

function calendarReducer(state: TCalendarState, action: TCalendarAction): TCalendarState {
  switch (action.type) {
    case EAction.MODE:
      return { ...state, mode: action.payload };
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default CalendarProvider;
