const SECONDS_PER_MINUTE: number = 60;
const SECONDS_PER_HOUR: number = 3600;

const HAFT_DAY_SECONDS: number = 12 * SECONDS_PER_HOUR - 1; // 11h59m59s

const ZOOMMODE_LARGE = 15 * SECONDS_PER_MINUTE;
const ZOOMMODE_SMALL = 30 * SECONDS_PER_MINUTE;

const MAPPING_TIME: any = {
  900: 4,
  1800: 2,
};

const DATE_FORMAT = 'MM/DD/YYYY';

const SPEED = 15;
const FPS = 1000 / 60;

const DATA_IDTF = {
  THIS: 'data-idtf',
  CALENDAR: 'calendar',
  TOOLBAR: 'toolbar',
  ZOOM: 'zoom',
  DAYTIME: 'daytime',
  VIEWMODE: 'viewmode',
  SCROLLING: 'scrolling',
  INTERVAL: 'interval',
  TIME: 'time',
  SWIPABLE: 'swipable',
  DATELINE: 'dateline',
  GRID: 'grid',
  GHOST: 'ghost',
  APPOINTMENT: 'appointment',
  APPT_CLONE: 'appt-clone',
  APPT_BOOKING: 'appt-booking',
  ROW: 'row',
};

export const CONFIG = {
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  HAFT_DAY_SECONDS,
  ZOOMMODE_LARGE,
  ZOOMMODE_SMALL,
  MAPPING_TIME,
  DATE_FORMAT,
  SPEED,
  FPS,
  DATA_IDTF,
};
