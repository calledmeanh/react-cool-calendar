const SECONDS_PER_MINUTE: number = 60;
const SECONDS_PER_HOUR: number = 3600;

const HAFT_DAY_SECONDS: number = 12 * SECONDS_PER_HOUR - 1; // 11h59m59s

const DEFAULT = {
  DURATION: 15 * SECONDS_PER_MINUTE,
  TIME_TYPE: 24,
  DATE_FORMAT: 'YYYY/MM/DD',
  TIME_FORMAT: 'hh:mm:ss',
  DATE_TIME_FORMAT: 'DD MM YYYY hh:mm:ss',
  GROUP_TIME: 60 * SECONDS_PER_HOUR,
  DAY_TIME: {
    start: 0 * SECONDS_PER_HOUR,
    end: 24 * SECONDS_PER_HOUR,
  },
  WORKING_TIME: {
    start: 8 * SECONDS_PER_HOUR,
    end: 20 * SECONDS_PER_HOUR,
  },
  MAPPING_TIME: {
    300: 3,
    600: 3,
    900: 4,
    1800: 2,
  },
};

const WEEK: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const CONFIG = {
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  HAFT_DAY_SECONDS,
  DEFAULT,
  WEEK,
};
