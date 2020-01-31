
import moment from 'moment';
import { padCharsStart } from 'lodash/fp';
import { gregorianToEthiopian } from 'lib/utils';
import {
  DATE_FORMAT,
  YEAR_MONTH_FORMAT,
  YEAR_FORMAT,
  MONTH_FORMAT,
  DAY_FORMAT,
  TIMESTAMP_FORMAT,
  TIME_FORMAT,
  CALENDAR_FORMATS,
  AGE_UNITS,
  localeConsts,
} from 'lib/config';
import { isEmpty } from './index';

const { GLOBAL_DATE_FORMAT } = localeConsts;

/**
 * Returns the age value for a given birthdate.
 *
 * @param {String} birthdate of the form YYYY-MM-DD
 * @return {String}
 */
export function formatAgeFromBirthdate(birthdate) {
  const momentInstance = moment(birthdate);
  const diff = moment().diff(momentInstance, 'months');
  if (diff === 1) {
    return `${diff} month`;
  }
  const shouldShowMonths = diff < 24;
  return shouldShowMonths ? `${diff} months` : `${Math.floor(diff / 12)} years`;
}

export function getBirthdateFromAge(age, ageUnit) {
  let birthdate;

  switch (ageUnit) {
    case AGE_UNITS.DAYS: {
      birthdate = moment().subtract({ days: age }).format();
      break;
    }
    case AGE_UNITS.MONTHS: {
      birthdate = moment().subtract({ months: age }).format();
      break;
    }
    case AGE_UNITS.YEARS: {
      birthdate = moment().subtract({ years: age }).format();
      break;
    }
    default: {
      break;
    }
  }

  return birthdate;
}

export const formatTimeAgo = formattedTimestamp => (
  formattedTimestamp ? moment(formattedTimestamp).fromNow() : 'Never'
);

export function formatInternationalDate(timestamp) {
  return moment(timestamp).format(DATE_FORMAT);
}

export function getEthiopianDate(timestamp) {
  const dateMoment = moment(timestamp);
  return gregorianToEthiopian(
    dateMoment.year(),
    dateMoment.month() + 1,
    dateMoment.date(),
  );
}

export function formatEthiopianDate(timestamp) {
  const ethiopianDate = getEthiopianDate(timestamp);
  const [year, month, day] = ethiopianDate.map(padCharsStart('0')(2));
  return `${day}-${month}-${year}`;
}

// returns date as either International in 'YYYY-MM-DD'/Ethiopian in 'DD-MM-YYYY' format
export function formatDate(timestamp) {
  if (isEmpty(timestamp)) {
    return undefined;
  }

  switch (GLOBAL_DATE_FORMAT) {
    case CALENDAR_FORMATS.GREGORIAN:
      return formatInternationalDate(timestamp);
    case CALENDAR_FORMATS.ETHIOPIAN:
      return formatEthiopianDate(timestamp);
    default:
      return formatInternationalDate(timestamp);
  }
}

export function formatInternationalYearMonth(timestamp) {
  return moment(timestamp).format(YEAR_MONTH_FORMAT);
}

export function formatEthiopianYearMonth(timestamp) {
  const ethiopianDate = getEthiopianDate(timestamp);
  const ethiopianYearMonth = ethiopianDate.slice(0, 2);
  const [year, month] = ethiopianYearMonth;
  const ethiopianMonthYear = [month, year];
  return ethiopianMonthYear.map(padCharsStart('0')(2)).join('-');
}

// returns date as either International in 'YYYY-MM'/Ethiopian in 'MM-YYYY' format
export function formatYearMonth(timestamp) {
  if (isEmpty(timestamp)) {
    return undefined;
  }

  switch (GLOBAL_DATE_FORMAT) {
    case CALENDAR_FORMATS.GREGORIAN:
      return formatInternationalYearMonth(timestamp);
    case CALENDAR_FORMATS.ETHIOPIAN:
      return formatEthiopianYearMonth(timestamp);
    default:
      return formatInternationalYearMonth(timestamp);
  }
}

export function formatInternationalYear(timestamp) {
  return moment(timestamp).format(YEAR_FORMAT);
}

