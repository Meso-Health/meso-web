import React from 'react';
import PropTypes from 'prop-types';

import { AGE_UNITS } from 'lib/config';
import { formatDate, formatAgeFromBirthdate } from 'lib/formatters/date';

import MetadataItem from './metadata-item';

const BirthdateItem = ({ member, name }) => {
  const label = member.birthdateAccuracy === AGE_UNITS.DAYS
    ? 'Birthdate'
    : 'Age';
  const value = member.birthdateAccuracy === AGE_UNITS.DAYS
    ? formatDate(member.birthdate)
    : formatAgeFromBirthdate(member.birthdate, member.birthdateAccuracy);

  return (<MetadataItem name={name} label={label} value={value} />);
};

export default BirthdateItem;

BirthdateItem.propTypes = {
  member: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
};

BirthdateItem.defaultProps = {
  name: 'birthdate',
};
