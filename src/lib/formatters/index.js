import {
  first,
  isArray,
  isFinite,
  isNil,
  isString,
  titleCase,
} from 'lodash/fp';
import { isUUID, stripWhitespace } from 'lib/string-utils';
import { apiConfig, PROFESSIONS, RELATIONSHIPS } from 'lib/config';
import { objectHasProp } from 'lib/utils';

const { BASE_URL } = apiConfig;

// NOTE: Lodash's `isEmpty` only checks collections (arrays and objects),
// meaning it treats numbers and strings incorrectly. Hence, this function.
export const isEmpty = (val) => {
  if (isNil(val)) {
    return true;
  }
  if (isString(val)) {
    return val.length === 0;
  }
  return false;
};

export const formatUploadCount = (count) => {
  if (!count) {
    return 'All uploaded';
  }
  return `${count} to upload`;
};

export function formatCardId(cardId) {
  if (isEmpty(cardId)) {
    return undefined;
  }
  return stripWhitespace(cardId)
    .replace(/([^A-Za-z0-9])/g, '')
    .replace(/(.{3})/g, '$1 ')
    .toUpperCase()
    .trim();
}

export function formatCardIdQuery(cardId) {
  if (isEmpty(cardId)) {
    return undefined;
  }
  return stripWhitespace(cardId)
    .replace(/([^A-Za-z0-9])/g, '')
    .toUpperCase()
    .trim();
}

export function formatMembershipNumber(membershipNumber) {
  // TODO: Make this more generalizable to different types of membership numbers
  return membershipNumber.trim();
}

// TODO check this out
// eslint-disable-next-line consistent-return
export function formatClinicNumberType(clinicNumber) {
  if (clinicNumber === 'delivery') {
    return 'Delivery';
  }

  if (clinicNumber === 'opd') {
    return 'OPD';
  }
}

export function formatFieldWithOther(value, otherValue) {
  if (value === 'other') {
    return `${titleCase(otherValue)} (other)`;
  }

  return titleCase(value);
}

export function formatGender(char) {
  if (isEmpty(char) || char.length === 0) {
    return undefined;
  }

  const key = char
    .toString()
    .toUpperCase()
    .trim();

  switch (key) {
    case 'M':
      return 'Male';
    case 'F':
      return 'Female';
    default:
      return undefined;
  }
}

export function formatRelationship(relationship) {
  if (isEmpty(relationship) || relationship.length === 0 || !objectHasProp(RELATIONSHIPS, relationship)) {
    return undefined;
  }
  return RELATIONSHIPS[relationship];
}

export function formatProfession(profession) {
  if (isEmpty(profession) || profession.length === 0 || !objectHasProp(PROFESSIONS, profession)) {
    return undefined;
  }
  return PROFESSIONS[profession];
}

export function formatLatLong(lat, lng) {
  if (isEmpty(lat) || isEmpty(lng)) {
    return undefined;
  }
  return `${lat}, ${lng}`;
}

export function formatPhoneNumber(phoneNumber) {
  if (isEmpty(phoneNumber) || phoneNumber.length === 0) {
    return undefined;
  }
  return stripWhitespace(phoneNumber)
    .replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function formatPhotoUrl(photoUrl, baseUrl = BASE_URL) {
  let baseUrlWithoutTrailingSlash = baseUrl;
  if (baseUrl.endsWith('/')) {
    baseUrlWithoutTrailingSlash = baseUrl.slice(0, -1);
  }
  if (!isNil(photoUrl) && photoUrl.startsWith('/')) {
    return `${baseUrlWithoutTrailingSlash}${photoUrl}`;
  }
  return photoUrl;
}

export function formatNumber(number) {
  if (isEmpty(number) || !isFinite(number)) {
    return undefined;
  }

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatShortId(id) {
  if (isEmpty(id)) {
    return undefined;
  }

  if (!isUUID(id)) {
    return undefined;
  }

  return first(id.split('-')).toUpperCase();
}

export function formatBirthdate(birthdate, accuracy) {
  if (accuracy === 'Y') {
    return birthdate.replace(/(\d{4})(-\d{2})(-\d{2})/, '$1-__-__');
  } if (accuracy === 'M') {
    return birthdate.replace(/(\d{4})(-\d{2})(-\d{2})/, '$1$2-__');
  }
  return birthdate;
}

export function formatStringArray(strings) {
  if (!isArray(strings)) {
    return undefined;
  }
  return strings.join(', ');
}
