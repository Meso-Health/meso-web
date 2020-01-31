import moment from 'moment';
import {
  formatBirthdate,
  formatCardId,
  formatClinicNumberType,
  formatGender,
  formatLatLong,
  formatPhoneNumber,
  formatPhotoUrl,
  formatNumber,
  formatShortId,
  formatStringArray,
  formatUploadCount,
} from 'lib/formatters';

import {
  formatAgeFromBirthdate,
  formatEthiopianDate,
  formatInternationalDate,
  formatEthiopianYearMonth,
  formatInternationalYearMonth,
  formatEthiopianYear,
  formatInternationalYear,
  formatEthiopianMonth,
  formatInternationalMonth,
  formatEthiopianDay,
  formatInternationalDay,
  formatEthiopianTimestamp,
  formatInternationalTimestamp,
  formatTimeDifference,
  formatDate,
  formatYearMonth,
  formatYear,
  formatMonth,
  formatDay,
  formatTime,
  formatTimestamp,
  formatTimeAgo,
} from 'lib/formatters/date';

import {
  formatCurrency,
  formatCurrencyWithLabel,
} from 'lib/formatters/currency';

import { CURRENCY_FORMATS } from 'lib/config';

describe('formatPhoneNumber', () => {
  it('returns a the number with spaces between', () => {
    expect(formatPhoneNumber('0781555123')).toBe('0781 555 123');
    expect(formatPhoneNumber('0791123555')).toBe('0791 123 555');
  });

  it('returns undefined for empty values', () => {
    expect(formatPhoneNumber()).toBeUndefined();
    expect(formatPhoneNumber(null)).toBeUndefined();
    expect(formatPhoneNumber('')).toBeUndefined();
  });
});

describe('formatUploadCount', () => {
  it('returns correct count for positive values', () => {
    expect(formatUploadCount(5)).toBe('5 to upload');
    expect(formatUploadCount(1)).toBe('1 to upload');
    expect(formatUploadCount(1000)).toBe('1000 to upload');
  });

  it('returns all uploaded for null, zero, or empty values', () => {
    expect(formatUploadCount(0)).toBe('All uploaded');
    expect(formatUploadCount(null)).toBe('All uploaded');
    expect(formatUploadCount('')).toBe('All uploaded');
  });
});

describe('formatTimeAgo', () => {
  it('returns correct count for positive values', () => {
    expect(formatTimeAgo(moment().subtract({ years: 39 }))).toBe('39 years ago');
    expect(formatTimeAgo(moment().subtract({ seconds: 5 }))).toBe('a few seconds ago');
    expect(formatTimeAgo(moment().subtract({ minutes: 24 }))).toBe('24 minutes ago');
  });

  it('returns never for null, zero, empty, invalid dates', () => {
    expect(formatTimeAgo(0)).toBe('Never');
    expect(formatTimeAgo(null)).toBe('Never');
    expect(formatTimeAgo('')).toBe('Never');
  });
});

describe('formatPhotoUrl', () => {
  it('returns the photo URL if it is a fully formed URL', () => {
    const cloudfrontUrl = 'asdf.cloudfront.net/media/1234';
    expect(formatPhotoUrl(cloudfrontUrl, 'http://localhost:5000')).toBe(cloudfrontUrl);
  });

  it('returns the photo URL prefixed with api host if it is a local url', () => {
    const localPhotoUrl = '/dragonfly/media/W1siZiIsIjIwMTkvMDIvMDEvNWNlN3p2OHU2M19maWxlIl0sWyJwIiwiY29udmVydCIsIi1zdHJpcCJdLFsicCIsInRodW1iIiwiMjQweDI0MCMiXV0-396f6825cc79f76c';
    const baseUrl = 'http://localhost:5000';
    expect(formatPhotoUrl(localPhotoUrl, baseUrl)).toBe('http://localhost:5000/dragonfly/media/W1siZiIsIjIwMTkvMDIvMDEvNWNlN3p2OHU2M19maWxlIl0sWyJwIiwiY29udmVydCIsIi1zdHJpcCJdLFsicCIsInRodW1iIiwiMjQweDI0MCMiXV0-396f6825cc79f76c');

    const baseUrlWithSlash = 'http://localhost:5000/';
    expect(formatPhotoUrl(localPhotoUrl, baseUrlWithSlash)).toBe('http://localhost:5000/dragonfly/media/W1siZiIsIjIwMTkvMDIvMDEvNWNlN3p2OHU2M19maWxlIl0sWyJwIiwiY29udmVydCIsIi1zdHJpcCJdLFsicCIsInRodW1iIiwiMjQweDI0MCMiXV0-396f6825cc79f76c');
  });

  it('returns null if the url is null', () => {
    expect(formatPhotoUrl(null)).toBe(null);
  });
});

