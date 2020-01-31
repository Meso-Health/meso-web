import { merge } from 'lodash/fp';
import { normalize } from 'normalizr';

import identificationEventWithMemberAndEncounterSchema from 'store/schemas/identification-event-schema';
import householdSchema from 'store/schemas/household-schema';

import { FETCH_OPEN_ID_EVENTS_SUCCESS } from 'store/identification-events/identification-events-actions';
import {
  FETCH_HOUSEHOLD_MEMBERS_FAILURE,
  FETCH_HOUSEHOLD_MEMBERS_REQUEST,
  FETCH_HOUSEHOLD_MEMBERS_SUCCESS,
  UPDATE_MEMBER_FAILURE,
  UPDATE_MEMBER_REQUEST,
  UPDATE_MEMBER_SUCCESS,
  POST_MEMBER_REQUEST,
  POST_MEMBER_SUCCESS,
  POST_MEMBER_FAILURE,
  FETCH_MEMBERS_REQUEST,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  CREATE_MEMBER,
  STORE_MEMBERS,
} from 'store/members/members-actions';

export const omittableFields = [
  'isLoadingMembers',
  'membersError',
  'isPerformingMemberAction',
  'memberActionError',
];

export const initialState = {
  isLoadingMembers: false,
  membersError: '',
  members: {},
  isPerformingMemberAction: false,
  memberActionError: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_MEMBER: {
      const newMember = action.member;
      return {
        ...state,
        members: {
          ...state.members,
          [newMember.id]: newMember,
        },
      };
    }
    case FETCH_MEMBERS_REQUEST: {
      return {
        ...state,
        isLoadingMembers: true,
        membersError: '',
      };
    }
    case FETCH_MEMBERS_SUCCESS: {
      return {
        ...state,
        membersError: '',
      };
    }
    case STORE_MEMBERS: {
      return {
        ...state,
        isLoadingMembers: false,
        members: merge(state.members)(action.payload),
      };
    }
    case FETCH_MEMBERS_FAILURE: {
      return {
        ...state,
        isLoadingMembers: false,
        membersError: action.errorMessage,
      };
    }
    case FETCH_HOUSEHOLD_MEMBERS_REQUEST: {
      return {
        ...state,
        isLoadingMembers: true,
        membersError: '',
      };
    }
    case FETCH_HOUSEHOLD_MEMBERS_SUCCESS: {
      // TODO: normalize in transform response
      const normalizedResponse = normalize(action.response, [householdSchema]);

      if (normalizedResponse.entities && normalizedResponse.entities.members) {
        return {
          ...state,
          isLoadingMembers: false,
          membersError: '',
          members: merge(state.members)(normalizedResponse.entities.members),
        };
      }
      return {
        ...state,
        isLoadingMembers: false,
        membersError: '',
      };
    }
    case FETCH_HOUSEHOLD_MEMBERS_FAILURE: {
      return {
        ...state,
        isLoadingMembers: false,
        membersError: action.errorMessage,
      };
    }
    case POST_MEMBER_REQUEST:
      return {
        ...state,
        isPerformingMemberAction: true,
        memberActionError: '',
      };
    case POST_MEMBER_SUCCESS:
      return {
        ...state,
        isPerformingMemberAction: false,
        memberActionError: '',
        members: {
          ...state.members,
          [action.response.id]: action.response,
        },
      };
    case POST_MEMBER_FAILURE:
      return {
        ...state,
        isPerformingMemberAction: false,
        memberActionError: action.errorMessage,
      };
    case UPDATE_MEMBER_REQUEST: {
      return {
        ...state,
        isPerformingMemberAction: true,
        memberActionError: '',
      };
    }
    case UPDATE_MEMBER_SUCCESS: {
      return {
        ...state,
        isPerformingMemberAction: false,
        memberActionError: '',
        members: {
          ...state.members,
          [action.response.id]: action.response,
        },
      };
    }
    case UPDATE_MEMBER_FAILURE: {
      return {
        ...state,
        isPerformingMemberAction: false,
        memberActionError: action.errorMessage,
      };
    }
    case FETCH_OPEN_ID_EVENTS_SUCCESS: {
      const normalizedResponse = normalize(action.response, [identificationEventWithMemberAndEncounterSchema]);

      if (normalizedResponse.entities && normalizedResponse.entities.members) {
        return {
          ...state,
          members: merge(state.members)(normalizedResponse.entities.members),
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
