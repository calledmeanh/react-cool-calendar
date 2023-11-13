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

const CSS = {
  GRAY_PRIMARY_COLOR: '#f7f7f8',
  GRAY_SECONDARY_COLOR: '#eef0f2',
  GRAY_THIRD_COLOR: '#d5d7da',

  FONT_DARK_COLOR: '#101928',
  FONT_LIGHT_COLOR: '#67768c',

  HIGHLIGHT_PRIMARY_COLOR: '#037aff',
  HIGHLIGHT_SECONDARY_COLOR: '#fff',

  DISABLED_COLOR: '#dee3e7',

  LIGHT_THEME_BG_COLOR: '#fff',

  // wt = working time
  WT_COLORS: {
    PRIMARY: '#fff',
    STROKE: {
      PRIMARY: '#10192833',
      SECONDARY: '#00000000',
    },
  },

  NOWINDICATOR_COLORS: {
    PRIMARY: '#e45a74',
    SECONDARY: '#fff',
  },

  // TODO: add more status colors then move to spacing, size, transition
  APPT_BG_COLORS: {
    BOOKED: '#a5dff8',
    CLONE: '#fff',
  },
  DATELINE_COLORS: {
    HOVER: '#fff',
  },
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
  CSS,
};
