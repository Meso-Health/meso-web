import React from 'react';
import PropTypes from 'prop-types';

import { AGE_UNITS } from 'lib/config';

import Box from 'components/box';
import { TextField, SelectField } from 'components/inputs';

import GenderField from 'containers/edit-object-form/components/gender-field';

const ageUnitOptions = [
  { value: AGE_UNITS.YEARS, name: 'Years' },
  { value: AGE_UNITS.MONTHS, name: 'Months' },
  { value: AGE_UNITS.DAYS, name: 'Days' },
];

const MemberForm = ({
  membershipNumber,
  fullName,
  age,
  handleFieldChange,
  errors,
  membershipNumberEditable = true,
}) => (
  <>
    <Box marginBottom={4}>
      <TextField
        value={membershipNumber}
        label="Beneficiary ID"
        name="membershipNumber"
        onChange={handleFieldChange}
        disabled={!membershipNumberEditable}
        error={errors.membershipNumber && (
          membershipNumberEditable
            ? errors.membershipNumber
            : `${errors.membershipNumber}. Must cancel and start a new search.`
        )}
      />
    </Box>
    <Box marginBottom={4}>
      <GenderField
        label="Gender"
        errors={errors}
        handleChange={handleFieldChange}
      />
    </Box>
    <Box marginBottom={4}>
      <TextField
        value={fullName}
        label="Name"
        name="fullName"
        onChange={handleFieldChange}
        error={errors.fullName}
      />
    </Box>
    <Box flex marginBottom={4}>
      <Box flex alignItems="flex-end" width="100%">
        <Box width="100%" marginRight={3}>
          <TextField
            value={age}
            label="Age"
            name="age"
            onChange={handleFieldChange}
            error={errors.age}
          />
        </Box>
        <Box width="100%">
          <SelectField
            name="ageUnit"
            error={errors.ageUnit}
            options={ageUnitOptions}
            onChange={handleFieldChange}
          />
        </Box>
      </Box>
    </Box>
  </>
);

MemberForm.propTypes = {
  membershipNumber: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    membershipNumber: PropTypes.string,
    fullName: PropTypes.string,
    gender: PropTypes.string,
    name: PropTypes.string,
    age: PropTypes.string,
    ageUnit: PropTypes.string,
  }).isRequired,
  membershipNumberEditable: PropTypes.bool,
};

MemberForm.defaultProps = {
  membershipNumberEditable: true,
};

export default MemberForm;
