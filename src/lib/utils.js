import {
  compact, every, extend, filter, flow, includes, isEmpty,
  isFunction, isPlainObject, isArray, isUndefined, toLower, map, omitBy, once,
  over, property, round, snakeCase, some, values,
} from 'lodash/fp';
import camelCase from 'camelcase-keys-all-env';
import { caseInsensitiveIncludes } from 'lib/string-utils';
import { toGregorian, toEthiopian } from 'ethiopian-date';

const valuesForKeys = flow(map(property), over);

/**
 * Returns a function which filters an array of objects whose value
 * value of the key field matches the supplied value.
 *
 * @param {String} value
 * @param {String} key
 * @return {Function}
 */
export function where(value, key) {
  return filter(obj => obj[key] === value);
}

export function isMobileDevice() {
  return navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|Blackberry|Windows Phone/i);
}

/**
 * Returns a function which, given an array of objects, filters them by the
 * predicate searching the specified object keys.
 *
 * @param {String} predicate
 * @param {Array<String>} keys
 * @return {Function}
 */
export function filterByPredicate(predicate, keys) {
  if (isEmpty(predicate)) {
    return data => data;
  }

  const anyCaseInsensitiveMatches = some(caseInsensitiveIncludes(predicate));
  const isMatch = flow(valuesForKeys(keys), compact, anyCaseInsensitiveMatches);

  return filter(isMatch);
}

/**
 * Returns a string that's safe to use as a filename.
 */
export const getFileSystemSafeName = input => input.replace(/[^a-z0-9_-]/gi, '_');

/**
 * Array utils
 */

/**
 * Returns a function that, when passed an Array, returns a new Array with the
 * given index replaced with the new item.
 *
 * @param {Number} index Array index to replace value
 * @param {any} item Value to replace into new array
 * @return {Function}
 */
export const replaceItemAtIndex = (index, item) => arr => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index + 1),
];

/**
 * Returns a function that, when passed an Array, returns a new Array with the
 * given index removed.
 *
 * @param {Number} index Array index to remove value
 * @return {Function}
 */
export const deleteItemAtIndex = index => arr => [...arr.slice(0, index), ...arr.slice(index + 1)];

/**
 * Object utils
 */

/**
 * Returns a new object with all undefined values removed.
 *
 * @param {Object} input
 * @return {Object}
 */
export const omitUndefined = omitBy(isUndefined);

/**
 * Recursively maps an object, returning a new object where the keys have been
 * modified by the iterator.
 *
 * @param {Object} input
 * @param {Function} iteratee
 * @return {Object}
 */
export const deepMapKeys = (input, iteratee) => {
  if (!isPlainObject(input)) return input;
  const result = {};

  Object.keys(input).forEach((key) => {
    let value = input[key];
    if (isPlainObject(value)) {
      value = deepMapKeys(value, iteratee);
    }
    if (isArray(value)) {
      value = value.map(v => deepMapKeys(v, iteratee));
    }
    result[iteratee(key, value)] = value;
  });

  return result;
};

/**
 * Returns a new object with all keys in snake case. Also converts deeply nested keys.
 *
 * @param {Object} input
 * @return {Object}
 */
export const snakeCaseObject = input => deepMapKeys(input, key => snakeCase(key));

/**
 * Returns a new object with all keys in camel case. Shallow, does not convert
 * deeply nested keys.
 *
 * @param {Object} input
 * @return {Object}
 */
export const camelCaseObject = camelCase;

/**
 * Checks if any keys of an object have non-empty values.
 *
 * @param {Object} input
 * @return {Boolean}
 */
export const isObjectEmpty = input => !values(input).some(x => !isEmpty(x));

export const objectHasProp = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Number utils
 */

/**
 * Converts two numbers to a percentage without any decimals.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 */
export const toPercentage = (a, b) => round((a / b) * 100);

/**
 * Function utils
 */

/**
  * Calls `fn` if it is a function. Otherwise, it returns `fn`. Passes in other
  * arguments as arguments to `fn` if called.
  *
  * @param {Function|Any} fn
  * @param {...Any} args
  * @return {Any}
  */
export function maybeCall(fn, ...args) {
  return typeof fn === 'function' ? fn(...args) : fn;
}

/**
 * Checks if any expression in an array evaluates to true. Used as a shorthand
 * for checking multiple conditions.
 *
 * @param {Array<Boolean>} input
 * @return {Boolean}
 */
export const or = some(Boolean);

