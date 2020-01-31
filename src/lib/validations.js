import {
  REASONS_FOR_VISIT,
  AGE_UNITS,
  REFERRAL_REASONS,
  PATIENT_OUTCOMES,
  validations,
} from 'lib/config';

const EMPTY_VALUE = -1;

export const validators = {
  name: {
    isValid: name => !(/^[\d\s]+$/i).test(name) && name.length > 0,
    errorMessage: 'Enter a valid name',
  },

  fullName: {
    isValid: fullName => fullName.split(' ').length >= validations.MEMBER_FULL_NAME_MIN_LENGTH && fullName.length > 0,
    errorMessage: `${validations.MEMBER_FULL_NAME_MIN_LENGTH} name(s) are required`,
  },

  age: {
    isValid: age => (/^[0-9]*$/i).test(age) && parseInt(age, 10) <= 200,
    errorMessage: 'Enter a valid age. Must be 200 or less.',
  },

  ageUnit: {
    isValid: ageUnit => ageUnit && ageUnit !== EMPTY_VALUE && Object.values(AGE_UNITS).includes(ageUnit),
    errorMessage: 'Required',
  },

  // TODO: Could this be more configurable to different formats?
  membershipNumber: {
    isValid: membershipNumber => membershipNumber.length > 0,
    errorMessage: 'Enter a valid membership number',
  },

  profession: {
    isValid: profession => !(/^[\d\s]+$/i).test(profession) && profession.length > 0,
    errorMessage: 'Enter a valid profession',
  },

  username: {
    isValid: username => (/^[0-9a-z-_]*$/i).test(username) && username.length > 0,
    errorMessage: 'Enter a valid username',
    formatter: input => input.replace(/[^0-9a-z-_]/gi, ''),
  },

  phoneNumber: {
    isValid: phoneNumber => (/^[0-9]*$/i).test(phoneNumber) && phoneNumber.length > 0 && phoneNumber.length <= 10,
    errorMessage: 'Enter a valid phone number',
  },

  gender: {
    isValid: gender => gender === 'F' || gender === 'M',
    errorMessage: 'Enter a valid gender',
  },

  password: {
    isValid: password => (/^\d{6}$/i).test(password) && password.length > 0,
    errorMessage: 'Enter a numeric 6-digit pin',
    formatter: input => input.replace(/\D/g, '').substring(0, 6),
  },

  passwordConfirmation: {
    isValid: (password, context) => (password === context.password) && password.length > 0,
    errorMessage: 'Pin did not match',
    formatter: input => input.replace(/\D/g, '').substring(0, 6),
  },

  providerId: {
    isValid: providerId => providerId && providerId !== 0,
    errorMessage: 'Provider is required',
  },

  photo: {
    isValid: photoUrl => photoUrl.length > 0,
    errorMessage: 'Photo is required',
  },

  number: {
    isValid: number => (/^[0-9]*$/i).test(number) && number.length > 0,
    errorMessage: 'Enter a valid number',
  },

  medicalRecordNumber: { // TODO verify what validation MRN needs
    isValid: number => (/^[0-9]*$/i).test(number) && number.length >= 5,
    errorMessage: 'Enter a valid MRN',
  },

  visitReason: {
    isValid: reason => reason && reason !== EMPTY_VALUE && Object.keys(REASONS_FOR_VISIT).includes(reason),
    errorMessage: 'Reason for visit is required',
  },

  visitType: {
    isValid: (visitType, context) => {
      const { visitTypeOptions } = context;
      return visitType && visitTypeOptions.map(option => option.name).includes(visitType);
    },
    errorMessage: 'Visit type is required',
  },

  patientOutcome: {
    isValid: patientOutcome => patientOutcome && Object.keys(PATIENT_OUTCOMES).includes(patientOutcome),
    errorMessage: 'Patient outcome is required',
  },

  dischargeDate: {
    isValid: dischargeDate => dischargeDate,
    errorMessage: 'Discharge date is required',
  },

  requiredDatePicker: {
    isValid: date => date && date !== EMPTY_VALUE,
    errorMessage: 'Date is required',
  },

  referralReceivingFacility: {
    isValid: receivingFacility => receivingFacility,
    errorMessage: 'Receiving Facility is required',
  },

  referralReason: {
    isValid: referralReason => referralReason && Object.keys(REFERRAL_REASONS).includes(referralReason),
    errorMessage: 'Reason is required',
  },

  comment: {
    isValid: comment => comment && comment.length > 0,
    errorMessage: 'Comment is required for resubmission',
  },
};

export function validateField(validator, field, context = null) {
  const args = context ? [field, context] : [field];
  return validator.isValid(...args) ? '' : validator.errorMessage;
}
