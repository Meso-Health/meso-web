import moment from 'moment';
import { createSelector } from 'reselect';
import {
  filter,
  flatten,
  flow,
  groupBy,
  isNil,
  keyBy,
  reduce,
  last,
  map,
  orderBy,
  intersection,
} from 'lodash/fp';
import { formatShortId } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import { diagnosesKeyedByIdSelector, flaggableDiagnosesIdsSelector } from 'store/diagnoses/diagnoses-selectors';
import { providersKeyedByIdSelector } from 'store/providers/providers-selectors';
import { claimsUiVisibleClaimsSelector } from 'store/claims-ui/claims-ui-selectors';
import { membersKeyedByIdSelector } from 'store/members/members-selectors';
import { billablesByIdSelector } from 'store/billables/billables-selectors';
import { priceSchedulesKeyedByIdSelector } from 'store/price-schedules/price-schedules-selectors';
import { isObjectEmpty, objectHasProp } from 'lib/utils';
import { featureFlags, BILLABLE_TYPES } from 'lib/config';

export const encounterIsLoading = state => state.encounters.isLoadingEncounters;
export const encounterIsPatchingSelector = state => state.encounters.isPatchingEncounter;
export const encounterPatchErrorSelector = state => state.encounters.patchError;

export const encounterErrorSelector = state => state.encounters.encountersError;

export const encounterByIdSelector = (state, encounterId) => state.encounters.encounters[encounterId];

export const encountersKeyedByIdSelector = state => state.encounters.encounters;

// TODO: misleading name: filter converts the object into an array, so it is no longer keyed by id. use pickBy instead?
export const preparedEncountersKeyedByIdSelector = state => filter(encounter => encounter.submissionState !== 'started')(state.encounters.encounters);

// TODO: misleading name: filter converts the object into an array, so it is no longer keyed by id. use pickBy instead?
export const submittedEncountersKeyedByIdSelector = state => filter(encounter => encounter.submissionState === 'submitted')(state.encounters.encounters);

// TODO: misleading name: filter converts the object into an array, so it is no longer keyed by id. use pickBy instead?
export const preparedEncountersWithUiFiltersKeyedByIdSelector = createSelector(
  preparedEncountersKeyedByIdSelector,
  claimsUiVisibleClaimsSelector,
  (encounters, claimIds) => filter(e => claimIds && claimIds.includes(e.claimId))(encounters),
);

export const recentClaimsByEncounterIdSelector = createSelector(
  encounterByIdSelector,
  encountersKeyedByIdSelector,
  state => state.providers.providers,
  (currentEncounter, encounters, providers) => {
    if (currentEncounter) {
      return flow(
        // do not include draft encounters
        filter(e => e.submissionState !== 'started'),
        // do not include any encounters part of the claim chain for the current encounter
        filter(e => e.claimId !== currentEncounter.claimId),
        // only include encounters for this member
        filter(e => e.memberId === currentEncounter.memberId),
        // get the most recent encounter of a claim chain
        orderBy(e => new Date(e.submittedAt), ['asc']),
        groupBy('claimId'),
        map(claimChain => last(claimChain)),
        // get claims that occurred within the last year (~366 days) of the current encounter
        filter(e => e.occurredAt <= currentEncounter.occurredAt && moment(currentEncounter.occurredAt).diff(moment(e.occurredAt), 'days') <= 366),
        orderBy(e => new Date(e.occurredAt), ['desc']),
        map(e => ({
          ...e,
          shortClaimId: formatShortId(e.claimId),
          providerName: providers[e.providerId] && providers[e.providerId].name,
          timeAgo: formatDate(e.occurredAt),
        })),
      )(encounters);
    }
    return null;
  },
);

export const claimsSelector = (state) => {
  const { encounters } = state.encounters;
  return flow(
    orderBy(e => new Date(e.submittedAt), ['asc']),
    groupBy('claimId'),
    map(claimChain => last(claimChain)),
  )(encounters);
};

