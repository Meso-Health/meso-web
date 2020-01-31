import { map } from 'lodash/fp';
import { normalize } from 'normalizr';
import { isEmpty } from 'lib/formatters';

import householdSchema from 'store/schemas/household-schema';
import {
  FETCH_HOUSEHOLD_MEMBERS_REQUEST,
  FETCH_HOUSEHOLD_MEMBERS_SUCCESS,
  FETCH_HOUSEHOLD_MEMBERS_FAILURE,
  FETCH_MEMBERS_REQUEST,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
} from 'store/members/members-actions';
import { SET_SEARCH_QUERY, CLEAR_SEARCH_QUERY } from 'store/search-ui/search-ui-actions';

export function initialState() {
  return {
    memberSearch: {
      searchResultIds: [],
      query: '',
      isLoading: false,
    },
  };
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case SET_SEARCH_QUERY: {
      return {
        ...state,
        [action.payload.search]: {
          ...state[action.payload.search],
          query: action.payload.query,
        },
      };
    }
    case CLEAR_SEARCH_QUERY: {
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          query: '',
          searchResultIds: [],
        },
      };
    }
    case FETCH_MEMBERS_REQUEST: {
      return {
        ...state,
        memberSearch: {
          isLoading: true,
          ...state.memberSearch,
          searchResultIds: [],
        },
      };
    }
    case FETCH_MEMBERS_SUCCESS: {
      if (action.response && !isEmpty(action.response)) {
        const searchResultIds = map(m => m.id)(action.response);
        return {
          ...state,
          memberSearch: {
            ...state.memberSearch,
            isLoading: false,
            searchResultIds: [...searchResultIds],
          },
        };
      }
      return state;
    }

    case FETCH_HOUSEHOLD_MEMBERS_REQUEST: {
      return {
        ...state,
        memberSearch: {
          ...state.memberSearch,
          isLoading: true,
          searchResultIds: [],
        },
      };
    }
    case FETCH_MEMBERS_FAILURE:
    case FETCH_HOUSEHOLD_MEMBERS_FAILURE: {
      return {
        ...state,
        memberSearch: {
          ...state.memberSearch,
          isLoading: false,
        },
      };
    }
    case FETCH_HOUSEHOLD_MEMBERS_SUCCESS: {
      const normalizedResponse = normalize(action.response, [householdSchema]);

      if (normalizedResponse.entities && normalizedResponse.entities.members) {
        const searchResultIds = map(m => m.id)(normalizedResponse.entities.members);
        return {
          ...state,
          memberSearch: {
            ...state.memberSearch,
            isLoading: false,
            error: '',
            searchResultIds: [...searchResultIds],
          },
        };
      }
      return {
        ...state,
        memberSearch: {
          ...state.memberSearch,
          isLoading: false,
          error: '',
          searchResultIds: [],
        },
      };
    }
    default: {
      return state;
    }
  }
}
