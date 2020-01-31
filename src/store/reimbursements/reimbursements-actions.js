import { getErrorMessage, formatServerError } from 'lib/utils';
import { normalize } from 'normalizr';
import { encounterWithMemberSchema } from 'store/schemas/encounter-schema';
import { STORE_DIAGNOSES } from 'store/diagnoses/diagnoses-actions';
import { STORE_MEMBERS } from 'store/members/members-actions';
import { STORE_BILLABLES } from 'store/billables/billables-actions';
import { STORE_PRICE_SCHEDULES } from 'store/price-schedules/price-schedules-actions';
import { STORE_ENCOUNTERS } from 'store/encounters/encounters-actions';

export const FETCH_REIMBURSEMENTS_REQUEST = 'FETCH_REIMBURSEMENTS_REQUEST';
export const FETCH_REIMBURSEMENTS_SUCCESS = 'FETCH_REIMBURSEMENTS_SUCCESS';
export const FETCH_REIMBURSEMENTS_FAILURE = 'FETCH_REIMBURSEMENTS_FAILURE';

export const fetchReimbursements = (providerId, opts = {}) => ({
  CALL_API: {
    beforeRequest(_, getState) {
      const storedReimbursements = getState().reimbursements.reimbursements;
      const isCached = Object.keys(storedReimbursements).length > 0;

      if (isCached && opts.force !== true) {
        return Promise.resolve(storedReimbursements);
      }

      return undefined;
    },
    call: api => api.fetchReimbursements(providerId),
    transformError: err => getErrorMessage(err),
    types: [FETCH_REIMBURSEMENTS_REQUEST, FETCH_REIMBURSEMENTS_SUCCESS, FETCH_REIMBURSEMENTS_FAILURE],
  },
});

export const CREATE_REIMBURSEMENT_REQUEST = 'CREATE_REIMBURSEMENT_REQUEST';
export const CREATE_REIMBURSEMENT_SUCCESS = 'CREATE_REIMBURSEMENT_SUCCESS';
export const CREATE_REIMBURSEMENT_FAILURE = 'CREATE_REIMBURSEMENT_FAILURE';

export const createReimbursement = (reimbursement, providerId) => ({
  CALL_API: {
    call: api => api.createReimbursement(reimbursement, providerId),
    transformError: err => getErrorMessage(err, formatServerError(err)),
    types: [CREATE_REIMBURSEMENT_REQUEST, CREATE_REIMBURSEMENT_SUCCESS, CREATE_REIMBURSEMENT_FAILURE],
  },
});

export const UPDATE_REIMBURSEMENT_REQUEST = 'UPDATE_REIMBURSEMENT_REQUEST';
export const UPDATE_REIMBURSEMENT_SUCCESS = 'UPDATE_REIMBURSEMENT_SUCCESS';
export const UPDATE_REIMBURSEMENT_FAILURE = 'UPDATE_REIMBURSEMENT_FAILURE';

export const updateReimbursement = reimbursement => ({
  CALL_API: {
    call: api => api.updateReimbursement(reimbursement),
    transformError: err => getErrorMessage(err, formatServerError(err)),
    types: [UPDATE_REIMBURSEMENT_REQUEST, UPDATE_REIMBURSEMENT_SUCCESS, UPDATE_REIMBURSEMENT_FAILURE],
  },
});

export const FETCH_REIMBURSEMENT_STATS_REQUEST = 'FETCH_REIMBURSEMENT_STATS_REQUEST';
export const FETCH_REIMBURSEMENT_STATS_SUCCESS = 'FETCH_REIMBURSEMENT_STATS_SUCCESS';
export const FETCH_REIMBURSEMENT_STATS_FAILURE = 'FETCH_REIMBURSEMENT_STATS_FAILURE';

export const fetchReimbursementStats = providerId => ({
  CALL_API: {
    call: api => api.fetchReimbursementStats(providerId),
    transformError: err => getErrorMessage(err, formatServerError(err)),
    types: [FETCH_REIMBURSEMENT_STATS_REQUEST, FETCH_REIMBURSEMENT_STATS_SUCCESS, FETCH_REIMBURSEMENT_STATS_FAILURE],
  },
});

export const FETCH_REIMBURSEABLE_CLAIMS_METADATA_REQUEST = 'FETCH_REIMBURSEABLE_CLAIMS_METADATA_REQUEST';
export const FETCH_REIMBURSEABLE_CLAIMS_METADATA_SUCCESS = 'FETCH_REIMBURSEABLE_CLAIMS_METADATA_SUCCESS';
export const FETCH_REIMBURSEABLE_CLAIMS_METADATA_FAILURE = 'FETCH_REIMBURSEABLE_CLAIMS_METADATA_FAILURE';

export const fetchReimbursableClaimsMetaData = (providerId, endDate, reimbursementId) => ({
  CALL_API: {
    call: api => api.fetchReimbursableClaimsMetaData(providerId, endDate, reimbursementId),
    transformError: err => getErrorMessage(err, formatServerError(err)),
    types: [
      FETCH_REIMBURSEABLE_CLAIMS_METADATA_REQUEST,
      FETCH_REIMBURSEABLE_CLAIMS_METADATA_SUCCESS,
      FETCH_REIMBURSEABLE_CLAIMS_METADATA_FAILURE,
    ],
  },
});

export const FETCH_REIMBURSEMENT_CLAIMS_REQUEST = 'FETCH_REIMBURSEMENT_CLAIMS_REQUEST';
export const FETCH_REIMBURSEMENT_CLAIMS_SUCCESS = 'FETCH_REIMBURSEMENT_CLAIMS_SUCCESS';
export const FETCH_REIMBURSEMENT_CLAIMS_FAILURE = 'FETCH_REIMBURSEMENT_CLAIMS_FAILURE';

export const fetchReimbursementClaims = reimbursementId => ({
  CALL_API: {
    call: api => api.fetchReimbursementClaims(reimbursementId),
    transformError: err => getErrorMessage(err, formatServerError(err)),
    afterResponse: (response, dispatch) => {
      const normalizedResponse = normalize(response, [encounterWithMemberSchema]);
      const { members, encounters, diagnoses, billables, priceSchedules } = normalizedResponse.entities;
      dispatch({ type: STORE_BILLABLES, payload: billables });
      dispatch({ type: STORE_PRICE_SCHEDULES, payload: priceSchedules });
      dispatch({ type: STORE_DIAGNOSES, payload: diagnoses });
      dispatch({ type: STORE_MEMBERS, payload: members });
      dispatch({ type: STORE_ENCOUNTERS, payload: encounters });
    },
    types: [
      FETCH_REIMBURSEMENT_CLAIMS_REQUEST,
      FETCH_REIMBURSEMENT_CLAIMS_SUCCESS,
      FETCH_REIMBURSEMENT_CLAIMS_FAILURE,
    ],
  },
});
