import reducer, { initialState } from 'store/identification-events/identification-events-reducers';
import {
  FETCH_OPEN_ID_EVENTS_REQUEST,
  FETCH_OPEN_ID_EVENTS_SUCCESS,
  FETCH_OPEN_ID_EVENTS_FAILURE,
} from 'store/identification-events/identification-events-actions';

describe('identification events', () => {
  const testEncounter = {
    id: 5,
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
  const testIdentificationEvent = {
    id: 1,
    providerId: 1,
    accepted: true,
    occurredAt: new Date(2016, 8, 9, 9, 5, 5),
    encounter: 5,
    member: 3,
  };
  const testIdentificationEvents = { 1: testIdentificationEvent };

  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState());
  });

  it('handles FETCH_OPEN_ID_EVENTS_REQUEST', () => {
    const action = { type: FETCH_OPEN_ID_EVENTS_REQUEST };
    const expected = expect.objectContaining({
      isLoadingIdentificationEvents: true,
      identificationEventsError: '',
      identificationEvents: {},
    });

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it('handles FETCH_OPEN_ID_EVENTS_SUCCESS', () => {
    const response = [
      {
        ...testIdentificationEvent,
        encounter: testEncounter,
        member: testMember,
      },
    ];
    const action = { type: FETCH_OPEN_ID_EVENTS_SUCCESS, response };
    const expected = expect.objectContaining({
      isLoadingIdentificationEvents: false,
      identificationEventsError: '',
      identificationEvents: testIdentificationEvents,
    });

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it('handles FETCH_OPEN_ID_EVENTS_FAILURE', () => {
    const action = { type: FETCH_OPEN_ID_EVENTS_FAILURE, errorMessage: 'Error message' };
    const expected = expect.objectContaining({
      isLoadingIdentificationEvents: false,
      identificationEventsError: 'Error message',
      identificationEvents: {},
    });

    expect(reducer(undefined, action)).toEqual(expected);
  });
});
