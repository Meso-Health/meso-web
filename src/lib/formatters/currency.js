import { isFinite } from 'lodash/fp';
import { localeConsts, CURRENCIES, CURRENCY_FORMATS } from 'lib/config';
import { isEmpty } from './index';

const { CURRENCY_FORMAT } = localeConsts;

function formatUgandanCurrency(number) {
  if (isEmpty(number) || !isFinite(number)) {
    return undefined;
  }

  return number.toLocaleString();
}

function formatUnspecifiedCurrency(number) {
  if (isEmpty(number) || !isFinite(number)) {
    return undefined;
  }

  return number.toLocaleString();
}

export function formatCurrency(number, currencyFormat = CURRENCY_FORMAT) {
  switch (currencyFormat) {
    case CURRENCY_FORMATS.UNSPECIFIED:
      return formatUnspecifiedCurrency(number);
    case CURRENCY_FORMATS.UGANDAN:
      return formatUgandanCurrency(number);
    default:
      return formatUnspecifiedCurrency(number);
  }
}

function formatUnspecifiedCurrencyWithLabel(number) {
  if (isEmpty(number)) {
    return undefined;
  }

  return `${number}`;
}

function formatUgandanCurrencyWithLabel(number) {
  if (isEmpty(number)) {
    return undefined;
  }

  return `${number} ${CURRENCIES.UGANDAN}`;
}

export function formatCurrencyWithLabel(number, currencyFormat = CURRENCY_FORMAT) {
  if (isEmpty(number) || !isFinite(number)) {
    return undefined;
  }

  switch (currencyFormat) {
    case CURRENCY_FORMATS.UNSPECIFIED:
      return formatUnspecifiedCurrencyWithLabel(formatUnspecifiedCurrency(number));
    case CURRENCY_FORMATS.UGANDAN:
      return formatUgandanCurrencyWithLabel(formatUgandanCurrency(number));
    default:
      return formatUnspecifiedCurrencyWithLabel(formatUnspecifiedCurrency(number));
  }
}

function removeUnspecifiedCurrencyFormat(currency) {
  return parseInt(currency.replace(/\D/g, ''), 10);
}

function removeUgandanCurrencyFormat(currency) {
  return parseInt(currency.replace(/\D/g, ''), 10);
}

export function removeCurrencyFormatting(currency, currencyFormat = CURRENCY_FORMAT) {
  switch (currencyFormat) {
    case CURRENCY_FORMATS.UNSPECIFIED:
      return removeUnspecifiedCurrencyFormat(currency);
    case CURRENCY_FORMATS.UGANDAN:
      return removeUgandanCurrencyFormat(currency);
    default:
      return removeUnspecifiedCurrencyFormat(currency);
  }
}
