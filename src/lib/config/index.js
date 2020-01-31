import { ROLES, ALLOWED_USER_ROLES } from './roles-permissions';
import { ROUTES } from './routes';

export * from './roles-permissions';
export * from './routes';

export const CONTACT_EMAIL = 'contact@meso.health';
export const TIMESTAMP_FORMAT = 'YYYY-MM-DD h:mm A';
export const TIME_FORMAT = 'h:mm A';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_PICKER_FORMAT = 'yyyy-mm-dd'; // Date picker requires lowercase
export const DATE_PICKER_ETH_FORMAT = 'dd-mm-yyyy'; // Date picker requires lowercase
export const YEAR_MONTH_FORMAT = 'YYYY-MM';
export const YEAR_FORMAT = 'YYYY';
export const MONTH_FORMAT = 'MM';
export const DAY_FORMAT = 'DD';

export const AGE_UNITS = {
  YEARS: 'Y',
  MONTHS: 'M',
  DAYS: 'D',
};

export const ACCOUNTING_CATEGORIES = {
  card_and_consultation: 'Card & Consultation',
  lab: 'Lab',
  imaging: 'Imaging',
  // TODO: should we change the string value here to Surgery?
  surgery: 'Procedure',
  drug_and_supply: 'Drug & Supply',
  bed_day_and_food: 'Bed Day',
  capitation: 'Capitation',
  other_services: 'Other',
};

// member search methods for identification events
export const SEARCH_METHODS = {
  membershipNumber: 'search_membership_number',
  cardId: 'search_card_id',
  medicalRecordNumber: 'search_medical_record_number',
  advanced: 'search_name',
  throughHousehold: 'through_household',
  unknown: 'unknown',
  manual: 'manual',
};

export const CALENDAR_FORMATS = {
  GREGORIAN: 'gregorian',
  ETHIOPIAN: 'ethiopian',
};

export const CURRENCY_FORMATS = {
  UNSPECIFIED: 'unspecified',
  UGANDAN: 'ugandan',
};

export const CURRENCIES = {
  UGANDAN: 'UGX',
};

export const ADJUDICATION_STATES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  RETURNED: 'returned',
  REJECTED: 'rejected',
  EXTERNAL: 'external',
};

export const BILLABLE_TYPES = {
  lab: {
    key: 'lab',
    label: 'lab',
  },
  imaging: {
    key: 'imaging',
    label: 'imaging',
  },
  service: {
    key: 'service',
    label: 'service',
  },
  procedure: {
    key: 'procedure',
    label: 'procedure',
  },
  drug: {
    key: 'drug',
    label: 'drug and supply',
  },
  bed_day: {
    key: 'bed_day',
    label: 'bed day',
  },
};

export const SUBMISSION_STATES = {
  STARTED: 'started',
  PREPARED: 'prepared',
  SUBMITTED: 'submitted',
  NEEDS_REVISION: 'needs_revision',
};

export const PROFESSIONS = {
  FARMER: 'Farmer',
  STUDENT: 'Student',
  DRIVER: 'Driver',
  UNEMPLOYED: 'Unemployed',
  ENGINEER: 'Engineer',
  DISABLED: 'Disabled',
  OTHER: 'other',
};

export const RELATIONSHIPS = {
  SELF: 'Self',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  PARENT: 'Parent',
  GRANDCHILD: 'Grandchild',
  GRANDPARENT: 'Grandparent',
  HOUSE_STAFF: 'House Staff',
  OTHER: 'Other',
};

export const HEALTH_CENTER_VISIT_TYPE_OPTIONS = [
  { name: 'Outpatient (OPD)', value: 'Outpatient (OPD)', isDischarge: false },
  { name: '<5 Outpatient (OPD)', value: '<5 Outpatient (OPD)', isDischarge: false },
  { name: 'Emergency OPD', value: 'Emergency OPD', isDischarge: false },
  { name: 'Inpatient (IPD)', value: 'Inpatient (IPD)', isDischarge: false },
  { name: 'ART', value: 'ART', isDischarge: false },
  { name: 'TB', value: 'TB', isDischarge: false },
  { name: 'Family Planning (FP)', value: 'Family Planning (FP)', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 1st Visit', value: 'Antenatal Care (ANC)  - 1st Visit', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 2nd Visit', value: 'Antenatal Care (ANC)  - 2nd Visit', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 3rd Visit', value: 'Antenatal Care (ANC)  - 3rd Visit', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 4th Visit', value: 'Antenatal Care (ANC)  - 4th Visit', isDischarge: false },
  { name: 'Delivery (DR)', value: 'Delivery (DR)', isDischarge: false },
];

