import { flow, filter, includes, map, merge, keyBy } from 'lodash/fp';
import { normalize } from 'normalizr';

import identificationEventWithMemberAndEncounterSchema from 'store/schemas/identification-event-schema';

import {
  STORE_ENCOUNTERS,
  FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE,
  FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST,
  FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS,
  POST_ENCOUNTER_REQUEST,
  POST_ENCOUNTER_SUCCESS,
  POST_ENCOUNTER_FAILURE,
  PATCH_ENCOUNTER_REQUEST,
  PATCH_ENCOUNTER_SUCCESS,
  PATCH_ENCOUNTER_FAILURE,
  CREATE_ENCOUNTER,
  UPDATE_ENCOUNTER,
} from 'store/encounters/encounters-actions';
import { CREATE_REIMBURSEMENT_SUCCESS, UPDATE_REIMBURSEMENT_SUCCESS } from 'store/reimbursements/reimbursements-actions';
import { FETCH_OPEN_ID_EVENTS_SUCCESS } from 'store/identification-events/identification-events-actions';

export const omittableFields = [
  'isLoadingEncounters',
  'encountersError',
  'isPatchingEncounter',
  'patchError',
];

export const initialState = {
  isLoadingEncounters: false,
  encountersError: '',
  isPostingEncounter: false,
  isPatchingEncounter: false,
  patchError: '',
  encounters: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_ENCOUNTER: {
      const newEncounter = action.encounter;
      return {
        ...state,
        encounters: {
          ...state.encounters,
          [newEncounter.id]: newEncounter,
        },
      };
    }
    case FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST:
      return {
        ...state,
        isLoadingEncounters: true,
        encountersError: '',
      };
    case FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS: {
      return {
        ...state,
        encountersError: '',
      };
    }
    case FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE:
      return {
        ...state,
        isLoadingEncounters: false,
        encountersError: action.errorMessage,
      };
    case STORE_ENCOUNTERS:
      return {
        ...state,
        encounters: merge(state.encounters)(action.payload),
        isLoadingEncounters: false,
      };
    case POST_ENCOUNTER_REQUEST:
      return {
        ...state,
        isPostingEncounter: true,
        encountersError: '',
      };
    case POST_ENCOUNTER_SUCCESS: {
      const newEncounter = action.response;

      return {
        ...state,
        isPostingEncounter: false,
        encounters: {
          ...state.encounters,
          [newEncounter.id]: newEncounter,
        },
      };
    }
    case POST_ENCOUNTER_FAILURE:
      return {
        ...state,
        isPostingEncounter: false,
        encountersError: action.errorMessage,
      };
    case PATCH_ENCOUNTER_REQUEST:
      return {
        ...state,
        isPatchingEncounter: true,
        patchError: '',
      };
    case PATCH_ENCOUNTER_SUCCESS:
      return {
        ...state,
        encounters: {
          ...state.encounters,
          [action.response.id]: {
            ...state.encounters[action.response.id],
            ...action.response,
          },
        },
        isPatchingEncounter: false,
        patchError: '',
      };
    case PATCH_ENCOUNTER_FAILURE:
      return {
        ...state,
        isPatchingEncounter: false,
        patchError: action.errorMessage,
      };
    case UPDATE_REIMBURSEMENT_SUCCESS: {
      const prevReimbursementEncounters = flow(
        filter(e => e.reimbursementId === action.response.id),
        map(e => ({ ...e, reimbursementId: null })),
        keyBy('id'),
      )(state.encounters);
      const updatedReimbursementEncounters = flow(
        filter(e => includes(e.id, action.response.encounterIds)),
        map(e => ({ ...e, reimbursementId: action.response.id })),
        keyBy('id'),
      )(state.encounters);
      return {
        ...state,
        encounters: {
          ...state.encounters,
          ...prevReimbursementEncounters,
          ...updatedReimbursementEncounters,
        },
      };
    }
    case FETCH_OPEN_ID_EVENTS_SUCCESS: {
      const normalizedResponse = normalize(action.response, [identificationEventWithMemberAndEncounterSchema]);

      if (normalizedResponse.entities && normalizedResponse.entities.encounters) {
        return {
          ...state,
          encounters: merge(state.encounters)(normalizedResponse.entities.encounters),
        };
      }
      return state;
    }
    case CREATE_REIMBURSEMENT_SUCCESS: {
      const reimbursementEncounters = flow(
        filter(e => includes(e.id, action.response.encounterIds)),
        map(e => ({ ...e, reimbursementId: action.response.id })),
        keyBy('id'),
      )(state.encounters);
      return {
        ...state,
        encounters: {
          ...state.encounters,
          ...reimbursementEncounters,
        },
      };
    }
    case UPDATE_ENCOUNTER: {
      const result = {
        ...state,
        encounters: {
          ...state.encounters,
          [action.payload.id]: {
            ...state.encounters[action.id], // should be action.payload.id??
            ...action.payload,
          },
        },
      };
      return result;
    }
    default:
      return state;
  }
}
