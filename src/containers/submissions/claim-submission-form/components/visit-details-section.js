import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { keyBy, orderBy } from 'lodash/fp';

import {
  PATIENT_OUTCOMES,
  REFERRAL_FACILITIES,
  REFERRAL_FACILITY_OTHER,
  REFERRAL_REASONS,
} from 'lib/config';

import Box from 'components/box';
import { DatePicker, SelectField, TextField } from 'components/inputs';

class VisitDetailsSection extends PureComponent {
  render() {
    const {
      onChange,
      visitType,
      dischargeDate,
      patientOutcome,
      referralReceivingFacility,
      referralReceivingFacilityOther,
      referralNumber,
      referralDate,
      referralReason,
      currentUserProvider,
      serviceDate, // only used for constraints on datepickers
      maxDate, // only used for constraints on datepickers
      errors,
      providerVisitTypeOptions,
    } = this.props;

    const patientOutcomeOptions = Object.keys(PATIENT_OUTCOMES).map(stringToStore => (
      { value: stringToStore, name: PATIENT_OUTCOMES[stringToStore] }
    ));
    const referralReasonOptions = Object.keys(REFERRAL_REASONS).map(stringToStore => (
      { value: stringToStore, name: REFERRAL_REASONS[stringToStore] }
    ));
    const referralFacilityOptions = REFERRAL_FACILITIES
      .sort()
      .filter(facilityName => currentUserProvider.name !== facilityName)
      .map(facilityName => ({ value: facilityName, name: facilityName }));

    const visitTypes = keyBy('name', providerVisitTypeOptions);
    const visitTypeOptions = orderBy(['name'], ['asc'], providerVisitTypeOptions);

    return (
      <Box padding={4}>
        <Box marginBottom={4}>
          <SelectField
            name="visitType"
            label="Visit Type"
            labelProps={{ fontWeight: 'medium', fontSize: 3 }}
            options={[{ value: null, name: 'Select visit type...', isDischarge: false }, ...visitTypeOptions]}
            onChange={e => onChange(e.target.value, 'visitType')}
            value={visitType || ''}
            error={errors.visitType}
          />
        </Box>
        {visitType && visitTypes[visitType] && visitTypes[visitType].isDischarge && (
          <>
            <Box marginBottom={4}>
              <DatePicker
                label="Discharge Date"
                onChange={date => onChange(date, 'dischargeDate')}
                minDate={serviceDate}
                maxDate={maxDate}
                name="discharge-date"
                defaultDate={dischargeDate}
                error={errors.dischargeDate}
              />
            </Box>
          </>
        )}
        <Box marginBottom={4}>
          <SelectField
            name="patientOutcome"
            label="Patient Outcome"
            labelProps={{ fontWeight: 'medium', fontSize: 3 }}
            options={[{ value: null, name: 'Select patient outcome...' }, ...patientOutcomeOptions]}
            onChange={e => onChange(e.target.value, 'patientOutcome')}
            value={patientOutcome || ''}
            error={errors.patientOutcome}
          />
        </Box>
        {PATIENT_OUTCOMES[patientOutcome] === PATIENT_OUTCOMES.follow_up && (
          <>
            <Box marginBottom={4}>
              <DatePicker
                label="Follow-up Issue Date"
                onChange={date => onChange(date, 'referralDate')}
                minDate={serviceDate}
                maxDate={maxDate}
                name="followup-date"
                defaultDate={referralDate}
                error={errors.referralDate}
              />
            </Box>
          </>
        )}
        {PATIENT_OUTCOMES[patientOutcome] === PATIENT_OUTCOMES.referred && (
          <>
            <Box marginBottom={4}>
              <DatePicker
                label="Referral Date"
                onChange={date => onChange(date, 'referralDate')}
                minDate={serviceDate}
                maxDate={maxDate}
                name="referral-date"
                defaultDate={referralDate}
                error={errors.referralDate}
              />
            </Box>
            <Box marginBottom={4}>
              <SelectField
                name="referred-facility"
                label="Referred to Facility"
                labelProps={{ fontWeight: 'medium', fontSize: 3 }}
                options={[{ value: null, name: 'Select facility..', isDischarge: false }, ...referralFacilityOptions]}
                onChange={e => onChange(e.target.value, 'referralReceivingFacility')}
                value={referralReceivingFacility}
                error={errors.referralReceivingFacility}
              />
            </Box>
            {referralReceivingFacility === REFERRAL_FACILITY_OTHER && (
              <Box marginBottom={4}>
                <TextField
                  label="Other Facility"
                  labelProps={{ fontWeight: 'medium', fontSize: 3 }}
                  name="referred-facility-other"
                  placeholder="Facilty"
                  onChange={e => onChange(e.target.value, 'referralReceivingFacilityOther')}
                  value={referralReceivingFacilityOther}
                  error={errors.referralReceivingFacilityOther}
                />
              </Box>
            )}
            <Box marginBottom={4}>
              <SelectField
                label="Reason"
                labelProps={{ fontWeight: 'medium', fontSize: 3 }}
                name="referral-reason"
                placeholder="Reason"
                onChange={e => onChange(e.target.value, 'referralReason')}
                options={[{ value: null, name: 'Select reason..' }, ...referralReasonOptions]}
                value={referralReason}
                error={errors.referralReason}
              />
            </Box>
            <Box marginBottom={4}>
              <TextField
                label="Number (optional)"
                labelProps={{ fontWeight: 'medium', fontSize: 3 }}
                name="referral-number"
                placeholder="Number"
                onChange={e => onChange(e.target.value, 'referralNumber')}
                value={referralNumber}
              />
            </Box>
          </>
        )}
      </Box>
    );
  }
}

export default VisitDetailsSection;

VisitDetailsSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  visitType: PropTypes.string,
  patientOutcome: PropTypes.string,
  dischargeDate: PropTypes.string,
  serviceDate: PropTypes.string,
  referralReceivingFacility: PropTypes.string,
  referralReceivingFacilityOther: PropTypes.string,
  referralNumber: PropTypes.string,
  referralReason: PropTypes.string,
  referralDate: PropTypes.string,
  currentUserProvider: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  maxDate: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    visitType: PropTypes.string,
    dischargeDate: PropTypes.string,
    patientOutcome: PropTypes.string,
    referralDate: PropTypes.string,
    referralReceivingFacility: PropTypes.string,
    referralReason: PropTypes.string,
    referralReceivingFacilityOther: PropTypes.string,
  }).isRequired,
  providerVisitTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isDischarge: PropTypes.bool.isRequired,
  })).isRequired,
};

VisitDetailsSection.defaultProps = {
  serviceDate: null,
  dischargeDate: null,
  visitType: null,
  patientOutcome: null,
  referralReceivingFacility: null,
  referralReceivingFacilityOther: null,
  referralNumber: null,
  referralReason: null,
  referralDate: null,
};
