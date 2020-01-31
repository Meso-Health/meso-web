import { keyBy } from 'lodash/fp';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import withApi from 'store/api-middleware/api';

import reducer, { initialState } from 'store/providers/providers-reducers';
import {
  fetchProviders,
  FETCH_PROVIDERS_REQUEST,
  FETCH_PROVIDERS_SUCCESS,
  FETCH_PROVIDERS_FAILURE,
} from 'store/providers/providers-actions';

const api = {};
const mockStore = configureMockStore([thunk, withApi(api)]);
const mockInitialState = providers => ({ providers: { providers } });

describe('providers', () => {
  const provider1 = {
    id: 1,
    name: 'Saint Thérèse of Lisieux Health Centre 3',
  };

  const provider2 = {
    id: 2,
    name: 'Watsica-Becker Health Centre 5',
  };

  const providers = [provider1, provider2];

  beforeEach(() => {
    api.fetchProviders = jest.fn(async () => (
      [
        {
          id: 1,
          name: 'Saint Thérèse of Lisieux Health Centre 3',
        },
        {
          id: 2,
          name: 'Watsica-Becker Health Centre 5',
        },
      ]
    ));
  });

  describe('fetchProviders', () => {
    it('creates FETCH_PROVIDERS_SUCCESS', async () => {
      const store = mockStore(mockInitialState([]));
      await store.dispatch(fetchProviders());

      expect(store.getActions()).toEqual([
        { type: FETCH_PROVIDERS_REQUEST },
        { type: FETCH_PROVIDERS_SUCCESS, response: providers },
      ]);
    });

    it('creates FETCH_PROVIDERS_FAILURE', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      api.fetchProviders = jest.fn(() => Promise.reject({ response: { status: 401 } }));

      const store = mockStore(mockInitialState([]));
      await store.dispatch(fetchProviders());

      expect(store.getActions()).toEqual([
        { type: FETCH_PROVIDERS_REQUEST },
        { type: FETCH_PROVIDERS_FAILURE, errorMessage: 'There was an error while authenticating with the server. Log out and try again.' },
      ]);
    });
  });

  describe('reducer', () => {
    it('returns the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('handles FETCH_PROVIDERS_REQUEST', () => {
      const action = { type: FETCH_PROVIDERS_REQUEST };

      const expected = expect.objectContaining({
        isLoadingProviders: true,
        providersError: '',
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_PROVIDERS_SUCCESS', () => {
      const action = { type: FETCH_PROVIDERS_SUCCESS, response: providers };

      const expected = expect.objectContaining({
        isLoadingProviders: false,
        providersError: '',
        providers: keyBy('id', action.response),
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_PROVIDERS_FAILURE', () => {
      const action = { type: FETCH_PROVIDERS_FAILURE, errorMessage: 'There was an error' };

      const expected = expect.objectContaining({
        isLoadingProviders: false,
        providersError: action.errorMessage,
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });
  });
});