export const HOSPITAL_VISIT_TYPE_OPTIONS = [
  { name: 'Outpatient (OPD)', value: 'Outpatient (OPD)', isDischarge: false },
  { name: 'ART', value: 'ART', isDischarge: false },
  { name: 'TB', value: 'TB', isDischarge: false },
  { name: 'Family Planning (FP)', value: 'Family Planning (FP)', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 1st Visit', value: 'Antenatal Care (ANC)  - 1st Visit', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 2nd Visit', value: 'Antenatal Care (ANC)  - 2nd Visit', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 3rd Visit', value: 'Antenatal Care (ANC)  - 3rd Visit', isDischarge: false },
  { name: 'Antenatal Care (ANC)  - 4th Visit', value: 'Antenatal Care (ANC)  - 4th Visit', isDischarge: false },
  { name: 'Postnatal Care (PNC) - 1st Visit', value: 'Postnatal Care (PNC) - 1st Visit', isDischarge: false },
  { name: 'Postnatal Care (PNC) - 2nd Visit', value: 'Postnatal Care (PNC) - 2nd Visit', isDischarge: false },
  { name: '<5 Outpatient (OPD)', value: '<5 Outpatient (OPD)', isDischarge: false },
  { name: 'Inpatient (IPD)', value: 'Inpatient (IPD)', isDischarge: true },
  { name: 'Emergency OPD', value: 'Emergency OPD', isDischarge: false },
  { name: 'Delivery (DR)', value: 'Delivery (DR)', isDischarge: true },
  { name: 'Dental', value: 'Dental', isDischarge: false },
  { name: 'Mental ( psychiatric ) Heath care', value: 'Mental ( psychiatric ) Heath car', isDischarge: true },
  { name: 'Surgical referral clinic', value: 'Surgical referral clinic', isDischarge: true },
  { name: 'Medical  referral clinic', value: 'Medical  referral clinic', isDischarge: true },
  { name: 'Pediatrics  referral clinic', value: 'Pediatrics  referral clinic', isDischarge: true },
  { name: 'Gynecology and Obstetrics referral clinic', value: 'Gynecology and Obstetrics referral clinic', isDischarge: true },
  { name: 'Delivery', value: 'Delivery', isDischarge: true },
  { name: 'Neonatal Intensive Care Unit (NICU)', value: 'Neonatal Intensive Care Unit (NICU)', isDischarge: true },
  { name: 'Intensive Care Unit (ICU)', value: 'Intensive Care Unit (ICU)', isDischarge: true },
];

export const PATIENT_OUTCOMES = {
  discharged: 'Discharged',
  referred: 'Referred',
  follow_up: 'Follow-up',
  deceased: 'Deceased',
  other: 'Other',
};

export const PROVIDER_TYPES = {
  HEALTH_CENTER: 'health_center',
  PRIMARY_HOSPITAL: 'primary_hospital',
  GENERAL_HOSPITAL: 'general_hospital',
  TERTIARY_HOSPITAL: 'tertiary_hospital',
  UNCLASSIFIED: 'unclassified',
};

export const ADJUDICATION_REJECT_REASONS = [
  { value: 'inactive_beneficiary', name: 'Inactive Beneficiary' },
  { value: 'service_not_covered', name: 'Service not covered' },
  { value: 'referral_bypass', name: 'Referral bypass' },
  { value: 'duplicate_claim', name: 'Duplicate claim' },
  { value: 'expired_claim', name: 'Expired claim' },
  { value: 'previously_returned', name: 'Previously returned' },
  { value: 'other', name: 'Other (requires comment)' },
];

export const ADJUDICATION_RETURN_REASONS = [
  { value: 'unknown_beneficiary', name: 'Unknown beneficiary' },
  { value: 'price_discrepancy', name: 'Price Descrepancy' },
  { value: 'missing_diagnosis', name: 'Missing Dx' },
  { value: 'not_as_per_standard_treatment_guidelines', name: 'Not as per standard treatment guidelines' },
  { value: 'provider_not_contracted', name: 'Provider not contracted' },
  { value: 'other', name: 'Other (requires comment)' },
];

// Right now reasons for visit only apply to hospitals, there are primary hospitals
// indicated by 'primary', and secondary and tertiary hospitals, indicated by 'other'.
// Set it up this way so that in the future if we need to differeniate between other types we can
export const REASONS_FOR_VISIT = {
  referral: {
    value: 'referral',
    label: 'Referral',
    types: [
      PROVIDER_TYPES.PRIMARY_HOSPITAL,
      PROVIDER_TYPES.GENERAL_HOSPITAL,
      PROVIDER_TYPES.TERTIARY_HOSPITAL,
    ],
  },
  self_referral: {
    value: 'no_referra',
    label: 'No-referral',
    types: [
      PROVIDER_TYPES.PRIMARY_HOSPITAL,
      PROVIDER_TYPES.GENERAL_HOSPITAL,
      PROVIDER_TYPES.TERTIARY_HOSPITAL,
    ],
  },
  follow_up: {
    value: 'follow_up',
    label: 'Follow-up',
    types: [
      PROVIDER_TYPES.PRIMARY_HOSPITAL,
      PROVIDER_TYPES.GENERAL_HOSPITAL,
      PROVIDER_TYPES.TERTIARY_HOSPITAL,
    ],
  },
  emergency: {
    value: 'emergency',
    label: 'Emergency',
    types: [
      PROVIDER_TYPES.PRIMARY_HOSPITAL,
      PROVIDER_TYPES.GENERAL_HOSPITAL,
      PROVIDER_TYPES.TERTIARY_HOSPITAL,
    ],
  },
};

export const MEMBERSHIP_STATUS_STATES = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  DELETED: 'Deleted',
  UNKNOWN: 'Unknown',
};

