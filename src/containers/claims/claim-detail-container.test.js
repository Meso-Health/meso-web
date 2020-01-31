import { keyBy } from 'lodash/fp';

import ClaimDetailContainer from 'containers/claims/claim-detail-container';
import moment from 'moment';

describe('EncountersTableContainer', () => {
  const createMembers = (isLoading, members = []) => ({
    isLoadingMembers: isLoading,
    membersError: '',
    members: isLoading ? [] : members,
  });
  const createDiagnoses = (isLoading, diagnoses = {}) => ({
    isLoadingDiagnoses: isLoading,
    diagnosesError: '',
    diagnoses: isLoading ? [] : diagnoses,
  });
  const createClaims = (isLoading, claims = {}) => ({
    isLoadingClaims: isLoading,
    claimsError: '',
    claims: isLoading ? [] : claims,
  });
  const createEncounters = (isLoading, encounters = {}) => ({
    isLoadingEncounters: isLoading,
    encountersError: '',
    encounters: isLoading ? [] : encounters,
    referrals: {},
    isPatchingEncounter: false,
    patchError: '',
  });
  const createProviders = (isLoading, providers = {}) => ({
    isLoadingProviders: isLoading,
    providersError: '',
    providers: isLoading ? {} : providers,
  });
  const createUsers = (isLoading, users = {}) => ({
    isLoadingUsers: isLoading,
    usersError: '',
    users: isLoading ? {} : users,
  });
  const createMatchPropsWithEncounterId = encounterId => ({
    match: {
      params: {
        id: encounterId,
      },
    },
  });

  describe('mapStateToProps', () => {
    it('invalid encounter id in url', () => {
      const state = {
        diagnoses: createDiagnoses(false),
        claims: createClaims(false),
        encounters: createEncounters(false),
        providers: createProviders(false),
        users: createUsers(false),
        members: createMembers(false),
        auth: { user: { id: 1, adjudicationLimit: 10000 } },
      };
      const ownProps = createMatchPropsWithEncounterId('invalid-encounter-id');
      expect(ClaimDetailContainer.mapStateToProps(state, ownProps)).toEqual({
        currentUser: { id: 1, adjudicationLimit: 10000 },
        encounterId: 'invalid-encounter-id',
        hasFlag: false,
        isLoading: false,
        claim: null,
        userAdjudicationLimit: 10000,
        userHasAdjudicationLimit: true,
      });
    });

    it('valid encounter id in url', () => {
      const encounter1 = {
        id: '087e5d48-7a3a-420e-bc5f-9424cab50855',
        claimId: '087e5d48-7a3a-420e-bc5f-9424cab50855',
        memberId: '03565a82-f980-4bb0-9dfe-a767970d18e8',
        providerId: 1,
        referrals: [],
        submittedAt: moment().subtract(4, 'days'),
      };
      const encounter2 = {
        id: '27c3c591-8feb-41c0-a561-cbeb1985b167',
        claimId: '087e5d48-7a3a-420e-bc5f-9424cab50855',
        memberId: '03565a82-f980-4bb0-9dfe-a767970d18e8',
        providerId: 1,
        referrals: [],
        submittedAt: moment().subtract(2, 'days'),
      };
      const claim = {
        id: encounter1.id,
        encounters: [encounter1.id, encounter2.id],
      };
      const populatedClaim = {
        id: encounter1.id,
        lastEncounter: encounter2,
        encounters: { [encounter1.id]: encounter1, [encounter2.id]: encounter2 },
      };

      const provider = { id: 1, name: 'Saint Thérèse of Lisieux Health Centre 3' };
      const user1 = { id: 1, name: 'Branch Manager User', adjudicationLimit: null };
      const user2 = { id: 2, name: 'Provider User' };
      const member = { id: '03565a82-f980-4bb0-9dfe-a767970d18e8' };
      const diagnoses = {
        1: { id: 1, description: 'Diagnosis 1' },
        2: { id: 2, description: 'Diagnosis 2' },
      };

      const state = {
        auth: { user: user1 },
        diagnoses: {
          isLoadingDiagnoses: false,
          diagnoses,
        },
        encounters: {
          isLoadingEncounters: false,
          encountersError: '',
          encounters: keyBy('id', [encounter1, encounter2]),
        },
        providers: {
          isLoadingProviders: false,
          providersError: '',
          providers: keyBy('id', [provider]),
        },
        users: {
          isLoadingUsers: false,
          usersError: '',
          users: keyBy('id', [user1, user2]),
        },
        members: {
          isLoadingMembers: false,
          members: keyBy('id', [member]),
        },
        claims: {
          isLoadingClaims: false,
          claimsError: '',
          claims: keyBy('id', [claim]),
        },
      };
      expect(
        ClaimDetailContainer.mapStateToProps(
          state,
          createMatchPropsWithEncounterId('27c3c591-8feb-41c0-a561-cbeb1985b167'),
        ),
      ).toEqual({
        currentUser: user1,
        claim: populatedClaim,
        encounterId: encounter2.id,
        hasFlag: false,
        isLoading: false,
        userAdjudicationLimit: null,
        userHasAdjudicationLimit: false,
      });
    });
  });
});
