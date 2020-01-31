import { any, isNull, values } from 'lodash/fp';

export const claimsFiltersSelector = state => state.claimsUi.filters;

export const claimsSearchSelector = state => state.claimsUi.search;

export const claimsUiVisibleClaimsSelector = (state) => {
  if (state.claimsUi.showSearch && state.claimsUi.search.searchQuery === null) {
    return [];
  }
  return state.claimsUi.claimIds;
};

export const hasClaimFiltersSetSelector = state => any(value => !isNull(value))(values(state.claimsUi.filters));

export const showFiltersSelector = state => state.claimsUi.showFilters;

export const showSearchSelector = state => state.claimsUi.showSearch;

export const claimSortDirectionSelector = state => state.claimsUi.sort.direction;

export const claimSortFieldSelector = state => state.claimsUi.sort.field;
