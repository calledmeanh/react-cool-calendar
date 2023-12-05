import React, { Reducer, createContext, useContext, useReducer, ReactNode } from 'react';
import { TCalendarStateForApp, TCalendarAction, EAction } from '../model';
import { ConfigUtils } from '../util';

const CalendarContext = createContext<TCalendarStateForApp>(ConfigUtils.createExampleCalendarState());
const CalendarDispatchContext = createContext<React.Dispatch<TCalendarAction>>(function (value: TCalendarAction) {});

export const useCalendarState = () => useContext(CalendarContext);
export const useCalendarDispatch = () => useContext(CalendarDispatchContext);

type TProps = {
  children: ReactNode;
  initialState: TCalendarStateForApp;
};

/**
 * CalendarProvider is a single source of truth for app state,
 * this takes props from Calendar
 */
const CalendarProvider: React.FC<TProps> = ({ children, initialState }) => {
  const [state, dispatch] = useReducer<Reducer<TCalendarStateForApp, TCalendarAction>>(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={state}>
      <CalendarDispatchContext.Provider value={dispatch}>{children}</CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  );
};

function calendarReducer(state: TCalendarStateForApp, action: TCalendarAction): TCalendarStateForApp {
  switch (action.type) {
    case EAction.CHANGE_MODE:
      return { ...state, viewMode: action.payload };
    case EAction.CHANGE_ZOOM:
      return { ...state, duration: action.payload };
    case EAction.PREV_DAY:
      return { ...state, currentDate: action.payload };
    case EAction.NEXT_DAY:
      return { ...state, currentDate: action.payload };
    case EAction.PREV_WEEK:
      return { ...state, currentDate: action.payload };
    case EAction.NEXT_WEEK:
      return { ...state, currentDate: action.payload };
    case EAction.GET_TODAY:
      return { ...state, currentDate: action.payload };
      case EAction.UPDATE_APPT:
      return { ...state, appointments: action.payload };
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default CalendarProvider;
