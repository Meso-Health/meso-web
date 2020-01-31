import React from 'react';
import PropTypes from 'prop-types';

import { ErrorLabel } from 'components/alerts';

const PhotoField = ({ errors, handleChange }) => (
  <div>
    <input
      type="file"
      name="photo"
      accept="image/*"
      onChange={handleChange}
    />
    {errors.photo && (
      <ErrorLabel>{errors.photo}</ErrorLabel>
    )}
  </div>
);

export default PhotoField;

PhotoField.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  handleChange: PropTypes.func.isRequired,
};
