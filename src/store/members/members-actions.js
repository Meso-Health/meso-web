import { camelCaseObject, getErrorMessage } from 'lib/utils';
import { createDelta } from 'store/deltas/deltas-actions';
import uuid from 'uuid/v4';
import { normalize } from 'normalizr';
import memberSchema from 'store/schemas/member-schema';

/**
 * Fetch household members
 */

export const STORE_MEMBERS = 'STORE_MEMBERS';
export const FETCH_MEMBERS_REQUEST = 'FETCH_MEMBERS_REQUEST';
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAILURE = 'FETCH_MEMBERS_FAILURE';

export const fetchMembers = params => ({
  CALL_API: {
    call: api => api.fetchMembers(params),
    transformError: err => getErrorMessage(err),
    afterResponse: (response, dispatch) => {
      const normalizedResponse = normalize(response, [memberSchema]);
      dispatch({ type: STORE_MEMBERS, payload: normalizedResponse.entities.members });
    },
    types: [FETCH_MEMBERS_REQUEST, FETCH_MEMBERS_SUCCESS, FETCH_MEMBERS_FAILURE],
  },
});

export const FETCH_HOUSEHOLD_MEMBERS_REQUEST = 'FETCH_HOUSEHOLD_MEMBERS_REQUEST';
export const FETCH_HOUSEHOLD_MEMBERS_SUCCESS = 'FETCH_HOUSEHOLD_MEMBERS_SUCCESS';
export const FETCH_HOUSEHOLD_MEMBERS_FAILURE = 'FETCH_HOUSEHOLD_MEMBERS_FAILURE';

export const fetchHouseholdMembers = params => ({
  CALL_API: {
    call: api => api.fetchHouseholdMembers(params),
    transformError: err => getErrorMessage(err),
    types: [FETCH_HOUSEHOLD_MEMBERS_REQUEST, FETCH_HOUSEHOLD_MEMBERS_SUCCESS, FETCH_HOUSEHOLD_MEMBERS_FAILURE],
  },
});

/**
 * POST member
 */

export const POST_MEMBER_REQUEST = 'POST_MEMBER_REQUEST';
export const POST_MEMBER_SUCCESS = 'POST_MEMBER_SUCCESS';
export const POST_MEMBER_FAILURE = 'POST_MEMBER_FAILURE';

export const postMember = member => ({
  CALL_API: {
    call: api => api.postMember(member),
    transformError: err => getErrorMessage(err),
    types: [POST_MEMBER_REQUEST, POST_MEMBER_SUCCESS, POST_MEMBER_FAILURE],
  },
});

/**
 * Member action: Update Member
 */

export const UPDATE_MEMBER_REQUEST = 'UPDATE_MEMBER_REQUEST';
export const UPDATE_MEMBER_SUCCESS = 'UPDATE_MEMBER_SUCCESS';
export const UPDATE_MEMBER_FAILURE = 'UPDATE_MEMBER_FAILURE';

function formatServerError(err) {
  const serverError = err.response;

  if (serverError && serverError.data) {
    return { 422: { validationErrors: camelCaseObject(serverError.data.errors) } };
  }

  return {};
}

export const updateMember = member => ({
  CALL_API: {
    call: api => api.updateMember(member),
    transformError: err => getErrorMessage(err, formatServerError(err)),
    types: [UPDATE_MEMBER_REQUEST, UPDATE_MEMBER_SUCCESS, UPDATE_MEMBER_FAILURE],
  },
});

export const updateMemberPhoto = (memberId, photo) => ({
  CALL_API: {
    call: api => api.updateMemberPhoto(memberId, photo),
    transformError: err => getErrorMessage(err, formatServerError(err)),
    types: [UPDATE_MEMBER_REQUEST, UPDATE_MEMBER_SUCCESS, UPDATE_MEMBER_FAILURE],
  },
});

export const CREATE_MEMBER = 'CREATE_MEMBER';

export const createMember = member => ({
  type: CREATE_MEMBER,
  member,
});

export const createMemberWithDelta = member => (
  (dispatch) => {
    dispatch(createMember(member));
    const delta = {
      id: uuid(),
      modelId: member.id,
      modelType: 'Member',
      action: 'POST',
      synced: false,
    };
    dispatch(createDelta(delta));
  }
);
