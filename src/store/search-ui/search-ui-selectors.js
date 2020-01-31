import { createSelector } from 'reselect';
import { find, reduce } from 'lodash/fp';
import { viewableMembersSelector } from 'store/members/members-selectors';

export const memberSearchQuerySelector = state => state.searchUi.memberSearch.query;
export const memberSearchResultIdsSelector = state => state.searchUi.memberSearch.searchResultIds;
export const memberSearchIsLoadingSelector = state => state.searchUi.memberSearch.isLoading;

export const memberSearchResultsSelector = createSelector(
  viewableMembersSelector,
  memberSearchResultIdsSelector,
  (membersById, searchResultIds) => {
    // mapping the search result IDs to maintain the order sent by backend
    // but also pruning for any null / undefined just in case
    const searchResults = reduce((acc, id) => {
      const member = find(['id', id])(membersById);
      if (member) {
        return [...acc, member];
      }
      return acc;
    }, [])(searchResultIds);
    return searchResults;
  },
);