describe('formatBirthdate', () => {
  it('returns only the year if the accuracy is Y', () => {
    expect(formatBirthdate('1995-11-15', 'Y')).toBe('1995-__-__');
  });

  it('returns only the year if the accuracy is M', () => {
    expect(formatBirthdate('1995-11-15', 'M')).toBe('1995-11-__');
  });

  it('returns only the year if the accuracy is D', () => {
    expect(formatBirthdate('1995-11-15', 'D')).toBe('1995-11-15');
  });
});

describe('formatAgeFromBirthdate', () => {
  it('returns years if more than 24 months', () => {
    const formattedBirthdate = moment().subtract({ years: 39 });
    expect(formatAgeFromBirthdate(formattedBirthdate)).toBe('39 years');
  });

  it('returns months if one year ago', () => {
    const formattedBirthdate = moment().subtract({ year: 1 });
    expect(formatAgeFromBirthdate(formattedBirthdate)).toBe('12 months');
  });

  it('returns singular month if one month', () => {
    const formattedBirthdate = moment().subtract({ months: 1 });
    expect(formatAgeFromBirthdate(formattedBirthdate)).toBe('1 month');
  });

  it('returns plural month if 0 month', () => {
    const formattedBirthdate = moment().subtract({ days: 20 });
    expect(formatAgeFromBirthdate(formattedBirthdate)).toBe('0 months');
  });
});

describe('formatCardId', () => {
  it('returns a card number with spaces', () => {
    expect(formatCardId('WTC000000')).toBe('WTC 000 000');
    expect(formatCardId('RWI153189')).toBe('RWI 153 189');
  });

  it('returns undefined for empty values', () => {
    expect(formatCardId()).toBeUndefined();
    expect(formatCardId(null)).toBeUndefined();
    expect(formatCardId('')).toBeUndefined();
  });
});

describe('formatClinicNumberType', () => {
  it('returns Delivery', () => {
    expect(formatClinicNumberType('delivery')).toBe('Delivery');
  });

  it('returns OPD', () => {
    expect(formatClinicNumberType('opd')).toBe('OPD');
  });
});

describe('formatGender', () => {
  it('returns a full gender string', () => {
    expect(formatGender('M')).toBe('Male');
    expect(formatGender('m')).toBe('Male');
    expect(formatGender('F')).toBe('Female');
    expect(formatGender('  F   ')).toBe('Female');
    expect(formatGender('Z')).toBeUndefined();
  });

  it('returns undefined for empty values', () => {
    expect(formatGender()).toBeUndefined();
    expect(formatGender(null)).toBeUndefined();
    expect(formatCardId('')).toBeUndefined();
  });
});

describe('formatShortId', () => {
  it('returns the first portion of a UUID', () => {
    expect(formatShortId('6d4cdff7-8334-4342-a21d-c0f43f5b40aa')).toBe('6D4CDFF7');
    expect(formatShortId('not an id')).toBeUndefined();
  });

  it('returns undefined for empty values', () => {
    expect(formatShortId()).toBeUndefined();
    expect(formatShortId(null)).toBeUndefined();
    expect(formatShortId('')).toBeUndefined();
  });
});

describe('formatNumber', () => {
  it('returns a formatted number', () => {
    expect(formatNumber(2500)).toBe('2,500');
  });

  it('returns undefined for empty values', () => {
    expect(formatNumber()).toBeUndefined();
    expect(formatNumber('')).toBeUndefined();
    expect(formatNumber(null)).toBeUndefined();
  });
});

describe('formatCurrency', () => {
  it('returns undefined for empty values', () => {
    expect(formatCurrency()).toBeUndefined();
    expect(formatCurrency(null)).toBeUndefined();
    expect(formatCurrency('')).toBeUndefined();
  });

  it('returns a formatted currency', () => {
    expect(formatCurrency(2500, CURRENCY_FORMATS.UNSPECIFIED)).toBe('2,500');
  });

  it('returns a Ugandan style formatted currency', () => {
    expect(formatCurrency(2500, CURRENCY_FORMATS.UGANDAN)).toBe('2,500');
  });
});

describe('formatCurrencyWithLabel', () => {
  it('returns undefined for empty values', () => {
    expect(formatCurrencyWithLabel()).toBeUndefined();
    expect(formatCurrencyWithLabel(null)).toBeUndefined();
    expect(formatCurrencyWithLabel('')).toBeUndefined();
  });

  it('returns a formatted currency label', () => {
    expect(formatCurrencyWithLabel(2534, CURRENCY_FORMATS.UNSPECIFIED)).toBe('2,534');
  });

  it('returns an Ugandan style formatted currency label', () => {
    expect(formatCurrencyWithLabel(2534, CURRENCY_FORMATS.UGANDAN)).toBe('2,534 UGX');
  });
});

