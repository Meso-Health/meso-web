import React from 'react';
import PropTypes from 'prop-types';

import { SelectField } from 'components/inputs';

const EMPTY_VALUE = -1;

const GenderField = ({ errors, handleChange, label }) => (
  <SelectField
    name="gender"
    error={errors.gender}
    label={label}
    options={[{ value: EMPTY_VALUE, name: 'Select a gender...' }, { value: 'F', name: 'Female' }, { value: 'M', name: 'Male' }]}
    onChange={handleChange}
  />
);

export default GenderField;

GenderField.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

GenderField.defaultProps = {
  label: null,
};
