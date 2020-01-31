import {
  pick,
} from 'lodash/fp';

import { formatDate } from 'lib/formatters/date';
import { formatCurrency } from 'lib/formatters/currency';
import {
  formatShortId,
} from 'lib/formatters';
import {
  getFileSystemSafeName,
  downloadTextFile,
  downloadObjectAsJson,
} from 'lib/utils';
import moment from 'moment';

import {
  currentUserProviderSelector,
} from 'store/providers/providers-selectors';

import {
  encounterWithExtrasByIdSelector,
} from 'store/encounters/encounters-selectors';

import { unsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';

const rowsForEncounterWithExtras = (encounterWithExtras) => {
  const {
    claimId,
    providerComment,
    reimbursalAmount,
    member,
    id: encounterId,
    preparedAt,
    occurredAt,
    inboundReferralDate,
  } = encounterWithExtras;

  const nonDateMemberFields = [
    'fullName',
    'membershipNumber',
    'cardId',
    'gender',
    'birthateAccuracy',
    'birthdate',
    'age',
    'medicalRecordNumber',
  ];

  const memberInfo = {
    ...pick(nonDateMemberFields)(member),
    birthdate: formatDate(member.birthdate),
  };

  const visitInformation = {
    ...pick(['visitReason', 'visitType', 'patientOutcome', 'dischargeDate'])(member),
    inboundReferralDate: formatDate(inboundReferralDate),
    serviceDate: formatDate(occurredAt),
    preparataionDate: formatDate(preparedAt),
    dischargeDate: formatDate(encounterWithExtras.dischargeDate),
    referrals: encounterWithExtras.referrals.map(r => ({ ...r, date: formatDate(r.date) })),
  };

  const diagnoses = encounterWithExtras.diagnoses.map(d => d.description);

  const encounterItems = encounterWithExtras.encounterItems.map((ei) => {
    const { stockout, billable, priceSchedule } = ei;
    if (stockout) {
      return {
        ...pick(['quantity', 'stockout'])(ei),
        billable: [billable.type, billable.name, billable.unit, billable.composition].join(' '),
        // No need to show price if stockout.
      };
    }
    return {
      ...pick(['quantity'])(ei),
      billable: [billable.type, billable.name, billable.unit, billable.composition].join(' '),
      price: formatCurrency(priceSchedule.price),
    };
  });

  return [
    `Claim ID: ${formatShortId(claimId)}`,
    `Submission ID ${encounterId}`,
    `Member: ${JSON.stringify(memberInfo, undefined, 2)}`,
    `Visit Information: ${JSON.stringify(visitInformation, undefined, 2)}`,
    `Diagnoses: ${JSON.stringify(diagnoses, undefined, 2)}`,
    `Encounter Items: ${JSON.stringify(encounterItems, undefined, 2)}`,
    `Comment: ${providerComment}`,
    `Total Claimed: ${formatCurrency(reimbursalAmount)}`,
  ];
};

export const exportData = () => (
  (dispatch, getState) => {
    const state = getState();
    const formattedNow = formatDate(moment());
    const provider = currentUserProviderSelector(state);

    // Get all the unsynced claims.
    // Loop through each one and append that claim's rows to the rows array.
    const rows = [];
    rows.push(`Here are all the unsynced claims as of ${formattedNow} for ${provider.name}`);
    rows.push('');
    rows.push('');

    const unsyncedEncounterDeltas = unsyncedDeltasByModelType(state, 'Encounter');

    // This list will be used for the json export.
    const unsyncedEncounterWithExtras = [];
    unsyncedEncounterDeltas.forEach((encounterDelta) => {
      const encounterWithExtras = encounterWithExtrasByIdSelector(state, encounterDelta.modelId);
      unsyncedEncounterWithExtras.push(encounterWithExtras);
      rowsForEncounterWithExtras(encounterWithExtras).forEach(row => rows.push(row));
      // Add two empty lines between claims.
      rows.push('');
      rows.push('');
    });

    downloadTextFile(rows, `readable_unsynced_claims_export_${getFileSystemSafeName(formattedNow)}.txt`);
    downloadObjectAsJson(unsyncedEncounterWithExtras, `json_unsynced_claims_export_${getFileSystemSafeName(formattedNow)}.json`);
  }
);

export default exportData;