describe('formatLatLong', () => {
  it('returns a latitude and longitude separated by a comma', () => {
    expect(formatLatLong(0.95578806, 32.85564964)).toBe('0.95578806, 32.85564964');
    expect(formatLatLong(1, 2)).toBe('1, 2');
  });

  it('returns undefined for empty values', () => {
    expect(formatLatLong()).toBeUndefined();
    expect(formatLatLong(null)).toBeUndefined();
    expect(formatLatLong('', '')).toBeUndefined();
  });
});

describe('formatDate', () => {
  it('returns undefined for empty values', () => {
    expect(formatDate()).toBeUndefined();
    expect(formatDate(null)).toBeUndefined();
    expect(formatDate('')).toBeUndefined();
  });
});

describe('formatInternationalDate', () => {
  it('returns a date in the format MMM DD, YYYY', () => {
    expect(formatInternationalDate(new Date(2017, 8, 6, 11))).toBe('2017-09-06');
    expect(formatInternationalDate(new Date(2018, 0, 1, 11))).toBe('2018-01-01');
    expect(formatInternationalDate(new Date(2018, 11, 1, 11))).toBe('2018-12-01');
  });
});

describe('formatEthiopianDate', () => {
  it('returns a date converted to the Ethiopian calendar in the format YYYY-MM-DD', () => {
    expect(formatEthiopianDate(new Date(2017, 8, 6, 11))).toBe('01-13-2009');
    expect(formatEthiopianDate(new Date(2018, 0, 1, 11))).toBe('23-04-2010');
    expect(formatEthiopianDate(new Date(2018, 11, 1, 11))).toBe('22-03-2011');
  });
});

describe('formatYearMonth', () => {
  it('returns undefined for empty values', () => {
    expect(formatYearMonth()).toBeUndefined();
    expect(formatYearMonth(null)).toBeUndefined();
    expect(formatYearMonth('')).toBeUndefined();
  });
});

describe('formatInternationalYearMonth', () => {
  it('returns a date in the format YYYY-MM', () => {
    expect(formatInternationalYearMonth(new Date(2017, 8, 6, 11))).toBe('2017-09');
    expect(formatInternationalYearMonth(new Date(2018, 0, 1, 11))).toBe('2018-01');
    expect(formatInternationalYearMonth(new Date(2018, 11, 1, 11))).toBe('2018-12');
  });
});

describe('formatEthiopianYearMonth', () => {
  it('returns a date converted to the Ethiopian calendar in the format YYYY-MM', () => {
    expect(formatEthiopianYearMonth(new Date(2017, 8, 6, 11))).toBe('13-2009');
    expect(formatEthiopianYearMonth(new Date(2018, 0, 1, 11))).toBe('04-2010');
    expect(formatEthiopianYearMonth(new Date(2018, 11, 1, 11))).toBe('03-2011');
  });
});

describe('formatYear', () => {
  it('returns undefined for empty values', () => {
    expect(formatYear()).toBeUndefined();
    expect(formatYear(null)).toBeUndefined();
    expect(formatYear('')).toBeUndefined();
  });
});

describe('formatInternationalYear', () => {
  it('returns a date in the format YYYY', () => {
    expect(formatInternationalYear(new Date(2017, 8, 6, 11))).toBe('2017');
    expect(formatInternationalYear(new Date(2018, 0, 1, 11))).toBe('2018');
    expect(formatInternationalYear(new Date(2018, 11, 1, 11))).toBe('2018');
  });
});

describe('formatEthiopianYear', () => {
  it('returns a date converted to the Ethiopian calendar in the format YYYY', () => {
    expect(formatEthiopianYear(new Date(2017, 8, 6, 11))).toBe('2009');
    expect(formatEthiopianYear(new Date(2018, 0, 1, 11))).toBe('2010');
    expect(formatEthiopianYear(new Date(2018, 11, 1, 11))).toBe('2011');
  });
});

describe('formatMonth', () => {
  it('returns undefined for empty values', () => {
    expect(formatMonth()).toBeUndefined();
    expect(formatMonth(null)).toBeUndefined();
    expect(formatMonth('')).toBeUndefined();
  });
});

describe('formatInternationalMonth', () => {
  it('returns a date in the format MM', () => {
    expect(formatInternationalMonth(new Date(2017, 8, 6, 11))).toBe('09');
    expect(formatInternationalMonth(new Date(2018, 0, 1, 11))).toBe('01');
    expect(formatInternationalMonth(new Date(2018, 11, 1, 11))).toBe('12');
  });
});

