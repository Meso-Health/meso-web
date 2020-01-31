import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { REASONS_FOR_VISIT } from 'lib/config';
import { formatDate } from 'lib/formatters/date';
import Box from 'components/box';
import { TextField, SelectField, DatePicker } from 'components/inputs';

import {
  providerReasonsForVisitOptionsSelector,
  providerIsHealthCenterSelector,
} from 'store/providers/providers-selectors';

class CheckInIdentificationForm extends Component {
  static mapStateToProps = state => ({
    reasonForVisitOptions: providerReasonsForVisitOptionsSelector(state),
    isHealthCenter: providerIsHealthCenterSelector(state),
  });

  render() {
    const {
      medicalRecordNumber,
      reasonForVisit,
      handleFieldChange,
      handleDateChange,
      errors,
      isHealthCenter,
      date,
      reasonForVisitOptions,
    } = this.props;
    const showDateField = reasonForVisit === REASONS_FOR_VISIT.referral.value
      || reasonForVisit === REASONS_FOR_VISIT.follow_up.value;

    return (
      <>
        <Box marginBottom={5}>
          <TextField
            value={medicalRecordNumber}
            label="Medical Record Number"
            name="medicalRecordNumber"
            onChange={handleFieldChange}
            error={errors.medicalRecordNumber}
          />
        </Box>
        {!isHealthCenter && (
          <Box marginBottom={4}>
            <SelectField
              value={reasonForVisit}
              label="Reason For Visit"
              name="visitReason"
              options={reasonForVisitOptions}
              onChange={handleFieldChange}
              error={errors.visitReason}
            />
          </Box>
        )}
        {showDateField
          && (
            <>
              <Box marginBottom={4}>
                <DatePicker
                  label={reasonForVisit === REASONS_FOR_VISIT.referral.value ? 'Inbound Referral Date' : 'Follow-up Issue Date'}
                  onChange={handleDateChange}
                  defaultDate={formatDate(date)}
                  maxDate={formatDate(moment.now())}
                  name="date"
                  overlayCalendar={false}
                  error={errors.date}
                />
              </Box>
            </>
          )}
      </>
    );
  }
}

export default connect(
  CheckInIdentificationForm.mapStateToProps,
)(CheckInIdentificationForm);

CheckInIdentificationForm.propTypes = {
  isHealthCenter: PropTypes.bool.isRequired,
  medicalRecordNumber: PropTypes.string.isRequired,
  reasonForVisit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  date: PropTypes.shape({}), // moment object
  errors: PropTypes.shape({
    medicalRecordNumber: PropTypes.string,
    reasonForVisit: PropTypes.string,
    date: PropTypes.string,
    visitReason: PropTypes.string,
  }).isRequired,
  reasonForVisitOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

CheckInIdentificationForm.defaultProps = {
  date: null,
};