export const apiConfig = {
  ALLOWED_USER_ROLES,
  BASE_URL: process.env.REACT_APP_COVERAGE_API_BASE,
};

export const FOLLOW_UP_RECEIVING_FACILITY = 'SELF';
export const FOLLOW_UP_REASON = 'follow_up';
export const REFERRAL_FACILITY_OTHER = 'Other';

export const REFERRAL_REASONS = {
  further_consultation: 'Further Consultation',
  drug_stockout: 'Drug Stockout',
  investigative_tests: 'Investigative Tests',
  inpatient_care: 'Inpatient care',
  follow_up: 'Follow-up',
  other: 'Other',
};

export const CLAIM_AMOUNT_THRESHOLDS = [20000, 10000, 7000, 4000];

export const REFERRAL_FACILITIES = [
  'Fort Portal Hospital',
  'Kyenjojo Health Center',
  'Rwibaale Health Center',
  REFERRAL_FACILITY_OTHER,
];

export const title = 'Admin';
export const titleTemplate = '%s — Admin';
export const DEFAULT_PATHS_FOR_ROLE = {
  [ROLES.PAYER_ADMIN]: ROUTES.CLAIMS.base_url,
  [ROLES.ADJUDICATION]: ROUTES.CLAIMS.base_url,
  [ROLES.ENROLLMENT]: ROUTES.ENROLLMENT_REPORTING.base_url,
  [ROLES.PROVIDER_ADMIN]: ROUTES.CLAIMS.base_url,
  [ROLES.IDENTIFICATION]: ROUTES.CHECK_IN.base_url,
  [ROLES.SUBMISSION]: ROUTES.SUBMISSIONS.base_url,
};

export const featureFlags = {
  ENABLE_CLAIMS: process.env.REACT_APP_ENABLE_CLAIMS === 'true',
  ENABLE_FACILITY_REPORTING: process.env.REACT_APP_ENABLE_FACILITY_REPORTING === 'true',
  ENABLE_MEMBER_EDITING: process.env.REACT_APP_ENABLE_MEMBER_EDITING === 'true',
  ENABLE_ENROLLMENT_REPORTING: process.env.REACT_APP_ENABLE_ENROLLMENT_REPORTING === 'true',
  ENABLE_REIMBURSEMENTS: process.env.REACT_APP_ENABLE_REIMBURSEMENTS === 'true',
  ENABLE_SUBMISSION: process.env.REACT_APP_ENABLE_SUBMISSION === 'true',
  ENABLE_CHECK_IN: process.env.REACT_APP_ENABLE_CHECK_IN === 'true',
  ENABLE_STATUS: process.env.REACT_APP_ENABLE_STATUS === 'true',
  LOCALE_CODE: process.env.REACT_APP_LOCALE_CODE,
  BRANDED_LOGO_URL: process.env.REACT_APP_BRANDED_LOGO_URL,
  EXPERIMENTAL_FEATURES: process.env.REACT_APP_EXPERIMENTAL_FEATURES === 'true',
  MEMBER_FULL_NAME_MIN_LENGTH: parseInt(process.env.REACT_APP_MEMBER_FULL_NAME_MIN_LENGTH, 10),
};

const localeConstsMap = {
  INT: {
    CAL: CALENDAR_FORMATS.GREGORIAN,
    CURRENCY: CURRENCY_FORMATS.UNSPECIFIED,
    FIRST_LEVEL: 'region',
    SECOND_LEVEL: 'province',
    THIRD_LEVEL: 'district',
    FOURTH_LEVEL: 'municipality',
  },
  UGX: {
    CAL: CALENDAR_FORMATS.GREGORIAN,
    CURRENCY: CURRENCY_FORMATS.UGANDAN,
    FIRST_LEVEL: 'region',
    SECOND_LEVEL: 'district',
    THIRD_LEVEL: 'village',
    FOURTH_LEVEL: 'subvillage',
  },
};

export const ADMIN_DIVISIONS = {
  COUNTRY: 'country',
  FIRST_LEVEL: localeConstsMap[featureFlags.LOCALE_CODE].FIRST_LEVEL,
  SECOND_LEVEL: localeConstsMap[featureFlags.LOCALE_CODE].SECOND_LEVEL,
  THIRD_LEVEL: localeConstsMap[featureFlags.LOCALE_CODE].THIRD_LEVEL,
  FOURTH_LEVEL: localeConstsMap[featureFlags.LOCALE_CODE].FOURTH_LEVEL,
};

export const localeConsts = {
  GLOBAL_DATE_FORMAT: localeConstsMap[featureFlags.LOCALE_CODE].CAL,
  CURRENCY_FORMAT: localeConstsMap[featureFlags.LOCALE_CODE].CURRENCY,
};

export const validations = {
  MEMBER_FULL_NAME_MIN_LENGTH: featureFlags.MEMBER_FULL_NAME_MIN_LENGTH,
};
