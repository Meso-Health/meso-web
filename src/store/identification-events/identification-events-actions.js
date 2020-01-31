import { getErrorMessage } from 'lib/utils';
import { createDelta } from 'store/deltas/deltas-actions';
import uuid from 'uuid/v4';
import { map } from 'lodash/fp';

import { postEncounter } from 'store/encounters/encounters-actions';
import { updateMember, postMember } from 'store/members/members-actions';
import { unsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';
import { identificationEventsByIdSelector } from 'store/identification-events/identification-events-selectors';

/**
 * Fetch open identification events with member and encounter
 */

export const FETCH_OPEN_ID_EVENTS_REQUEST = 'FETCH_OPEN_ID_EVENTS_REQUEST';
export const FETCH_OPEN_ID_EVENTS_SUCCESS = 'FETCH_OPEN_ID_EVENTS_SUCCESS';
export const FETCH_OPEN_ID_EVENTS_FAILURE = 'FETCH_OPEN_ID_EVENTS_FAILURE';
export const FETCH_OPEN_ID_EVENTS_CANCEL = 'FETCH_OPEN_ID_EVENTS_CANCEL';

export const fetchOpenIdEvents = providerId => ({
  CALL_API: {
    call: api => api.fetchOpenIdentificationEvents(providerId),
    transformError: err => getErrorMessage(err),
    transformResponse: (response, dispatch, getState) => {
      const state = getState();
      const unsyncedIdEventsDeltas = unsyncedDeltasByModelType(state, 'IdentificationEvent');
      const identificationEventsById = identificationEventsByIdSelector(state);
      const idEventsToMerge = map(idEventDelta => (
        identificationEventsById[idEventDelta.modelId]
      ))(unsyncedIdEventsDeltas);

      // Now we need to make sure we don't include the ID events where there is an unsynced encounter as well.
      const unsyncedEncounterDeltas = unsyncedDeltasByModelType(state, 'Encounter');
      const unsyncedEncounterIds = unsyncedEncounterDeltas.map(delta => delta.modelId);
      const filteredIdEvents = [...response, ...idEventsToMerge];
      const idEventsSafeToInsert = filteredIdEvents.filter((idEvent) => {
        if (idEvent.encounter && unsyncedEncounterIds.includes(idEvent.encounter.id)) {
          return false;
        }
        return true;
      });

      return idEventsSafeToInsert;
    },
    types: [
      FETCH_OPEN_ID_EVENTS_REQUEST,
      FETCH_OPEN_ID_EVENTS_SUCCESS,
      FETCH_OPEN_ID_EVENTS_FAILURE,
      FETCH_OPEN_ID_EVENTS_CANCEL,
    ],
  },
});

/**
 * POST new identification event
 */

export const POST_ID_EVENT_REQUEST = 'POST_ID_EVENT_REQUEST';
export const POST_ID_EVENT_SUCCESS = 'POST_ID_EVENT_SUCCESS';
export const POST_ID_EVENT_FAILURE = 'POST_ID_EVENT_FAILURE';

export const postIdentificationEvent = (identificationEvent, providerId) => ({
  CALL_API: {
    call: api => api.postIdentificationEvent(identificationEvent, providerId),
    transformError: err => getErrorMessage(err),
    types: [POST_ID_EVENT_REQUEST, POST_ID_EVENT_SUCCESS, POST_ID_EVENT_FAILURE],
  },
});

export const PATCH_ID_EVENT_REQUEST = 'PATCH_ID_EVENT_REQUEST';
export const PATCH_ID_EVENT_SUCCESS = 'PATCH_ID_EVENT_SUCCESS';
export const PATCH_ID_EVENT_FAILURE = 'PATCH_ID_EVENT_FAILURE';

export const patchIdentificationEvent = identificationEvent => ({
  CALL_API: {
    call: api => api.patchIdentificationEvent(identificationEvent),
    transformError: err => getErrorMessage(err),
    types: [PATCH_ID_EVENT_REQUEST, PATCH_ID_EVENT_SUCCESS, PATCH_ID_EVENT_FAILURE],
  },
});

export const CREATE_IDENTIFICATION_EVENT = 'CREATE_IDENTIFICATION_EVENT';

export const createIdentificationEvent = identificationEvent => ({
  type: CREATE_IDENTIFICATION_EVENT,
  identificationEvent,
});

export const createIdentificationEventWithDelta = idEvent => (
  (dispatch) => {
    dispatch(createIdentificationEvent(idEvent));
    const delta = {
      id: uuid(),
      modelId: idEvent.id,
      modelType: 'IdentificationEvent',
      action: 'POST',
      synced: false,
    };
    dispatch(createDelta(delta));
  }
);

/**
 * Checks in member
 *
 * Receives data in the form of: { identificationEvent, encounter, member }
 */

export const checkInMember = (data, providerId) => dispatch => (
  dispatch(updateMember(data.member)).then(() => (
    dispatch(postIdentificationEvent(data.identificationEvent, providerId)).then(() => (
      dispatch(postEncounter(data.encounter, providerId))
    ))
  ))
);

/**
 * Checks in member manually (creates new member)
 *
 * Receives data in the form of: { identificationEvent, encounter, member }
 */

export const manuallyCheckInMember = (data, providerId) => dispatch => (
  dispatch(postMember(data.member)).then(() => (
    dispatch(postIdentificationEvent(data.identificationEvent, providerId)).then(() => (
      dispatch(postEncounter(data.encounter, providerId))
    ))
  ))
);
