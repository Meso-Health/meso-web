import { normalize } from 'normalizr';

import identificationEventWithMemberAndEncounterSchema from 'store/schemas/identification-event-schema';
import {
  FETCH_OPEN_ID_EVENTS_REQUEST,
  FETCH_OPEN_ID_EVENTS_SUCCESS,
  FETCH_OPEN_ID_EVENTS_FAILURE,
  POST_ID_EVENT_REQUEST,
  POST_ID_EVENT_SUCCESS,
  POST_ID_EVENT_FAILURE,
  PATCH_ID_EVENT_REQUEST,
  PATCH_ID_EVENT_SUCCESS,
  PATCH_ID_EVENT_FAILURE,
  CREATE_IDENTIFICATION_EVENT,
} from 'store/identification-events/identification-events-actions';

export function initialState() {
  return {
    isLoadingIdentificationEvents: false,
    isPostingIdentificationEvent: false,
    isPatchingIdentificationEvent: false,
    identificationEventsError: '',
    identificationEvents: {},
  };
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case CREATE_IDENTIFICATION_EVENT: {
      const newIdentificationEvent = action.identificationEvent;
      return {
        ...state,
        identificationEvents: {
          ...state.identificationEvents,
          [newIdentificationEvent.id]: newIdentificationEvent,
        },
      };
    }
    case FETCH_OPEN_ID_EVENTS_REQUEST: {
      return {
        ...state,
        isLoadingIdentificationEvents: true,
        identificationEventsError: '',
      };
    }
    case FETCH_OPEN_ID_EVENTS_SUCCESS: {
      const normalizedResponse = normalize(action.response, [identificationEventWithMemberAndEncounterSchema]);

      if (normalizedResponse.entities && normalizedResponse.entities.identificationEvents) {
        return {
          ...state,
          isLoadingIdentificationEvents: false,
          identificationEventsError: '',
          identificationEvents: { ...normalizedResponse.entities.identificationEvents },
        };
      }
      return {
        ...state,
        isLoadingIdentificationEvents: false,
        identificationEventsError: '',
        identificationEvents: {},
      };
    }
    case FETCH_OPEN_ID_EVENTS_FAILURE:
      return {
        ...state,
        isLoadingIdentificationEvents: false,
        identificationEventsError: action.errorMessage,
      };
    case POST_ID_EVENT_REQUEST:
      return {
        ...state,
        isPostingIdentificationEvent: true,
        identificationEventsError: '',
      };
    case POST_ID_EVENT_SUCCESS: {
      const newIdentificationEvent = action.response;
      return {
        ...state,
        isPostingIdentificationEvent: false,
        identificationEvents: {
          ...state.identificationEvents,
          [newIdentificationEvent.id]: newIdentificationEvent,
        },
      };
    }
    case POST_ID_EVENT_FAILURE:
      return {
        ...state,
        isPostingIdentificationEvent: false,
        identificationEventsError: '',
      };
    case PATCH_ID_EVENT_REQUEST:
      return {
        ...state,
        isPatchingIdentificationEvent: true,
        identificationEventsError: '',
      };
    case PATCH_ID_EVENT_SUCCESS:
      return {
        ...state,
        isPatchingIdentificationEvent: false,
        identificationEvents: {
          ...state.identificationEvents,
          [action.response.id]: action.response,
        },
      };
    case PATCH_ID_EVENT_FAILURE:
      return {
        ...state,
        isPatchingIdentificationEvent: false,
        identificationEventsError: action.errorMessage,
      };
    default: {
      return state;
    }
  }
}
