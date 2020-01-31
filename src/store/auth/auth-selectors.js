import { isNil } from 'lodash/fp';

export const userSelector = state => state.auth.user;

export const userAdjudicationLimitSelector = state => state.auth.user.adjudicationLimit;

export const userHasAdjudicationLimitSelector = state => state.auth.user.adjudicationLimit !== null;

export const isProviderUserSelector = state => !isNil(state.auth.user.providerId);
