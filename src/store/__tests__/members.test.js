import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MEMBERSHIP_STATUS_STATES } from 'lib/config';

import withApi from 'store/api-middleware/api';

import reducer, { initialState } from 'store/members/members-reducers';
import { membershipStatusByMemberIdSelector } from 'store/members/members-selectors';
import {
  updateMember,
  UPDATE_MEMBER_REQUEST,
  UPDATE_MEMBER_SUCCESS,
  UPDATE_MEMBER_FAILURE,
} from 'store/members/members-actions';
import { FETCH_OPEN_ID_EVENTS_SUCCESS } from 'store/identification-events/identification-events-actions';
import moment from 'moment';

const api = {};
const mockStore = configureMockStore([thunk, withApi(api)]);
const mockInitialState = (members, user) => ({ members: { members }, auth: { user } });
const mockInitialSelectorState = members => ({ members: { members }, enrollment: { enrollmentPeriods: 'non-null' } });
const mockInitialReducerState = members => ({ members });

describe('membership status', () => {
  const lastRenewedAt = moment().subtract(10, 'months');

  const ID_A = '01c8aa88-2c35-4ec7-8019-4d304121bade';
  const ID_B = '01c8aa88-2c35-4ec7-8019-4d304121badc';
  const ID_C = '01c8aa88-2c35-4ec7-8019-4d304121badf';

  // household + member within coverage period
  const memberA = {
    id: ID_A,
    householdId: 'household1',
    renewedAt: lastRenewedAt,
    memberCoverageEndDate: moment().add(1, 'months'),
    householdCoverageEndDate: moment().add(1, 'months'),
  };

  // household + member out of coverage period
  const memberB = {
    id: ID_B,
    householdId: 'household1',
    renewedAt: lastRenewedAt,
    memberCoverageEndDate: moment().subtract(11, 'months'),
    householdCoverageEndDate: moment().subtract(11, 'months'),
  };

  // household within coverage period, member not covered
  const memberC = {
    id: ID_C,
    householdId: 'household1',
    renewedAt: lastRenewedAt,
    memberCoverageEndDate: moment().subtract(12, 'months'),
    householdCoverageEndDate: moment().add(1, 'months'),
  };

  const membersInState = {
    [ID_A]: memberA,
    [ID_B]: memberB,
    [ID_C]: memberC,
  };

  let store;
  beforeEach(() => {
    store = mockStore(mockInitialSelectorState(membersInState));
  });

  describe('returns proper statuses', () => {
    it('Household + member active', () => {
      const membershipStatus = membershipStatusByMemberIdSelector(store.getState(), ID_A);
      expect(membershipStatus).toEqual({
        memberStatusEnum: MEMBERSHIP_STATUS_STATES.ACTIVE,
        memberStatusDate: lastRenewedAt,
        beneficiaryStatusEnum: MEMBERSHIP_STATUS_STATES.ACTIVE,
        beneficiaryStatusDate: lastRenewedAt,
      });
    });

    it('Household + member expired', () => {
      const membershipStatus = membershipStatusByMemberIdSelector(store.getState(), ID_B);
      expect(membershipStatus).toEqual({
        memberStatusEnum: MEMBERSHIP_STATUS_STATES.EXPIRED,
        memberStatusDate: lastRenewedAt,
        beneficiaryStatusEnum: MEMBERSHIP_STATUS_STATES.EXPIRED,
        beneficiaryStatusDate: null,
      });
    });

    it('Household active / member expired', () => {
      const membershipStatus = membershipStatusByMemberIdSelector(store.getState(), ID_C);
      expect(membershipStatus).toEqual({
        memberStatusEnum: MEMBERSHIP_STATUS_STATES.ACTIVE,
        memberStatusDate: lastRenewedAt,
        beneficiaryStatusEnum: MEMBERSHIP_STATUS_STATES.EXPIRED,
        beneficiaryStatusDate: null,
      });
    });
  });
});

