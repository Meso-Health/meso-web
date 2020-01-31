import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from 'components/inputs';
import Box from 'components/box';

const PasswordField = ({ object, errors, handleChange }) => (
  <div>
    <TextField
      value={object.password}
      error={errors.password}
      label="6-digit pin"
      name="password"
      onChange={handleChange}
    />
    <Box marginTop={4}>
      <TextField
        value={object.passwordConfirmation}
        error={errors.passwordConfirmation}
        label="Confirm 6-digit pin"
        name="passwordConfirmation"
        onChange={handleChange}
      />
    </Box>
  </div>
);

export default PasswordField;

PasswordField.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  object: PropTypes.shape({}).isRequired,
  handleChange: PropTypes.func.isRequired,
};
