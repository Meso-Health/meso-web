import { merge } from 'lodash/fp';

import {
  FETCH_CLAIMS_PAGE_REQUEST,
  FETCH_CLAIMS_PAGE_SUCCESS,
  FETCH_CLAIMS_PAGE_FAILURE,
  FETCH_CLAIM_REQUEST,
  FETCH_CLAIM_SUCCESS,
  FETCH_CLAIM_FAILURE,
  FETCH_MEMBER_CLAIMS_REQUEST,
  FETCH_MEMBER_CLAIMS_SUCCESS,
  FETCH_MEMBER_CLAIMS_FAILURE,
  STORE_CLAIMS,
} from 'store/claims/claims-actions';

export const omittableFields = [
  'isLoadingClaims',
  'claimsError',
];

export const initialState = {
  isLoadingClaims: false,
  claimsError: '',
  claims: {},
  pagination: {
    total: null,
    prevUrl: null,
    nextUrl: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MEMBER_CLAIMS_REQUEST:
    case FETCH_CLAIMS_PAGE_REQUEST:
    case FETCH_CLAIM_REQUEST:
      return {
        ...state,
        isLoadingClaims: true,
        claimsError: '',
      };
    case FETCH_MEMBER_CLAIMS_SUCCESS:
    case FETCH_CLAIM_SUCCESS: {
      return {
        ...state,
        isLoadingClaims: false,
        claimsError: '',
      };
    }
    case FETCH_CLAIMS_PAGE_SUCCESS:
      return {
        ...state,
        isLoadingClaims: false,
        claimsError: '',
        pagination: {
          total: action.response.total,
          prevUrl: action.response.prevUrl,
          nextUrl: action.response.nextUrl,
        },
      };
    case STORE_CLAIMS: {
      return {
        ...state,
        claims: merge(state.claims)(action.payload),
      };
    }
    case FETCH_MEMBER_CLAIMS_FAILURE:
    case FETCH_CLAIMS_PAGE_FAILURE:
    case FETCH_CLAIM_FAILURE:
      return {
        ...state,
        isLoadingClaims: false,
        claimsError: action.errorMessage,
      };
    default:
      return state;
  }
}