export function formatEthiopianYear(timestamp) {
  const ethiopianDate = getEthiopianDate(timestamp);
  const ethiopianYear = ethiopianDate[0].toString();
  return ethiopianYear;
}

// returns date as either International/Ethiopian in 'YYYY' format
export function formatYear(timestamp) {
  if (isEmpty(timestamp)) {
    return undefined;
  }

  switch (GLOBAL_DATE_FORMAT) {
    case CALENDAR_FORMATS.GREGORIAN:
      return formatInternationalYear(timestamp);
    case CALENDAR_FORMATS.ETHIOPIAN:
      return formatEthiopianYear(timestamp);
    default:
      return formatInternationalYear(timestamp);
  }
}

export function formatInternationalMonth(timestamp) {
  return moment(timestamp).format(MONTH_FORMAT);
}

export function formatEthiopianMonth(timestamp) {
  const ethiopianDate = getEthiopianDate(timestamp);
  const ethiopianMonth = ethiopianDate[1].toString();
  return padCharsStart('0')(2)(ethiopianMonth);
}

// returns date as either International/Ethiopian in 'MM' format
export function formatMonth(timestamp) {
  if (isEmpty(timestamp)) {
    return undefined;
  }

  switch (GLOBAL_DATE_FORMAT) {
    case CALENDAR_FORMATS.GREGORIAN:
      return formatInternationalMonth(timestamp);
    case CALENDAR_FORMATS.ETHIOPIAN:
      return formatEthiopianMonth(timestamp);
    default:
      return formatInternationalMonth(timestamp);
  }
}

export function formatInternationalDay(timestamp) {
  return moment(timestamp).format(DAY_FORMAT);
}

export function formatEthiopianDay(timestamp) {
  const ethiopianDate = getEthiopianDate(timestamp);
  const ethiopianDay = ethiopianDate[2].toString();
  return padCharsStart(0)(2)(ethiopianDay);
}

// returns date as either International/Ethiopian in 'DD' format
export function formatDay(timestamp) {
  if (isEmpty(timestamp)) {
    return undefined;
  }

  switch (GLOBAL_DATE_FORMAT) {
    case CALENDAR_FORMATS.GREGORIAN:
      return formatInternationalDay(timestamp);
    case CALENDAR_FORMATS.ETHIOPIAN:
      return formatEthiopianDay(timestamp);
    default:
      return formatInternationalDay(timestamp);
  }
}

export function formatTime(timestamp) {
  return moment(timestamp).format(TIME_FORMAT);
}

export function formatInternationalTimestamp(timestamp) {
  return moment(timestamp).format(TIMESTAMP_FORMAT);
}

export function formatEthiopianTimestamp(timestamp) {
  return `${formatEthiopianDate(timestamp)} ${formatTime(timestamp)}`;
}

export function formatTimestamp(timestamp) {
  if (isEmpty(timestamp)) {
    return undefined;
  }

  switch (GLOBAL_DATE_FORMAT) {
    case CALENDAR_FORMATS.GREGORIAN:
      return formatInternationalTimestamp(timestamp);
    case CALENDAR_FORMATS.ETHIOPIAN:
      return formatEthiopianTimestamp(timestamp);
    default:
      return formatInternationalTimestamp(timestamp);
  }
}

function pluralize(noun, value) {
  return value === 1 ? noun : `${noun}s`;
}

export function formatTimeDifference(a, b) {
  if (isEmpty(a) || isEmpty(b)) {
    return undefined;
  }

  const momentA = moment(a);
  const momentB = moment(b);

  const secondsDiff = momentA.diff(momentB, 'seconds');

  if (secondsDiff < 60) {
    return `${secondsDiff} ${pluralize('second', secondsDiff)}`;
  }

  const minutesDiff = momentA.diff(momentB, 'minutes');

  if (minutesDiff < 60) {
    return `${minutesDiff} ${pluralize('minute', minutesDiff)}`;
  }

  const hoursDiff = momentA.diff(momentB, 'hours');

  if (hoursDiff < 24) {
    return `${hoursDiff} ${pluralize('hour', hoursDiff)}`;
  }

  const daysDiff = momentA.diff(momentB, 'days');

  return `${daysDiff} ${pluralize('day', daysDiff)}`;
}
