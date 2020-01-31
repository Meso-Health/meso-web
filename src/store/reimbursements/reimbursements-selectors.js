import { createSelector } from 'reselect';
import moment from 'moment';
import { filter, flow, reduce, keyBy, orderBy, values } from 'lodash/fp';
import { objectHasProp } from 'lib/utils';
import {
  claimsByReimbursementIdSelector,
  encountersKeyedByIdSelector,
} from 'store/encounters/encounters-selectors';

export const reimbursementIsLoading = state => state.reimbursements.isLoadingReimbursements;
export const reimbursementsArraySelector = state => values(state.reimbursements.reimbursements);

export const reimbursementsKeyedByIdSelector = state => state.reimbursements.reimbursements;
export const reimbursementEncountersSelector = state => state.reimbursements.encounters;

export const reimbursementByIdSelector = createSelector(
  (_, reimbursementId) => reimbursementId,
  reimbursementsKeyedByIdSelector,
  (reimbursementId, reimbursements) => ((reimbursements && objectHasProp(reimbursements, reimbursementId))
    ? reimbursements[reimbursementId]
    : null),
);

// this is only unpaid reimbursements
export const unpaidReimbursementByProviderSelector = (state) => {
  const { reimbursements } = state.reimbursements;
  const unpaidReimbursementByProvider = flow(
    filter(reimbursement => reimbursement.paymentDate === null),
    orderBy('paymentDate', 'asc'),
    keyBy('providerId'),
  )(reimbursements);
  return unpaidReimbursementByProvider;
};

export const providerHasUnpaidReimbursmentSelector = createSelector(
  (_, providerId) => providerId,
  unpaidReimbursementByProviderSelector,
  (providerId, unpaidReimbursementByProvider) => (
    unpaidReimbursementByProvider && objectHasProp(unpaidReimbursementByProvider, providerId)
  ),
);

export const reimbursementStatsKeyedByProviderIdSelector = state => state.reimbursements.stats;

export const reimbursementStatsForProviderSelector = createSelector(
  (_, providerId) => providerId,
  reimbursementStatsKeyedByProviderIdSelector,
  (providerId, reimbursementStatsByProviderId) => reimbursementStatsByProviderId[providerId],
);

export const createdReimbursementsStatsSelector = createSelector(
  reimbursementsKeyedByIdSelector,
  (reimbursements) => {
    const totals = reduce((total, reimbursement) => {
      const claims = total.claims + reimbursement.claimCount;
      const amount = total.amount + parseInt(reimbursement.total, 10);
      return { claims, amount };
    }, { claims: 0, amount: 0 })(values(reimbursements));
    return { ...totals };
  },
);

export const reimbursementsDetailStatsSelector = createSelector(
  claimsByReimbursementIdSelector,
  (claimsByReimbursementId) => {
    const claims = claimsByReimbursementId ? claimsByReimbursementId.length : 0;
    const amount = reduce((total, claim) => {
      const newTotal = total + claim.reimbursalAmount;
      return newTotal;
    }, 0)(claimsByReimbursementId);

    return { claims, amount };
  },
);

export const encountersForReimbursementSelector = createSelector(
  (_, reimbursementId) => reimbursementId,
  encountersKeyedByIdSelector,
  (reimbursementId, encountersKeyedById) => (reimbursementId
    ? filter(encounter => encounter.reimbursementId === reimbursementId)(values(encountersKeyedById))
    : []
  ),
);

export const newReimbursementStartDateSelector = state => (
  state.reimbursements.reimbursableClaims.startDate || moment.now()
);
export const reimbursableEncounterIdsSelector = state => state.reimbursements.reimbursableClaims.encounterIds;
export const reimbursableEncountersTotalPriceSelector = state => state.reimbursements.reimbursableClaims.totalPrice;