describe('formatEthiopianMonth', () => {
  it('returns a date converted to the Ethiopian calendar in the format MM', () => {
    expect(formatEthiopianMonth(new Date(2017, 8, 6, 11))).toBe('13');
    expect(formatEthiopianMonth(new Date(2018, 0, 1, 11))).toBe('04');
    expect(formatEthiopianMonth(new Date(2018, 11, 1, 11))).toBe('03');
  });
});

describe('formatDay', () => {
  it('returns undefined for empty values', () => {
    expect(formatDay()).toBeUndefined();
    expect(formatDay(null)).toBeUndefined();
    expect(formatDay('')).toBeUndefined();
  });
});

describe('formatInternationalDay', () => {
  it('returns a date in the format DD', () => {
    expect(formatInternationalDay(new Date(2017, 8, 6, 11))).toBe('06');
    expect(formatInternationalDay(new Date(2018, 0, 1, 11))).toBe('01');
    expect(formatInternationalDay(new Date(2018, 11, 1, 11))).toBe('01');
  });
});

describe('formatEthiopianDay', () => {
  it('returns a date converted to the Ethiopian calendar in the format DD', () => {
    expect(formatEthiopianDay(new Date(2017, 8, 6, 11))).toBe('01');
    expect(formatEthiopianDay(new Date(2018, 0, 1, 11))).toBe('23');
    expect(formatEthiopianDay(new Date(2018, 11, 1, 11))).toBe('22');
  });
});

describe('formatTime', () => {
  it('returns a date in the format h:mm A', () => {
    expect(formatTime(new Date(2017, 8, 6, 0, 0))).toBe('12:00 AM');
    expect(formatTime(new Date(2018, 0, 1, 8, 30))).toBe('8:30 AM');
    expect(formatTime(new Date(2018, 11, 1, 23, 59))).toBe('11:59 PM');
  });
});

describe('formatTimestamp', () => {
  it('returns undefined for empty values', () => {
    expect(formatTimestamp()).toBeUndefined();
    expect(formatTimestamp(null)).toBeUndefined();
    expect(formatTimestamp('')).toBeUndefined();
  });
});

describe('formatInternationalTimestamp', () => {
  it('returns a date in the format YYYY-MM-DD h:mm A', () => {
    expect(formatInternationalTimestamp(new Date(2017, 8, 6, 0, 0))).toBe('2017-09-06 12:00 AM');
    expect(formatInternationalTimestamp(new Date(2018, 0, 1, 8, 30))).toBe('2018-01-01 8:30 AM');
    expect(formatInternationalTimestamp(new Date(2018, 11, 1, 23, 59))).toBe('2018-12-01 11:59 PM');
  });
});

describe('formatEthiopianTimestamp', () => {
  it('returns a date converted to the Ethiopian calendar in the format DD-MM-YYYY h:mm A', () => {
    expect(formatEthiopianTimestamp(new Date(2017, 8, 6, 0, 0))).toBe('01-13-2009 12:00 AM');
    expect(formatEthiopianTimestamp(new Date(2018, 0, 1, 8, 30))).toBe('23-04-2010 8:30 AM');
    expect(formatEthiopianTimestamp(new Date(2018, 11, 1, 23, 59))).toBe('22-03-2011 11:59 PM');
  });
});

describe('formatStringArray', () => {
  it('returns undefined for non array types', () => {
    expect(formatStringArray(1)).toBeUndefined();
    expect(formatStringArray(null)).toBeUndefined();
    expect(formatStringArray('')).toBeUndefined();
  });

  it('returns the right string', () => {
    expect(formatStringArray([])).toEqual('');
    expect(formatStringArray(['Hello'])).toEqual('Hello');
    expect(formatStringArray(['One', 'Two'])).toEqual('One, Two');
  });
});

describe('formatTimeDifference', () => {
  it('returns a human-readable time difference', () => {
    const a = new Date(2017, 2, 5, 13);
    const b = new Date(2017, 2, 5, 11);
    const c = new Date(2016, 8, 9, 12, 5, 8);
    const d = new Date(2016, 8, 9, 12, 5, 7);
    const e = new Date(2016, 8, 9, 12, 5, 3);

    expect(formatTimeDifference(a, b)).toEqual('2 hours');
    expect(formatTimeDifference(c, d)).toEqual('1 second');
    expect(formatTimeDifference(c, e)).toEqual('5 seconds');
    expect(formatTimeDifference(a, d)).toEqual('177 days');
  });

  it('returns undefined for empty values', () => {
    expect(formatTimeDifference()).toBeUndefined();
    expect(formatTimeDifference(null, null)).toBeUndefined();
    expect(formatTimeDifference('', '')).toBeUndefined();
  });
});
