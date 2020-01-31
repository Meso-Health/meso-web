import { flow, includes, isUndefined, lowerCase, startCase } from 'lodash/fp';
/**
 * String utils
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHORT_UUID_REGEX = /^[0-9a-f]{8}$/i;
const MEMBERSHIP_NUMBER_REGEX = /^\d{2}\/\d{2}\/\d{2}\/[P,I]-\d{6}\/\d{2}$/;

export const caseInsensitiveIncludes = predicate => flow(lowerCase, includes(lowerCase(predicate)));
export const stripWhitespace = input => input.replace(/\s+/g, '');
export const titleCase = input => (isUndefined(input) ? undefined : startCase(lowerCase(input)));
export const isUUID = input => UUID_REGEX.test(input);
export const isShortUUID = input => SHORT_UUID_REGEX.test(input);
export const isMembershipNumber = input => MEMBERSHIP_NUMBER_REGEX.test(input);