export const recentClaimsByMemberIdSelector = createSelector(
  (_, memberId) => memberId,
  claimsSelector,
  state => state.providers.providers,
  (memberId, claims, providers) => flow(
    filter(e => e.memberId === memberId),
    // do not include draft encounters
    filter(e => e.submissionState !== 'started'),
    // get claims that occurred within the last year (~366 days) of the current encounter
    filter(e => moment().diff(moment(e.occurredAt), 'days') <= 366),
    map(e => ({
      ...e,
      shortClaimId: formatShortId(e.claimId),
      providerName: providers[e.providerId] && providers[e.providerId].name,
      timeAgo: formatDate(e.occurredAt),
    })),
  )(claims),
);

export const encountersByProviderIdSelector = (state, providerId) => (
  filter(encounter => encounter.providerId === providerId)(state.encounters.encounters)
);

export const claimsByReimbursementIdSelector = createSelector(
  (_, reimbursementId) => reimbursementId,
  claimsSelector,
  (reimbursementId, claims) => {
    const claimsByReimbursement = groupBy('reimbursementId')(claims);
    return claimsByReimbursement[reimbursementId];
  },
);

export const reimbursableClaimsForProviderSelector = createSelector(
  (_, providerId) => providerId,
  claimsSelector,
  (providerId, claims) => flow(
    filter(c => c.providerId === parseInt(providerId, 10)),
    filter(c => c.adjudicationState !== 'rejected' && c.reimbursementId === null),
  )(claims),
);

// TODO: this should be able to use a reimbursement selector
// but there were circular depepndencies or import ordering
// causing it to be null, so selecting directly for now
export const additionalClaimsForReimbursementSelector = createSelector(
  (_, reimbursementId) => reimbursementId,
  state => state.reimbursements.reimbursements,
  claimsSelector,
  (reimbursementId, reimbursements, claims) => {
    if (isNil(reimbursementId)
      || isObjectEmpty(reimbursements)
      || !objectHasProp(reimbursements, reimbursementId)) {
      return [];
    }
    const reimbursement = reimbursements[reimbursementId];
    const { providerId } = reimbursement;
    return flow(
      filter(c => c.providerId === parseInt(providerId, 10)),
      filter(c => c.adjudicationState === 'approved'
        && (c.reimbursementId === null || c.reimbursementId === reimbursement.id)),
    )(claims);
  },
);

export const claimByEncounterIdSelector = createSelector(
  (_, encounterId) => encounterId,
  encountersKeyedByIdSelector,
  claimsSelector,
  (encounterId, encountersById, claims) => {
    const claimsById = keyBy('claimId', claims);
    if (objectHasProp(encountersById, encounterId)) {
      const { claimId } = encountersById[encounterId];
      return ((claims && objectHasProp(claimsById, claimId))
        ? claimsById[claimId]
        : null);
    }
    return null;
  },
);

export const inboundReferralDetailsSelector = createSelector(
  encounterByIdSelector,
  (currentEncounter) => {
    if (!currentEncounter) {
      return null;
    }
    const { inboundReferral: receivingReferral } = currentEncounter;
    if (receivingReferral) {
      const isFollowUp = receivingReferral.receivingFacility === 'SELF';
      return {
        ...receivingReferral,
        receivingFacility: isFollowUp ? receivingReferral.sendingFacility : receivingReferral.receivingFacility,
        isFollowUp,
      };
    }
    return null;
  },
);

export const outboundReferralDetailsSelector = createSelector(
  encounterByIdSelector,
  (currentEncounter) => {
    if (!currentEncounter) {
      return null;
    }
    const { referrals: sendingReferrals } = currentEncounter;
    if (sendingReferrals && sendingReferrals.length > 0) {
      return map((referral) => {
        const isFollowUp = referral.receivingFacility === 'SELF';
        return ({
          ...referral,
          receivingFacility: isFollowUp ? referral.sendingFacility : referral.receivingFacility,
          isFollowUp,
        });
      })(sendingReferrals)[0];
    }
    return null;
  },
);

