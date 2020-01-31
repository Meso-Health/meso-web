import React from 'react';
import PropTypes from 'prop-types';
import { reduce } from 'lodash/fp';

import { PROFESSIONS } from 'lib/config';
import { SelectField } from 'components/inputs';

const ProfessionField = ({ errors, handleChange }) => (
  <SelectField
    name="profession"
    error={errors.profession}
    options={reduce((acc, key) => (
      [...acc, { value: key, name: PROFESSIONS[key] }]
    ), [{ value: '', name: 'Select a profession...' }])(Object.keys(PROFESSIONS))}
    onChange={handleChange}
  />
);

export default ProfessionField;

ProfessionField.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  handleChange: PropTypes.func.isRequired,
};
