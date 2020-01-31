import moment from 'moment';
import reducer, { initialState } from 'store/encounters/encounters-reducers';
import {
  FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST,
  FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS,
  FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE,
  UPDATE_ENCOUNTER,
} from 'store/encounters/encounters-actions';
import { FETCH_OPEN_ID_EVENTS_SUCCESS } from 'store/identification-events/identification-events-actions';
import {
  encounterErrorSelector,
  encounterByIdSelector,
  getLineItems,
  recentClaimsByEncounterIdSelector,
  formatBillable,
} from 'store/encounters/encounters-selectors';
import { formatShortId } from 'lib/formatters';
import { formatDate } from 'lib/formatters/date';

describe('encounters', () => {
  const testEncounter = {
    id: 'uuid', occurredAt: new Date(2016, 8, 9, 12, 5, 8), price: 1200, reimbursalAmount: 8000,
  };
  const testEncounters = { uuid: testEncounter };
  describe('encounterErrorSelector', () => {
    it('returns the error from encounters if there was an error', () => {
      const state = {
        encounters: {
          isLoadingEncounters: false,
          encountersError: 'Error message',
          encounters: {},
          isPatchingEncounter: false,
          patchError: '',
        },
      };
      expect(encounterErrorSelector(state)).toEqual('Error message');
    });
  });
  describe('encounterByIdSelctor', () => {
    const state = {
      encounters: {
        isLoadingEncounters: false,
        encountersError: '',
        encounters: testEncounters,
        isPatchingEncounter: false,
        patchError: '',
      },
    };
    it('returns the encounter if it exists in the redux store', () => {
      expect(encounterByIdSelector(state, 'uuid')).toEqual(testEncounter);
    });

    it('returns undefined if it does not exist in redux store', () => {
      expect(encounterByIdSelector(state, 'uuid-2')).toBeUndefined();
    });
  });
  describe('reducer', () => {
    it('returns the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('handles FETCH_OPEN_ID_EVENTS_SUCCESS', () => {
      const testMember = {
        id: 3,
        card_id: 'ETH000095',
        full_name: 'መሮን ስምረት ሰመረ',
        gender: 'F',
        age: 3,
      };
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

      const expected = expect.objectContaining({
        isLoadingEncounters: false,
        encountersError: '',
        encounters: testEncounters,
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST', () => {
      const action = { type: FETCH_ENCOUNTERS_WITH_MEMBERS_REQUEST };

      const expected = expect.objectContaining({
        isLoadingEncounters: true,
        encountersError: '',
        encounters: {},
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS', () => {
      const action = { type: FETCH_ENCOUNTERS_WITH_MEMBERS_SUCCESS, response: [testEncounter] };

      const expected = expect.objectContaining({
        isLoadingEncounters: false,
        encountersError: '',
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE', () => {
      const action = { type: FETCH_ENCOUNTERS_WITH_MEMBERS_FAILURE, errorMessage: 'Error message' };

      const expected = expect.objectContaining({
        isLoadingEncounters: false,
        encountersError: 'Error message',
        encounters: {},
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles UPDATE_ENCOUNTER', () => {
      const payload = { ...testEncounter, blue: 5 };
      const action = { type: UPDATE_ENCOUNTER, payload };

      const state = {
        encounters: testEncounters,
      };

      const expected = {
        encounters: {
          [payload.id]: payload,
        },
      };

      expect(reducer(state, action)).toEqual(expected);
    });
  });

  describe('getLineItems', () => {
    it('returns the correct line items for an empty encounter', () => {
      const encounterWithExtras = {
        encounterItems: [],
        billables: [],
      };
      expect(getLineItems(encounterWithExtras)).toEqual([
        { type: 'lab' },
        { type: 'imaging' },
        { type: 'service' },
        { type: 'procedure' },
        { type: 'drug and supply' },
        { type: 'bed day' },
      ]);
    });

    it('returns the correct line items for an encounter with billables', () => {
      const encounterWithExtras = {
        id: '0e08f1fc-c775-4a07-980f-1620e5577dc5',
        occurredAt: new Date(2016, 8, 9, 12, 5, 8),
        backdatedOccurredAt: false,
        providerId: 1,
        memberId: 'a68a0c2d-d74d-496e-8cfd-caa723c185c4',
        userId: 2,
        identificationEventId: 'f205b8f9-6b41-4ae4-a0cd-9c67160caec7',
        price: 2250,
        copaymentPaid: true,
        hasFever: null,
        formUrls: [],
        billables: [
          {
            id: '1a2b244e-2b10-4b9a-a7b8-8a83606b10ea',
            providerId: 1,
            type: 'service',
            name: 'Medical Form',
            composition: null,
            unit: null,
            price: 103,
            requiresLabResult: false,
            active: true,
            reviewed: true,
          },
          {
            id: 'bb2f9542-2879-431b-bedf-d19f87ba0f2e',
            providerId: 1,
            type: 'service',
            name: 'Consultation',
            composition: null,
            unit: null,
            price: 2044,
            requiresLabResult: false,
            active: true,
            reviewed: true,
          },
        ],
        priceSchedules: [
          {
            id: 'fe6ab283-90f9-442a-bfd9-04e1452d708e',
            providerId: 1,
            billableId: '1a2b244e-2b10-4b9a-a7b8-8a83606b10ea',
            issuedAt: new Date(2016, 8, 9, 12, 5, 8),
            price: 36,
            previousPriceScheduleId: null,
          },
          {
            id: '6633af53-c3cf-4b49-86f3-239540ce2d4a',
            providerId: 1,
            billableId: 'bb2f9542-2879-431b-bedf-d19f87ba0f2e',
            issuedAt: new Date(2016, 8, 9, 12, 5, 8),
            price: 1048,
            previousPriceScheduleId: null,
          },
        ],
        encounterItems: [
          {
            id: '48d365a8-4da4-4bbd-9986-a66eec246fca',
            encounterId: '0e08f1fc-c775-4a07-980f-1620e5577dc5',
            quantity: 2,
            billableId: '1a2b244e-2b10-4b9a-a7b8-8a83606b10ea',
            priceScheduleId: 'fe6ab283-90f9-442a-bfd9-04e1452d708e',
          },
          {
            id: '0d5c0814-2ff1-4c3e-a0c5-7716f92e486f',
            encounterId: '0e08f1fc-c775-4a07-980f-1620e5577dc5',
            quantity: 1,
            billableId: 'bb2f9542-2879-431b-bedf-d19f87ba0f2e',
            priceScheduleId: '6633af53-c3cf-4b49-86f3-239540ce2d4a',
          },
        ],
        diagnosisIds: [],
      };
      expect(getLineItems(encounterWithExtras)).toEqual([
        { type: 'lab' },
        { type: 'imaging' },
        { type: 'service',
          name: 'Medical Form',
          price: '36',
          quantity: 2,
          subtotal: '72',
          stockout: undefined },
        { type: undefined,
          name: 'Consultation',
          price: '1,048',
          quantity: 1,
          subtotal: '1,048',
          stockout: undefined },
        { type: 'procedure' },
        { type: 'drug and supply' },
        { type: 'bed day' },
      ]);
    });
  });
  describe('recentClaimsByEncounterIdSelector', () => {
    const encounter1 = {
      id: '02b04d08-fee8-4976-80c8-4b5e24ae7169',
      claimId: '02b04d08-fee8-4976-80c8-4b5e24ae7169',
      occurredAt: moment(),
      submittedAt: moment(),
      providerId: 1,
      memberId: '4',
      userId: 2,
      diagnosisIds: [1],
    };
    const encounter2 = {
      id: '0e08f1fc-c775-4a07-980f-1620e5577dc5',
      claimId: '0e08f1fc-c775-4a07-980f-1620e5577dc5',
      occurredAt: moment().subtract(350, 'days'),
      submittedAt: moment().subtract(349, 'days'),
      providerId: 1,
      memberId: '4',
      userId: 2,
      diagnosisIds: [1],
    };
    const encounter3 = {
      id: '7d2a11ba-d83f-4acd-b53b-c89685a72353',
      claimId: '7d2a11ba-d83f-4acd-b53b-c89685a72353',
      occurredAt: moment().subtract(5, 'days'),
      submittedAt: moment().subtract(4, 'days'),
      providerId: 1,
      memberId: '4',
      userId: 2,
      diagnosisIds: [1],
    };
    const encounter3Resubmission = {
      ...encounter3,
      id: 'fd0bd050-24f8-11e9-b56e-0800200c9a66',
      occurredAt: moment().subtract(4, 'days'),
      submittedAt: moment().subtract(3, 'days'),
    };
    const encounter4 = {
      id: '9551d7d2-f322-4675-80d7-ba1879593aeb',
      claimId: '9551d7d2-f322-4675-80d7-ba1879593aeb',
      occurredAt: moment().subtract(25, 'days'),
      submittedAt: moment().subtract(24, 'days'),
      providerId: 1,
      memberId: '4',
      userId: 2,
      diagnosisIds: [1],
    };
    const encounter4Resubmission = { // resubmitted with occurredAt changed to older date
      ...encounter4,
      id: 'bd35303c-48ad-4846-9143-6a2a16db50b1',
      occurredAt: moment().subtract(450, 'days'),
      submittedAt: moment().subtract(4, 'days'),
    };
    const encounter5 = {
      id: '2a149120-24f1-11e9-b56e-0800200c9a66',
      claimId: '2a149120-24f1-11e9-b56e-0800200c9a66',
      occurredAt: moment().subtract(368, 'days'),
      submittedAt: moment().subtract(367, 'days'),
      providerId: 1,
      memberId: '4',
      userId: 2,
      diagnosisIds: [1],
    };
    const encounter6 = { // claim for different member
      id: '1f5b5bb0-24f1-11e9-b56e-0800200c9a66',
      claimId: '1f5b5bb0-24f1-11e9-b56e-0800200c9a66',
      occurredAt: moment().subtract(12, 'days'),
      submittedAt: moment().subtract(12, 'days'),
      providerId: 1,
      memberId: '6',
      userId: 2,
      diagnosisIds: [1],
    };
    const encounters = {
      encounters: {
        [encounter1.id]: { ...encounter1 },
        [encounter2.id]: { ...encounter2 },
        [encounter3.id]: { ...encounter3 },
        [encounter3Resubmission.id]: { ...encounter3Resubmission },
        [encounter4.id]: { ...encounter4 },
        [encounter4Resubmission.id]: { ...encounter4Resubmission },
        [encounter5.id]: { ...encounter5 },
        [encounter6.id]: { ...encounter6 },
      },
    };
    const providers = {
      providers: {
        1: { id: 1, name: 'Wukro', administrativeDivisionId: 1, providerType: 'hospital' },
      },
    };
    const state = { encounters, providers };

    it('gets recent claims for the member of the given claim (relative to the given claim), ordered by most recent first', () => {
      // The global list of encounters for that member from oldest to newest:
      // encounter4-resubmitted (450 days ago)
      // encounter5 (368 days ago)
      // encounter2 (350 days ago)
      // encounter3-resubmitted (4 days ago)
      // encounter1 (today)

      expect(recentClaimsByEncounterIdSelector(state, encounter1.id)).toEqual([
        {
          ...encounter3Resubmission,
          shortClaimId: formatShortId(encounter3Resubmission.claimId),
          providerName: 'Wukro',
          timeAgo: formatDate(encounter3Resubmission.occurredAt),
        },
        {
          ...encounter2,
          shortClaimId: formatShortId(encounter2.claimId),
          providerName: 'Wukro',
          timeAgo: formatDate(encounter2.occurredAt),
        },
      ]);

      expect(recentClaimsByEncounterIdSelector(state, encounter3Resubmission.id)).toEqual([
        {
          ...encounter2,
          shortClaimId: formatShortId(encounter2.claimId),
          providerName: 'Wukro',
          timeAgo: formatDate(encounter2.occurredAt),
        },
        {
          ...encounter5,
          shortClaimId: formatShortId(encounter5.claimId),
          providerName: 'Wukro',
          timeAgo: formatDate(encounter5.occurredAt),
        },
      ]);

      expect(recentClaimsByEncounterIdSelector(state, encounter2.id)).toEqual([
        {
          ...encounter5,
          shortClaimId: formatShortId(encounter5.claimId),
          providerName: 'Wukro',
          timeAgo: formatDate(encounter5.occurredAt),
        },
        {
          ...encounter4Resubmission,
          shortClaimId: formatShortId(encounter4Resubmission.claimId),
          providerName: 'Wukro',
          timeAgo: formatDate(encounter4Resubmission.occurredAt),
        },
      ]);

      expect(recentClaimsByEncounterIdSelector(state, encounter5.id)).toEqual([
        {
          ...encounter4Resubmission,
          shortClaimId: formatShortId(encounter4Resubmission.claimId),
          providerName: 'Wukro',
          timeAgo: formatDate(encounter4Resubmission.occurredAt),
        },
      ]);

      expect(recentClaimsByEncounterIdSelector(state, encounter4Resubmission.id)).toEqual([]);
    });
  });

  describe('formatBillable', () => {
    it('returns a billable name if no unit or composition', () => {
      const billable = {
        name: 'Medical Form',
        composition: null,
        unit: null,
      };
      expect(formatBillable(billable)).toEqual('Medical Form');
    });

    it('returns a billable name with unit and composition', () => {
      const billable = {
        name: 'Panadol',
        composition: 'syrup',
        unit: '10mg',
      };
      expect(formatBillable(billable)).toEqual('Panadol (10mg syrup)');
    });
  });
});
