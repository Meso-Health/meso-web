import uuid from 'uuid/v4';
import { normalize } from 'normalizr';
import { getErrorMessage } from 'lib/utils';
import { createDelta } from 'store/deltas/deltas-actions';
import { unsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';
import { encounterWithMemberSchema } from 'store/schemas/encounter-schema';
import { STORE_DIAGNOSES } from 'store/diagnoses/diagnoses-actions';
import { STORE_MEMBERS } from 'store/members/members-actions';
import { STORE_BILLABLES } from 'store/billables/billables-actions';
import { STORE_PRICE_SCHEDULES } from 'store/price-schedules/price-schedules-actions';

export const CREATE_ENCOUNTER = 'CREATE_ENCOUNTER';
export const STORE_ENCOUNTERS = 'STORE_ENCOUNTERS';
export const FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST = 'FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST';
export const FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS = 'FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS';
export const FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE = 'FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE';
export const FETCH_ENCOUNTERS_WITH_MEMBERS_CANCEL = 'FETCH_ENCOUNTERS_WITH_MEMBERS_CANCEL';
export const UPDATE_ENCOUNTER = 'UPDATE_ENCOUNTER';

// We have a special check to exclude locally unsynced claims from being overwritten.
// TODO: Make what's in transformResponse more general, i.e. pass in a more general filter method instead.

const fetchEncountersWithMembersExcludeEncounterIds = (encounterIdsToIgnore = []) => ({
  CALL_API: {
    call: api => api.fetchEncounters(),
    transformError: err => getErrorMessage(err),
    transformResponse: (encounters, dispatch, getState) => {
      // We need to read the DB at this time to exclude encounters that are unsynced.
      // This prevents us from accidentally local data with what's returned from network.
      const state = getState();
      // Grab unsynced encounter deltas so we can exclude them.
      const unsyncedEncounterDeltas = unsyncedDeltasByModelType(state, 'Encounter');
      const unsyncedEncounterIds = unsyncedEncounterDeltas.map(e => e.modelId);
      const mergedUnsyncedEncounterIds = unsyncedEncounterIds + encounterIdsToIgnore;
      const encountersToReturn = encounters.filter(e => !mergedUnsyncedEncounterIds.includes(e.id));
      return encountersToReturn;
    },
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
      FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST,
      FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS,
      FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE,
      FETCH_ENCOUNTERS_WITH_MEMBERS_CANCEL,
    ],
  },
});

export const fetchEncountersWithMembers = () => (dispatch, getState) => {
  const state = getState();
  // Grab unsynced encounter deltas so we can exclude them.
  const unsyncedEncounterDeltas = unsyncedDeltasByModelType(state, 'Encounter');
  const unsyncedEncounterIds = unsyncedEncounterDeltas.map(e => e.modelId);
  dispatch(fetchEncountersWithMembersExcludeEncounterIds(unsyncedEncounterIds));
};


export const PATCH_ENCOUNTER_REQUEST = 'PATCH_ENCOUNTER_REQUEST';
export const PATCH_ENCOUNTER_SUCCESS = 'PATCH_ENCOUNTER_SUCCESS';
export const PATCH_ENCOUNTER_FAILURE = 'PATCH_ENCOUNTER_FAILURE';

export const patchEncounter = encounter => ({
  CALL_API: {
    call: api => api.patchEncounter(encounter),
    transformError: err => getErrorMessage(err),
    types: [
      PATCH_ENCOUNTER_REQUEST,
      PATCH_ENCOUNTER_SUCCESS,
      PATCH_ENCOUNTER_FAILURE,
    ],
  },
});

/**
 * Post encounter to backend
 */

export const POST_ENCOUNTER_REQUEST = 'POST_ENCOUNTER_REQUEST';
export const POST_ENCOUNTER_SUCCESS = 'POST_ENCOUNTER_SUCCESS';
export const POST_ENCOUNTER_FAILURE = 'POST_ENCOUNTER_FAILURE';

export const postEncounter = (encounter, providerId) => ({
  CALL_API: {
    call: api => api.postEncounter(encounter, providerId),
    transformError: err => getErrorMessage(err),
    types: [POST_ENCOUNTER_REQUEST, POST_ENCOUNTER_SUCCESS, POST_ENCOUNTER_FAILURE],
  },
});

/**
 * Update encounter in the redux store.
 */
export const updateEncounter = encounter => ({ type: UPDATE_ENCOUNTER, payload: encounter });

export const createEncounter = encounter => ({
  type: CREATE_ENCOUNTER,
  encounter,
});

export const createEncounterWithDelta = (encounter, newEncounter) => (
  (dispatch) => {
    if (newEncounter) {
      dispatch(createEncounter(encounter));
    } else {
      dispatch(updateEncounter(encounter));
    }
    const delta = {
      id: uuid(),
      modelId: encounter.id,
      modelType: 'Encounter',
      action: newEncounter ? 'POST' : 'PATCH',
      synced: false,
    };
    dispatch(createDelta(delta));
  }
);

export const reviseEncounterAndCreateWithDelta = encounter => (
  (dispatch) => {
    // Let's copy the encounter with new IDs.
    const newEncounterId = uuid(); // need to update the old encounter as well.
    const oldEncounter = { ...encounter };
    const newEncounter = { ...encounter };
    oldEncounter.adjudicationState = 'revised';

    newEncounter.id = newEncounterId;
    newEncounter.encounterItems = oldEncounter.encounterItems.map((encounterItem) => {
      const updatedEncounterItem = {
        ...encounterItem,
        id: uuid(),
        encounterId: newEncounterId,
      };
      return updatedEncounterItem;
    });

    newEncounter.referrals = oldEncounter.referrals.map((referral) => {
      const updatedReferral = {
        ...referral,
        encounterId: newEncounterId,
      };
      return updatedReferral;
    });
    newEncounter.revisedEncounterId = oldEncounter.id;
    newEncounter.submittedAt = null;
    dispatch(createEncounterWithDelta(newEncounter, true));
    dispatch(updateEncounter(oldEncounter));
  }
);