describe('members', () => {
  const ID_A = '01c8aa88-2c35-4ec7-8019-4d304121bade';
  const ID_B = '01c8aa88-2c35-4ec7-8019-4d304121badc';

  const member1 = {
    id: ID_A,
    cardId: 'RWI123456',
    fullName: 'David Jones',
    age: 24,
  };

  const member2 = {
    id: ID_B,
    cardId: 'RWI123457',
    fullName: 'Ellen Jones',
    age: 12,
  };

  const membersInState = {
    [ID_A]: member1,
    [ID_B]: member2,
  };
  let store;

  beforeEach(() => {
    store = mockStore(mockInitialState(membersInState));
  });

  describe('updateMember', () => {
    const updatedMember = {
      id: ID_A,
      cardId: 'RWI123456',
      fullName: 'David David', // field changed from 'David Jones'
      age: 24,
    };

    describe('request is successful', () => {
      beforeEach(() => {
        api.updateMember = jest.fn(async () => (
          {
            id: ID_A,
            cardId: 'RWI123456',
            fullName: 'David David',
            age: 24,
          }
        ));
      });

      it('creates a UPDATE_MEMBER_SUCCESS action', async () => {
        await store.dispatch(updateMember(updatedMember));

        expect(store.getActions()).toEqual([
          { type: UPDATE_MEMBER_REQUEST },
          { type: UPDATE_MEMBER_SUCCESS, response: updatedMember },
        ]);
      });
    });

    describe('request is not authorized', () => {
      beforeEach(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        api.updateMember = jest.fn(() => Promise.reject({ response: { status: 401 } }));
      });

      it('creates a UPDATE_MEMBER_FAILURE action', async () => {
        await store.dispatch(updateMember(updatedMember));

        expect(store.getActions()).toEqual([
          { type: UPDATE_MEMBER_REQUEST },
          { type: UPDATE_MEMBER_FAILURE, errorMessage: 'There was an error while authenticating with the server. Log out and try again.' },
        ]);
      });
    });
  });

  describe('initialState', () => {
    it('returns an initial state object', () => {
      expect(initialState).toEqual({
        isLoadingMembers: false,
        membersError: '',
        members: {},
        isPerformingMemberAction: false,
        memberActionError: '',
      });
    });
  });

  describe('reducer', () => {
    it('returns the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('handles UPDATE_MEMBER_REQUEST', () => {
      const action = { type: UPDATE_MEMBER_REQUEST };

      const expected = expect.objectContaining({
        isPerformingMemberAction: true,
        memberActionError: '',
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles UPDATE_MEMBER_SUCCESS', () => {
      const updatedMember1 = {
        id: ID_A,
        cardId: 'RWI123456',
        fullName: 'David David',
        age: 24,
      };
      const expectedNewMembers = {
        [ID_A]: updatedMember1,
        [ID_B]: member2,
      };
      const action = { type: UPDATE_MEMBER_SUCCESS, response: updatedMember1 };

      const expected = expect.objectContaining({
        isPerformingMemberAction: false,
        memberActionError: '',
        members: expectedNewMembers,
      });

      expect(reducer(mockInitialReducerState(membersInState), action)).toEqual(expected);
    });

    it('handles UPDATE_MEMBER_FAILURE', () => {
      const action = { type: UPDATE_MEMBER_FAILURE, errorMessage: 'There was an error' };

      const expected = expect.objectContaining({
        isPerformingMemberAction: false,
        memberActionError: 'There was an error',
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_OPEN_ID_EVENTS_SUCCESS', () => {
      const testEncounter = {
        id: 'uuid',
        occurredAt: new Date(2016, 8, 9, 12, 5, 8),
        price: 1200,
        reimbursalAmount: 8000,
      };
      const testMember = {
        id: 3,
        card_id: 'ETH000095',
        full_name: 'መሮን ስምረት ሰመረ',
        gender: 'F',
        age: 3,
      };
      const testMembers = { 3: testMember };

      const response = [
        {
          id: 1,
          providerId: 1,
          accepted: true,
          encounter: testEncounter,
          member: testMember,
        },
      ];
      const action = { type: FETCH_OPEN_ID_EVENTS_SUCCESS, response };

      const expected = {
        isLoadingMembers: false,
        membersError: '',
        isPerformingMemberAction: false,
        memberActionError: '',
        members: testMembers,
      };

      expect(reducer(undefined, action)).toEqual(expected);
    });
  });
});
