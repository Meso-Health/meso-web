import { concat } from 'lodash/fp';
import {
  SET_CLAIM_FILTERS,
  CLEAR_CLAIM_FILTERS,
  SET_CLAIM_SEARCH,
  CLEAR_CLAIM_SEARCH,
  STORE_FETCHED_CLAIM_IDS,
  SET_SHOW_SEARCH,
  SET_SHOW_FILTERS,
  SET_CLAIM_SORT,
} from 'store/claims-ui/claims-ui-actions';

const initialSortState = {
  field: 'submittedAt',
  direction: 'desc',
};

export const initialFiltersState = {
  providerType: 'none',
  providerId: 'none',
  memberAdminDivisionId: 'none',
  startDate: undefined,
  endDate: undefined,
  flag: 'none',
  minAmount: 'none',
  maxAmount: 'none',
  audited: undefined,
  resubmitted: undefined,
  paid: 'none',
};

const initialSearchState = {
  searchField: null,
  searchQuery: null,
};

export const initialState = {
  showFilters: false,
  showSearch: false,
  sort: {
    ...initialSortState,
  },
  filters: {
    ...initialFiltersState,
  },
  search: {
    ...initialSearchState,
  },
  claimIds: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SHOW_SEARCH: {
      return {
        ...state,
        showFilters: false,
        showSearch: action.payload,
      };
    }
    case SET_SHOW_FILTERS: {
      return {
        ...state,
        showFilters: action.payload,
        showSearch: false,
      };
    }
    case SET_CLAIM_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case SET_CLAIM_SORT: {
      return {
        ...state,
        sort: {
          ...action.payload,
        },
      };
    }
    case CLEAR_CLAIM_FILTERS: {
      return {
        ...state,
        filters: {
          ...initialFiltersState,
        },
      };
    }
    case SET_CLAIM_SEARCH: {
      return {
        ...state,
        search: {
          ...state.search,
          ...action.payload,
        },
      };
    }
    case CLEAR_CLAIM_SEARCH: {
      return {
        ...state,
        search: {
          ...initialSearchState,
        },
      };
    }
    case STORE_FETCHED_CLAIM_IDS: {
      const claimIds = action.payload.clear ? action.payload.ids : concat(state.claimIds)(action.payload.ids);

      return {
        ...state,
        claimIds,
      };
    }
    default: {
      return state;
    }
  }
}