// This takes in a encounterId and returns all encounters with the same claimId as that encounter.
export const claimEncountersSelector = createSelector(
  claimByEncounterIdSelector,
  state => state.encounters.encounters,
  (claim, encounters) => {
    if (!claim) {
      return [];
    }
    return orderBy('submittedAt', 'asc')(filter(encounter => encounter.claimId === claim.claimId)(encounters));
  },
);

// This takes in a encounterId and returns all prepared encounters with the same claimId as that encounter.
export const preparedClaimEncountersSelector = createSelector(
  claimEncountersSelector,
  encounters => (
    filter(e => e.submissionState !== 'started')(encounters)
  ),
);

export const memberByEncounterIdSelector = createSelector(
  claimByEncounterIdSelector,
  membersKeyedByIdSelector,
  (claim, members) => ((claim && members && objectHasProp(members, claim.memberId))
    ? members[claim.memberId]
    : null));

export const providerByClaimIdSelector = createSelector(
  claimByEncounterIdSelector,
  providersKeyedByIdSelector,
  (claim, providers) => ((claim && providers && objectHasProp(providers, claim.providerId))
    ? providers[claim.providerId]
    : null));

export const openClaimsForPreparerSelector = createSelector(
  claimsSelector,
  state => state.members.members,
  state => state.identificationEvents.identificationEvents,
  state => state.auth.user,
  (claims, members, identificationEvents, currentUser) => {
    const openClaims = flow(
      filter(c => c.submissionState === 'started' && currentUser.providerId === c.providerId),
      filter(c => identificationEvents[c.identificationEventId]
        && identificationEvents[c.identificationEventId].dismissed !== true),
    )(claims);
    return map(c => ({ ...c, member: members[c.memberId] }))(openClaims);
  },
);

export const returnedClaimsForPreparerSelector = createSelector(
  claimsSelector,
  state => state.members.members,
  state => state.auth.user,
  (claims, members, currentUser) => {
    const returned = filter(c => ((c.submissionState === 'needs_revision'
      || c.adjudicationState === 'returned')
      && currentUser.providerId === c.providerId))(claims);
    return map(c => ({ ...c, member: members[c.memberId] }))(returned);
  },
);

export const pendingClaimsForFacilityHeadSelector = createSelector(
  claimsSelector,
  state => state.members.members,
  state => state.auth.user,
  (claims, members, currentUser) => {
    const pending = filter(c => c.submissionState === 'prepared' && currentUser.providerId === c.providerId)(claims);
    return map(c => ({ ...c, member: members[c.memberId] }))(pending);
  },
);

// The following 2 selectors are a hack to show a future possibility of flagging claims
// as suspect based on system rules. At the moment we only want to show these if the
// EXPERIMENTAL flag is set and for the hard coded rule of Male with pregnancy in a diagnois
export const claimFlagSelector = createSelector(
  claimByEncounterIdSelector,
  memberByEncounterIdSelector,
  flaggableDiagnosesIdsSelector,
  (claim, member, flaggableDiagnosesIds) => {
    const { EXPERIMENTAL_FEATURES } = featureFlags;
    if (!EXPERIMENTAL_FEATURES) {
      return false;
    }
    return intersection(claim.diagnosisIds, flaggableDiagnosesIds).length > 0 && member.gender === 'M';
  },
);

export const claimFlagByIdSelector = createSelector(
  claimsSelector,
  state => state.members.members,
  flaggableDiagnosesIdsSelector,
  (claims, members, flaggableDiagnosesIds) => {
    const { EXPERIMENTAL_FEATURES } = featureFlags;
    if (!EXPERIMENTAL_FEATURES) {
      return {};
    }
    return reduce((acc, claim) => {
      const claimMember = members[claim.memberId];
      acc[claim.id] = intersection(claim.diagnosisIds, flaggableDiagnosesIds).length > 0 && claimMember.gender === 'M';
      return acc;
    }, {})(claims);
  },
);

/**
 * Helpers
 */

