import { getErrorMessage } from 'lib/utils';
import { normalize } from 'normalizr';
import { keyBy } from 'lodash/fp';

import claimSchema from 'store/schemas/claim-schema';
import { STORE_ENCOUNTERS } from 'store/encounters/encounters-actions';
import { STORE_MEMBERS } from 'store/members/members-actions';
import { STORE_DIAGNOSES } from 'store/diagnoses/diagnoses-actions';
import { STORE_FETCHED_CLAIM_IDS } from 'store/claims-ui/claims-ui-actions';
import { STORE_BILLABLES } from 'store/billables/billables-actions';
import { STORE_PRICE_SCHEDULES } from 'store/price-schedules/price-schedules-actions';

import { unsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';

export const STORE_CLAIMS = 'STORE_CLAIMS';

export const FETCH_MEMBER_CLAIMS_REQUEST = 'FETCH_MEMBER_CLAIMS_REQUEST';
export const FETCH_MEMBER_CLAIMS_SUCCESS = 'FETCH_MEMBER_CLAIMS_SUCCESS';
export const FETCH_MEMBER_CLAIMS_FAILURE = 'FETCH_MEMBER_CLAIMS_FAILURE';
export const FETCH_MEMBER_CLAIMS_CANCEL = 'FETCH_MEMBER_CLAIMS_CANCEL';

const excludeUnsyncedEncounters = (state, responseEncountersKeyById) => {
  if (responseEncountersKeyById) {
    const unsyncedEncounterDeltas = unsyncedDeltasByModelType(state, 'Encounter');
    const unsyncedEncounterIds = unsyncedEncounterDeltas.map(e => e.modelId);
    const mergedUnsyncedEncounterIds = unsyncedEncounterIds;
    const encountersToStore = Object.values(responseEncountersKeyById)
      .filter(e => !mergedUnsyncedEncounterIds.includes(e.id));
    return keyBy('id', encountersToStore);
  }
  return undefined;
};

export const fetchMemberClaims = id => ({
  CALL_API: {
    call: api => api.fetchMemberClaims(id),
    transformError: err => getErrorMessage(err),
    afterResponse: (response, dispatch, getState) => {
      const normalizedResponse = normalize(response, [claimSchema]);
      const {
        claims,
        encounters: responseEncountersKeyById,
        members,
        diagnoses,
        billables,
        priceSchedules,
      } = normalizedResponse.entities;

      // The following code makes sure that fetched encounters do not overwrite unsynced encounters.
      const state = getState();
      const encountersToStoreKeyedById = excludeUnsyncedEncounters(state, responseEncountersKeyById);

      dispatch({ type: STORE_PRICE_SCHEDULES, payload: priceSchedules });
      dispatch({ type: STORE_BILLABLES, payload: billables });
      dispatch({ type: STORE_DIAGNOSES, payload: diagnoses });
      dispatch({ type: STORE_MEMBERS, payload: members });
      dispatch({ type: STORE_ENCOUNTERS, payload: encountersToStoreKeyedById });
      dispatch({ type: STORE_CLAIMS, payload: claims });
    },
    types: [
      FETCH_MEMBER_CLAIMS_REQUEST,
      FETCH_MEMBER_CLAIMS_SUCCESS,
      FETCH_MEMBER_CLAIMS_FAILURE,
      FETCH_MEMBER_CLAIMS_CANCEL,
    ],
  },
});

export const FETCH_CLAIM_REQUEST = 'FETCH_CLAIM_REQUEST';
export const FETCH_CLAIM_SUCCESS = 'FETCH_CLAIM_SUCCESS';
export const FETCH_CLAIM_FAILURE = 'FETCH_CLAIM_FAILURE';
export const FETCH_CLAIM_CANCEL = 'FETCH_CLAIM_CANCEL';

export const fetchClaim = id => ({
  CALL_API: {
    call: api => api.fetchClaim(id),
    transformError: err => getErrorMessage(err),
    afterResponse: (response, dispatch, getState) => {
      dispatch(fetchMemberClaims(response.encounters[0].memberId));

      const normalizedResponse = normalize(response, claimSchema);
      const {
        claims,
        encounters: responseEncountersKeyById,
        members,
        diagnoses,
        billables,
        priceSchedules,
      } = normalizedResponse.entities;

      // The following code makes sure that fetched encounters do not overwrite unsynced encounters.
      const state = getState();
      const encountersToStoreKeyedById = excludeUnsyncedEncounters(state, responseEncountersKeyById);

      dispatch({ type: STORE_BILLABLES, payload: billables });
      dispatch({ type: STORE_PRICE_SCHEDULES, payload: priceSchedules });
      dispatch({ type: STORE_DIAGNOSES, payload: diagnoses });
      dispatch({ type: STORE_MEMBERS, payload: members });
      dispatch({ type: STORE_ENCOUNTERS, payload: encountersToStoreKeyedById });
      dispatch({ type: STORE_CLAIMS, payload: claims });
    },
    types: [
      FETCH_CLAIM_REQUEST,
      FETCH_CLAIM_SUCCESS,
      FETCH_CLAIM_FAILURE,
      FETCH_CLAIM_CANCEL,
    ],
  },
});

export const FETCH_CLAIMS_PAGE_REQUEST = 'FETCH_CLAIMS_PAGE_REQUEST';
export const FETCH_CLAIMS_PAGE_SUCCESS = 'FETCH_CLAIMS_PAGE_SUCCESS';
export const FETCH_CLAIMS_PAGE_FAILURE = 'FETCH_CLAIMS_PAGE_FAILURE';
export const FETCH_CLAIMS_PAGE_CANCEL = 'FETCH_CLAIMS_PAGE_CANCEL';

export const fetchClaims = params => ({
  CALL_API: {
    call: api => api.fetchClaims(params),
    transformError: err => getErrorMessage(err),
    afterResponse: (response, dispatch, getState) => {
      const normalizedResponse = normalize(response.claims, [claimSchema]);
      const {
        claims,
        encounters: responseEncountersKeyById,
        members,
        diagnoses,
        billables,
        priceSchedules,
      } = normalizedResponse.entities;

      // The following code makes sure that fetched encounters do not overwrite unsynced encounters.
      const state = getState();
      const encountersToStoreKeyedById = excludeUnsyncedEncounters(state, responseEncountersKeyById);

      dispatch({ type: STORE_BILLABLES, payload: billables });
      dispatch({ type: STORE_PRICE_SCHEDULES, payload: priceSchedules });
      dispatch({ type: STORE_DIAGNOSES, payload: diagnoses });
      dispatch({ type: STORE_MEMBERS, payload: members });
      dispatch({ type: STORE_ENCOUNTERS, payload: encountersToStoreKeyedById });
      dispatch({ type: STORE_CLAIMS, payload: claims });
      dispatch({ type: STORE_FETCHED_CLAIM_IDS, payload: { ids: normalizedResponse.result, clear: true } });
    },
    types: [
      FETCH_CLAIMS_PAGE_REQUEST,
      FETCH_CLAIMS_PAGE_SUCCESS,
      FETCH_CLAIMS_PAGE_FAILURE,
      FETCH_CLAIMS_PAGE_CANCEL,
    ],
  },
});

export const fetchClaimsByUrl = url => ({
  CALL_API: {
    call: api => api.fetchClaimsByUrl(url),
    transformError: err => getErrorMessage(err),
    afterResponse: (response, dispatch, getState) => {
      const normalizedResponse = normalize(response.claims, [claimSchema]);
      const {
        claims,
        encounters: responseEncountersKeyById,
        members,
        diagnoses,
        billables,
        priceSchedules,
      } = normalizedResponse.entities;

      // The following code makes sure that fetched encounters do not overwrite unsynced encounters.
      const state = getState();
      const encountersToStoreKeyedById = excludeUnsyncedEncounters(state, responseEncountersKeyById);

      dispatch({ type: STORE_BILLABLES, payload: billables });
      dispatch({ type: STORE_PRICE_SCHEDULES, payload: priceSchedules });
      dispatch({ type: STORE_DIAGNOSES, payload: diagnoses });
      dispatch({ type: STORE_MEMBERS, payload: members });
      dispatch({ type: STORE_ENCOUNTERS, payload: encountersToStoreKeyedById });
      dispatch({ type: STORE_CLAIMS, payload: claims });
      dispatch({ type: STORE_FETCHED_CLAIM_IDS, payload: { ids: normalizedResponse.result, clear: false } });
    },
    types: [
      FETCH_CLAIMS_PAGE_REQUEST,
      FETCH_CLAIMS_PAGE_SUCCESS,
      FETCH_CLAIMS_PAGE_FAILURE,
      FETCH_CLAIMS_PAGE_CANCEL,
    ],
  },
});
