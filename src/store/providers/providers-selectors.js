import { createSelector } from 'reselect';
import { reduce, pickBy } from 'lodash/fp';

import { userSelector } from 'store/auth/auth-selectors';
import {
  HOSPITAL_VISIT_TYPE_OPTIONS,
  HEALTH_CENTER_VISIT_TYPE_OPTIONS,
  REASONS_FOR_VISIT,
  PROVIDER_TYPES,
} from 'lib/config';

export const providerIsLoading = state => state.providers.isLoadingProviders;

export const providerNamesKeyedByIdSelector = state => reduce(
  (providerNamesKeyedById, val) => ({ ...providerNamesKeyedById, [val.id]: val.name }),
  {},
)(state.providers.providers);

export const providersKeyedByIdSelector = state => state.providers.providers;

export const currentUserProviderSelector = createSelector(
  providersKeyedByIdSelector,
  userSelector,
  (providersKeyedById, currentUser) => providersKeyedById[currentUser.providerId],
);

const EMPTY_VALUE = -1;

export const providerReasonsForVisitOptionsSelector = createSelector(
  userSelector,
  (user) => {
    const { providerType } = user;
    const filteredReasonsList = pickBy(reason => reason.types.includes(providerType))(REASONS_FOR_VISIT);

    return [
      { value: EMPTY_VALUE, name: 'Select a reason...', disabled: true },
      ...Object.keys(filteredReasonsList).map(reason => ({
        value: REASONS_FOR_VISIT[reason].value,
        name: REASONS_FOR_VISIT[reason].label,
      })),
    ];
  },
);

export const providerIsHealthCenterSelector = createSelector(
  userSelector,
  user => user.providerType === PROVIDER_TYPES.HEALTH_CENTER,
);

export const providerVisitTypeListSelector = createSelector(
  userSelector,
  (user) => {
    const { providerType } = user;
    if (providerType === PROVIDER_TYPES.HEALTH_CENTER) {
      return HEALTH_CENTER_VISIT_TYPE_OPTIONS;
    }
    return HOSPITAL_VISIT_TYPE_OPTIONS;
  },
);
