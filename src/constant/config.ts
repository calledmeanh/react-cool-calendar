const SECONDS_PER_MINUTE: number = 60;
const SECONDS_PER_HOUR: number = 3600;

const HAFT_DAY_SECONDS: number = 12 * SECONDS_PER_HOUR - 1; // 11h59m59s

const MAPPING_TIME = {
  300: 3,
  600: 3,
  900: 4,
  1800: 2,
};

const DATE_FORMAT = 'YYYY/MM/DD';

const WEEK: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const CONFIG = {
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  HAFT_DAY_SECONDS,
  WEEK,
  MAPPING_TIME,
  DATE_FORMAT,
};
