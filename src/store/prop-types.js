import PropTypes from 'prop-types';

export const userPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  providerId: PropTypes.number,
  providerType: PropTypes.string,
  administrativeDivisionId: PropTypes.number,
  addedBy: PropTypes.string,
  securityPin: PropTypes.string,
  adjudicationLimit: PropTypes.number,
});

export const providerPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  administrativeDivisionId: PropTypes.number,
  providerType: PropTypes.string,
});

export const reimbursementPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  providerId: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  completedAt: PropTypes.string,
  paymentDate: PropTypes.string,
  claimCount: PropTypes.number.isRequired,
  startDate: PropTypes.shape({}).isRequired,
  endDate: PropTypes.shape({}).isRequired,
});

export const memberPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  enrolledAt: PropTypes.string.isRequired,
  absentee: PropTypes.bool.isRequired,
  cardId: PropTypes.string,
  fullName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired, // limit to M or F
  age: PropTypes.number.isRequired,
  birthdate: PropTypes.string.isRequired,
  birthdateAccuracy: PropTypes.string.isRequired, // limit to Y M D
  phoneNumber: PropTypes.string.isRequired,
  fingerprintsGuid: PropTypes.string.isRequired,
  preferredLanguage: PropTypes.string.isRequired,
  membershipNumber: PropTypes.string.isRequired,
  medicalRecordNumber: PropTypes.string,
  profession: PropTypes.string.isRequired,
  relationshipToHead: PropTypes.string.isRequired,
  archivedAt: PropTypes.string,
  archivedReason: PropTypes.string,
  householdId: PropTypes.string.isRequired,
  administrativeDivisionId: PropTypes.number.isRequired,
  coverageEndDate: PropTypes.string.isRequired,
  renewedAt: PropTypes.string.isRequired,
  needsRenewal: PropTypes.bool,
  unpaid: PropTypes.bool.isRequired,
});

export const encounterPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  providerId: PropTypes.number,
  memberId: PropTypes.string,
  identificationEventId: PropTypes.string.isRequired,
  claimId: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  updatedAt: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  occurredAt: PropTypes.string.isRequired,
  backdatedOccurredAt: PropTypes.bool.isRequired,
  preparedAt: PropTypes.string.isRequired,
  submittedAt: PropTypes.string,
  submissionState: PropTypes.string,
  adjudicationState: PropTypes.string,
  adjudicatorId: PropTypes.number,
  adjudicatedAt: PropTypes.string,
  adjudicationReason: PropTypes.string,
  adjudicationReasonCategory: PropTypes.string,
  adjudicationComment: PropTypes.string,
  revisedEncounterId: PropTypes.string,
  resubmitted: PropTypes.bool.isRequired,
  submitterName: PropTypes.string,
  adjudicatorName: PropTypes.string,
  auditorName: PropTypes.string,
  visitType: PropTypes.string.isRequired,
  dischargeDate: PropTypes.string,
  visitReason: PropTypes.string,
  inboundReferralDate: PropTypes.string,
  patientOutcome: PropTypes.string,
  providerComment: PropTypes.string,
  price: PropTypes.number.isRequired,
  memberUnconfirmed: PropTypes.bool.isRequired,
  memberInactiveAtTimeOfService: PropTypes.bool.isRequired,
  inboundReferralUnlinked: PropTypes.bool.isRequired,
  encounterItems: PropTypes.arrayOf(PropTypes.shape({})),
  priceSchedules: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
  billable: PropTypes.shape({}),
  referrals: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  diagnosisIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  diagnoses: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  reimbursementId: PropTypes.string,
  reimbursementCreatedAt: PropTypes.string,
  reimbursementCompletedAt: PropTypes.string,
  reimbursalAmount: PropTypes.number.isRequired,
  clinicNumber: PropTypes.number,
  clinicNumberType: PropTypes.string,
  hasFever: PropTypes.bool,
  copaymentPaid: PropTypes.bool,
  member: PropTypes.oneOfType([memberPropType, PropTypes.string]).isRequired,
});

export const claimPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  encounters: PropTypes.objectOf(encounterPropType),
  lastEncounter: encounterPropType,
  lastSubmittedAt: PropTypes.string.isRequired,
  originallySubmittedAt: PropTypes.string.isRequired,
});

export const administrativeDivisionPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  code: PropTypes.string,
  parentId: PropTypes.number,
});

export const historyPropType = PropTypes.shape({
  push: PropTypes.func,
  location: PropTypes.shape(),
});
