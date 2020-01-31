import { keyBy, merge } from 'lodash/fp';
import {
  FETCH_REIMBURSEMENTS_FAILURE,
  FETCH_REIMBURSEMENTS_REQUEST,
  FETCH_REIMBURSEMENTS_SUCCESS,
  UPDATE_REIMBURSEMENT_REQUEST,
  UPDATE_REIMBURSEMENT_SUCCESS,
  UPDATE_REIMBURSEMENT_FAILURE,
  CREATE_REIMBURSEMENT_REQUEST,
  CREATE_REIMBURSEMENT_SUCCESS,
  CREATE_REIMBURSEMENT_FAILURE,
  FETCH_REIMBURSEMENT_STATS_REQUEST,
  FETCH_REIMBURSEMENT_STATS_SUCCESS,
  FETCH_REIMBURSEMENT_STATS_FAILURE,
  FETCH_REIMBURSEABLE_CLAIMS_METADATA_REQUEST,
  FETCH_REIMBURSEABLE_CLAIMS_METADATA_SUCCESS,
  FETCH_REIMBURSEABLE_CLAIMS_METADATA_FAILURE,
  FETCH_REIMBURSEMENT_CLAIMS_REQUEST,
  FETCH_REIMBURSEMENT_CLAIMS_SUCCESS,
  FETCH_REIMBURSEMENT_CLAIMS_FAILURE,
} from './reimbursements-actions';

export const initialState = {
  isLoadingReimbursements: false,
  isPerformingReimbursementAction: false,
  reimbursementsError: '',
  reimbursementActionError: '',
  reimbursements: {},
  stats: {},
  reimbursableClaims: {
    totalPrice: 0,
    encounterIds: [],
  },
  encounters: [],
  isLoadingReimbursementClaims: false,
  isLoadingStats: false,
  reimbursementStatsError: '',
  isLoadingReimbursableClaimsMetaData: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_REIMBURSEMENTS_REQUEST:
      return {
        ...state,
        isLoadingReimbursements: true,
        reimbursementsError: '',
      };
    case FETCH_REIMBURSEMENTS_SUCCESS:
      return {
        ...state,
        isLoadingReimbursements: false,
        reimbursementsError: '',
        reimbursements: keyBy('id', action.response),
      };
    case FETCH_REIMBURSEMENTS_FAILURE:
      return {
        ...state,
        isLoadingReimbursements: false,
        reimbursementsError: action.errorMessage,
      };
    case CREATE_REIMBURSEMENT_REQUEST:
      return {
        ...state,
        isPerformingReimbursementAction: true,
        reimbursementActionError: '',
      };
    case CREATE_REIMBURSEMENT_FAILURE:
      return {
        ...state,
        isPerformingReimbursementAction: false,
        reimbursementActionError: action.errorMessage,
      };
    case UPDATE_REIMBURSEMENT_REQUEST:
      return {
        ...state,
        isPerformingReimbursementAction: true,
        reimbursementActionError: '',
      };
    case UPDATE_REIMBURSEMENT_FAILURE:
      return {
        ...state,
        isPerformingReimbursementAction: false,
        reimbursementActionError: action.errorMessage,
      };
    case CREATE_REIMBURSEMENT_SUCCESS:
    case UPDATE_REIMBURSEMENT_SUCCESS:
      return {
        ...state,
        isPerformingReimbursementAction: false,
        reimbursementActionError: '',
        reimbursements: {
          ...state.reimbursements,
          [action.response.id]: action.response,
        },
      };
    case FETCH_REIMBURSEMENT_STATS_REQUEST:
      return {
        ...state,
        isLoadingStats: true,
        reimbursementStatsError: '',
      };
    case FETCH_REIMBURSEMENT_STATS_SUCCESS: {
      const statsByProviderId = keyBy('providerId', action.response);
      return {
        ...state,
        isLoadingStats: false,
        reimbursementStatsError: '',
        stats: merge(state.stats)(statsByProviderId),
      };
    }
    case FETCH_REIMBURSEMENT_STATS_FAILURE:
      return {
        ...state,
        isLoadingStats: false,
        reimbursementStatsError: action.errorMessage,
      };
    case FETCH_REIMBURSEABLE_CLAIMS_METADATA_REQUEST:
      return {
        ...state,
        isLoadingReimbursableClaimsMetaData: true,
      };
    case FETCH_REIMBURSEABLE_CLAIMS_METADATA_SUCCESS:
      return {
        ...state,
        reimbursableClaims: {
          ...action.response,
        },
        isLoadingReimbursableClaimsMetaData: false,
      };
    case FETCH_REIMBURSEABLE_CLAIMS_METADATA_FAILURE:
      return {
        ...state,
        isLoadingReimbursableClaimsMetaData: false,
      };
    case FETCH_REIMBURSEMENT_CLAIMS_REQUEST:
      return {
        ...state,
        isLoadingReimbursementClaims: true,
      };
    case FETCH_REIMBURSEMENT_CLAIMS_SUCCESS:
      return {
        ...state,
        encounters: action.response,
        isLoadingReimbursementClaims: false,
      };
    case FETCH_REIMBURSEMENT_CLAIMS_FAILURE:
      return {
        ...state,
        isLoadingReimbursementClaims: false,
      };
    default:
      return state;
  }
}
