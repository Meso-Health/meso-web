
export const enrollmentPermissions = [
  'enrollment_workflow',
  'read:enrollment_periods',
  'create:members',
  'update:members',
  'search:households',
  'read:membership_payments',
  'create:membership_payments',
  'read:household_enrollment',
  'create:household_enrollment',
  'create:member_enrollment',
  'read:administrative_divisions',
];

export const membershipPermissions = [
  'membership',
  'search:households',
  'read:members',
  'update:members',
  'read:enrollment_periods',
  'read:household_enrollment',
  'read:administrative_division',
];

export const memberViewOnlyPermissions = [
  'member_view_only',
  'search:households',
  'read:members',
  'read:enrollment_periods',
  'read:household_enrollment',
  'read:administrative_division',
];

export const identificationPermissions = [
  'identification_workflow',
  'create:id_event',
  'update:id_event',
  'create:encounters_provider',
  'read:encounters_provider',
  'update:encounters_provider',
  'search:households',
  'read:members',
  'create:members',
  'update:members',
  'update:member_photo',
  // TODO: verify if identification should be able to edit all info
  'read:enrollment_periods',
  'read:household_enrollment',
  'read:administrative_division',
];

export const claimsViewOnlyPermissions = [
  'claims_view_only',
  'read:price_schedules_provider',
  'read:billables_provider',
  'read:encounters_provider',
  'read:members',
  'read:users',
  'read:diagnoses',
];

export const claimsPreparationPermissions = [
  // TODO: Technically this always includes being able to manually prepare a claim
  // which will create an identification event. We will need to consider that when we move
  // this to the backend.
  'claims_preparation_workflow',
  'create:price_schedules_provider',
  'read:price_schedules_provider',
  'create:billables_provider',
  'read:billables_provider',
  'read:encounters_provider',
  'create:encounters_provider',
  'read:members',
  'read:users',
  'read:diagnoses',
];

export const claimsResubmissionPermissions = [
  'claims_resubmission_workflow',
  'create:price_schedules_provider',
  'read:price_schedules_provider',
  'create:billables_provider',
  'read:billables_provider',
  'read:encounters_provider',
  'update:encounters_provider',
  'read:members',
  'read:users',
  'read:diagnoses',
];

export const claimsApprovalPermissions = [
  'claims_approval_workflow',
  'read:price_schedules_provider',
  'read:billables_provider',
  'read:encounters_provider',
  'update:encounters_provider',
  'read:members',
  'read:users',
  'read:diagnoses',
];

export const claimsAdjudicationPermissions = [
  'claims_adjudication_workflow',
  'read:encounters_all',
  'update:encounters_all',
  'read:enrollment_periods',
  'read:diagnoses',
  'read:administrative_divisions',
  'read:household_enrollment',
  'read:billables_all',
  'read:price_schedules_all',
  'read:members',
  'read:users',
  'read:providers',
];

export const reimbursementPaymentPermissions = [
  'reimbursement_payment_workflow',
  'read:encounters_all',
  'read:reimbursements',
  'update:reimbursements',
  'read:billables_all',
  'read:price_schedules_all',
  'read:providers',
];

export const claimsReimbursementPermissions = [
  'claims_reimbursement_workflow',
  'read:encounters_all',
  'update:encounters_all',
  'read:reimbursements',
  'update:reimbursements',
  'create:reimbursements',
  'read:billables_all',
  'read:price_schedules_all',
  'read:providers',
];

export const reimbursementsViewOnlyPermissions = [
  'reimbursement_view_only',
  'read:encounters_all',
  'read:reimbursements',
  'read:billables_all',
  'read:price_schedules_all',
  'read:providers',
];

export const enrollmentStatisticsPermissions = [
  'enrollment_statistics',
  'read:enrollment_stats',
  'read:administrative_divisions',
];

export const claimsStatisticsPermissions = [
  'claims_statistics',
  'read:claims_stats',
  'read:administrative_divisions',
];

export const reimbursementStatisticsPermissions = [
  'reimbursement_statistics',
  'read:reimbursement_stats',
  'read:administrative_divisions',
];

export const externalClaimsViewPermissions = [
  'read_external_claims',
  'read:encounters_all',
  'read:enrollment_periods',
  'read:diagnoses',
  'read:administrative_divisions',
  'read:household_enrollment',
  'read:billables_all',
  'read:price_schedules_all',
  'read:members',
  'read:users',
  'read:providers',
];

// ROLES

export const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  PAYER_ADMIN: 'payer_admin',
  ADJUDICATION: 'adjudication',
  ENROLLMENT: 'enrollment',
  PROVIDER_ADMIN: 'provider_admin',
  IDENTIFICATION: 'identification',
  SUBMISSION: 'submission',
};

export const ALLOWED_USER_ROLES = [
  ROLES.PAYER_ADMIN,
  ROLES.ADJUDICATION,
  ROLES.ENROLLMENT,
  ROLES.PROVIDER_ADMIN,
  ROLES.IDENTIFICATION,
  ROLES.SUBMISSION,
];

export const ROLE_PERMISSIONS = {
  system_admin: [
    // All admin operations done through the admin panel
    ROLES.SYSTEM_ADMIN,
  ],
  payer_admin: [
    ROLES.PAYER_ADMIN,
    ...claimsAdjudicationPermissions,
    ...claimsReimbursementPermissions,
    ...claimsStatisticsPermissions,
    ...claimsViewOnlyPermissions,
    ...enrollmentStatisticsPermissions,
    ...memberViewOnlyPermissions,
    ...reimbursementStatisticsPermissions,
    ...reimbursementsViewOnlyPermissions,
  ],
  adjudication: [
    ROLES.ADJUDICATION,
    ...memberViewOnlyPermissions,
    ...claimsAdjudicationPermissions,
    ...claimsStatisticsPermissions,
    ...reimbursementStatisticsPermissions,
    ...claimsReimbursementPermissions,
    ...reimbursementPaymentPermissions,
  ],
  enrollment: [
    ROLES.ENROLLMENT,
    ...enrollmentPermissions,
    ...enrollmentStatisticsPermissions,
  ],
  provider_admin: [
    ROLES.PROVIDER_ADMIN,
    ...identificationPermissions,
    ...claimsApprovalPermissions,
    ...claimsPreparationPermissions,
    ...claimsStatisticsPermissions,
    ...claimsViewOnlyPermissions,
    ...externalClaimsViewPermissions,
  ],
  identification: [
    ROLES.IDENTIFICATION,
    ...identificationPermissions,
  ],
  submission: [
    ROLES.SUBMISSION,
    ...claimsPreparationPermissions,
    ...claimsStatisticsPermissions,
    ...claimsViewOnlyPermissions,
    ...externalClaimsViewPermissions,
  ],
};
