import React from 'react';
import PropTypes from 'prop-types';

import { capitalize, lowerCase } from 'lodash/fp';

import { TextField } from 'components/inputs';

const GenericField = ({ field, object, errors, handleChange }) => (
  <TextField
    value={object[field]}
    error={errors[field]}
    label={capitalize(lowerCase(field))}
    name={field}
    onChange={handleChange}
  />
);

export default GenericField;

GenericField.propTypes = {
  field: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  object: PropTypes.shape({}).isRequired,
  handleChange: PropTypes.func.isRequired,
};
