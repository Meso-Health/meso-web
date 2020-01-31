import { formatCurrencyWithLabel } from 'lib/formatters/currency';
import { CLAIM_AMOUNT_THRESHOLDS } from 'lib/config/index';

const claimAmountFilters = CLAIM_AMOUNT_THRESHOLDS.map(amount => ({
  value: amount,
  name: `Under ${formatCurrencyWithLabel(amount)}`,
}));

export const CLAIM_AMOUNT_FILTERS = [
  { value: 'none', name: 'Any amount' },
  ...claimAmountFilters,
];

export const CLAIM_STATUS_FILTERS = [
  { value: 'none', name: 'All pending' },
  { value: 'resubmissions', name: 'Resubmissions' },
  { value: 'no_resubmissions', name: 'All pending (no resubmissions)' },
  { value: 'audits', name: 'Audits (only)' },
  { value: 'no_audits', name: 'All pending (no audits)' },
];

export const FLAG_STATUS_FILTERS = [
  { value: 'none', name: 'None' },
  { value: 'all', name: 'All flagged' },
  { value: 'no_flags', name: 'Hide all flagged' },
  { value: 'unconfirmed_member', name: 'Unconfirmed members' },
  { value: 'inactive_member', name: 'Inactive members' },
  { value: 'unlinked_inbound_referral', name: 'Inbound referral' },
  { value: 'bypass_fee_override', name: 'Bypass fee' },
];

export const PAID_STATUS_FILTERS = [
  { value: 'none', name: 'All paid and unpaid' },
  { value: 'unpaid', name: 'Unpaid (only)' },
  { value: 'paid', name: 'Paid (only)' },
];

export const PROVIDER_TYPE_FILTERS = [
  { value: 'none', name: 'All provider levels' },
  { value: 'health_center', name: 'Health Center' },
  { value: 'primary_hospital', name: 'Primary Hospital' },
  { value: 'general_hospital', name: 'General Hospital' },
  { value: 'tertiary_hospital', name: 'Tertiary Hospital' },
];