export const formatBillable = (billable) => {
  if (isNil(billable.unit)) {
    return billable.name;
  }
  return `${billable.name} (${billable.unit} ${billable.composition})`;
};

export const getEncounterAccountingStats = (encounter) => {
  const { billables, encounterItems, priceSchedules } = encounter;
  const billablesBy = keyBy('id', billables);
  const priceSchedulesBy = keyBy('id', priceSchedules);

  const accountingCategoryToTotalPrice = {};
  encounterItems.forEach((encounterItem) => {
    const priceSchedule = priceSchedulesBy[encounterItem.priceScheduleId];
    const billable = billablesBy[priceSchedule.billableId];
    const accountingCategory = billable.accountingGroup;
    const { price } = priceSchedule;
    const { quantity } = encounterItem;
    const totalPrice = encounterItem.stockout ? 0 : (price * quantity);

    if (!objectHasProp(accountingCategoryToTotalPrice, accountingCategory)) {
      accountingCategoryToTotalPrice[accountingCategory] = 0;
    }
    accountingCategoryToTotalPrice[accountingCategory] += totalPrice;
  });

  return accountingCategoryToTotalPrice;
};

// This method assumes encounterWithExtras already has billables and price schedules inflated within it.
export const getLineItems = (encounterWithExtras) => {
  const billableTypes = map(type => type.label)(BILLABLE_TYPES);

  const { billables, priceSchedules, encounterItems } = encounterWithExtras;
  const billablesById = keyBy('id', billables);
  const priceSchedulesById = keyBy('id', priceSchedules);

  // groups all the encounter items by type with some transformation of shape.
  const lineItemsByType = groupBy('type', encounterItems.map((encounterItem) => {
    const priceSchedule = priceSchedulesById[encounterItem.priceScheduleId];
    const billable = billablesById[priceSchedule.billableId];
    return {
      type: BILLABLE_TYPES[billable.type].label,
      name: formatBillable(billable),
      price: formatCurrency(priceSchedule.price),
      quantity: encounterItem.quantity,
      subtotal: formatCurrency(priceSchedule.price * encounterItem.quantity),
      stockout: encounterItem.stockout,
    };
  }));

  // sets the type to undefined if the item is NOT the first of it's type in the list.
  return flatten(billableTypes.map((type) => {
    const lineItemsWithType = lineItemsByType[type];
    if (isNil(lineItemsWithType)) {
      return [{ type }];
    }
    return lineItemsWithType.map((lineItem, index) => {
      if (index > 0) {
        return { ...lineItem, type: undefined };
      }
      return lineItem;
    });
  }));
};

export const diagnosesByEncounterIdSelector = createSelector(
  claimByEncounterIdSelector,
  diagnosesKeyedByIdSelector,
  (claim, diagnosesById) => {
    if (claim) {
      return claim.diagnosisIds.map(diagnosisId => diagnosesById[diagnosisId]);
    }
    return [];
  },
);

// Takes an encounterId and loads the entire encounter (with billables, diagnoses, encounterItems and price schedules).
export const encounterWithExtrasByIdSelector = createSelector(
  encounterByIdSelector,
  billablesByIdSelector,
  diagnosesKeyedByIdSelector,
  priceSchedulesKeyedByIdSelector,
  membersKeyedByIdSelector,
  (encounter, billablesById, diagnosesById, priceSchedulesById, membersById) => {
    const billables = [];
    const priceSchedules = [];
    const diagnoses = encounter.diagnosisIds.map(diagnosisId => diagnosesById[diagnosisId]);
    const member = membersById[encounter.memberId];
    Object.values(encounter.encounterItems).forEach((ei) => {
      const priceSchedule = priceSchedulesById[ei.priceScheduleId];
      const billable = billablesById[priceSchedule.billableId];
      billables.push(billable);
      priceSchedules.push(priceSchedule);
    });
    return {
      ...encounter,
      diagnoses,
      billables,
      priceSchedules,
      member,
    };
  },
);