/**
 * Checks if every expression in an array evaluates to true. Used as a shorthand
 * for checking multiple conditions.
 *
 * @param {Array<Boolean>} input
 * @return {Boolean}
 */
export const and = every(Boolean);

/**
 * Checks if an object is a Promise.
 *
 * @param {Any} input
 * @return {Boolean}
 */
export const isPromise = input => input && isFunction(input.then);

/**
 * Date utils
 */

/**
 * Returns an array of moment instances spanning from `start` to `end`, divided
 * by the given `interval`. The `interval` can be any value accepted by
 * moment.add (docs are here: http://momentjs.com/docs/#/manipulating/add/)
 *
 * This implementation was adapted from moment-range (https://git.io/vxHJM)
 *
 * @param {Moment} start
 * @param {Moment} end
 * @param {String} interval
 * @return {Array<Moment>}
 */
export function momentRangeBy(start, end, interval) {
  return Array.from({
    [Symbol.iterator]() {
      const diff = Math.abs(start.diff(end, interval));
      let iteration = 0;

      return {
        next() {
          const current = start.clone().add(iteration, interval);
          const done = !(iteration <= diff);

          iteration += 1;

          return { done, value: done ? undefined : current };
        },
      };
    },
  });
}

/*
 * Checks if date is within start and end dates (inclusive), note: dates must be moments when defined.
 * When the date param is null, the range becomes open-ended.
 */
export function isWithinDates(date, startDate, endDate) {
  return (startDate == null || date.isSameOrAfter(startDate, 'day'))
         && (endDate == null || date.isSameOrBefore(endDate, 'day'));
}

/**
 * Converts an Ethiopian date to an Gregorian date
 *
 * @return {Array<String>} YYYY, MM, DD
 */
export function ethiopianToGregorian(year, month, day) {
  return toGregorian(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
}

/**
 * Converts a Gregorian date to an Ethiopian date
 *
 * @return {Array<String>} YYYY, MM, DD
 */
export function gregorianToEthiopian(year, month, day) {
  return toEthiopian(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
}

/**
 * Auth utils
 */

/**
 * Returns a function which, given a role, checks if it is included in a list
 * of roles.
 *
 * @param {Array<String>} roles
 * @return {Function}
 */
export const matchesRole = roles => (role) => {
  const lowerCaseRole = toLower(role);

  if (Array.isArray(roles)) {
    return includes(lowerCaseRole)(roles);
  }

  return lowerCaseRole === roles;
};

/**
 * Miscellaneous utils
 */

/**
 * Downloads the supplied javascript object as a json file.
 *
 * @param {Array} rows: An array of strings for each row.
 * @param {String} filename Filename for the downloaded .txt file
 */
export function downloadTextFile(rows, filename) {
  const downloadLink = document.createElement('a');
  const blob = new Blob([rows.join('\n')], { type: 'text' });
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

/**
 * Downloads the supplied javascript object as a json file.
 *
 * @param {Object} obj Any serializable javascript object
 * @param {String} filename Filename for the downloaded .json file
 */
export function downloadObjectAsJson(obj, filename) {
  const jsonString = JSON.stringify(obj);
  const downloadLink = document.createElement('a');
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

/**
 * Log an error to the console, only in development mode.
 *
 * @param {String} message
 */
export function warn(message) {
  if (process.env.NODE_ENV === 'development') {
    console.error(message); // eslint-disable-line
  }
}

export const warnOnce = once(warn);

export const API_HTTP_CODES_TO_ERROR_MESSAGES = {
  401: 'There was an error while authenticating with the server. Log out and try again.',
  403: 'You are not allowed to access this site.',
  404: 'Couldn’t connect to the server. Try again later, or contact support.',
  500: 'There was an error with the server. Try again later, or contact support.',
  504: 'Couldn’t connect to the server. Are you online?',
};

export function getErrorMessage(err, customStatusMessages = {}) {
  const serverError = err.response;

  if (serverError) {
    const { status } = serverError;
    const statusMessages = extend(API_HTTP_CODES_TO_ERROR_MESSAGES)(customStatusMessages);

    if (statusMessages[status]) {
      return statusMessages[status];
    }
    return `An unknown error occurred${status ? ` (Code: ${status})` : ''}`;
  }

  return err.message
    ? `An unknown error occurred (${err.message})`
    : 'An unknown error occurred';
}

export function formatServerError(err) {
  const serverError = err.response;

  if (serverError && serverError.data) {
    return { 422: { validationErrors: camelCaseObject(serverError.data.errors) } };
  }

  return {};
}
