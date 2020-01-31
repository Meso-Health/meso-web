import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moment from 'moment';
import withApi from 'store/api-middleware/api';
import reducer, { initialState } from 'store/auth/auth-reducers';
import {
  login,
  logout,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
} from 'store/auth/auth-actions';

import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from 'lib/session';

import storage from 'lib/storage';

const api = {};
const mockStore = configureMockStore([thunk, withApi(api)]);

describe('auth', () => {
  const expiredTokenWithExpiredAt = {
    token: 'abc123',
    expiresAt: moment().add({ days: 2 }).format(),
  };
  const activeTokenWithExpiredAt = {
    token: 'def456',
    expiresAt: moment().subtract({ days: 2 }).format(),
  };
  const user = {
    name: 'Ellen Smith',
    role: 'branch_manager',
  };

  afterEach(() => {
    storage.clear();
  });

  describe('login', () => {
    beforeEach(() => {
      api.login = jest.fn((username, password) => {
        if (password === 'password') {
          const result = { ...activeTokenWithExpiredAt, user };
          return Promise.resolve(result);
        }

        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ response: { status: 401 } });
      });
    });

    describe('with valid credentials', () => {
      it('creates LOG_IN_SUCCESS', async () => {
        const store = mockStore();
        await store.dispatch(login('username', 'password'));
        expect(store.getActions()).toEqual(expect.arrayContaining([
          { type: LOG_IN_REQUEST },
          { type: LOG_IN_SUCCESS, response: user },
        ]));
      });

      it('stores the session in localStorage', async () => {
        const store = mockStore();
        await store.dispatch(login('username', 'password'));
        expect(storage.get(AUTH_TOKEN_STORAGE_KEY)).toEqual(activeTokenWithExpiredAt);
        expect(storage.get(AUTH_USER_STORAGE_KEY)).toEqual(user);
      });
    });

    describe('with invalid credentials', () => {
      it('creates LOG_IN_FAILURE', async () => {
        const store = mockStore();
        await store.dispatch(login('username', 'invalid'));
        expect(store.getActions()).toEqual([
          { type: LOG_IN_REQUEST },
          { type: LOG_IN_FAILURE, errorMessage: 'Invalid username or password.' },
        ]);
      });
    });
  });

  describe('logout', () => {
    describe('when a token is set', () => {
      beforeEach(() => {
        storage.set(AUTH_TOKEN_STORAGE_KEY, activeTokenWithExpiredAt);
        storage.set(AUTH_USER_STORAGE_KEY, user);
      });

      it('creates LOG_OUT_REQUEST', async () => {
        api.logout = jest.fn(async () => '');

        const store = mockStore();
        await store.dispatch(logout());
        expect(store.getActions()).toEqual([
          { type: LOG_OUT_REQUEST },
          { type: LOG_OUT_SUCCESS, response: '' },
        ]);
      });

      it('removes the session from localStorage', async () => {
        const store = mockStore();
        await store.dispatch(logout());
        expect(storage.get(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
        expect(storage.get(AUTH_USER_STORAGE_KEY)).toBeNull();
      });

      it('creates LOG_OUT_FAILURE when the request failed', async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        api.logout = jest.fn(() => Promise.reject(''));

        const store = mockStore();
        await store.dispatch(logout());
        expect(store.getActions()).toEqual([
          { type: LOG_OUT_REQUEST },
          { type: LOG_OUT_FAILURE, errorMessage: '' },
        ]);
      });
    });

    describe('when no token is set', () => {
      it('behaves the same as a successful logout', async () => {
        const store = mockStore();
        await store.dispatch(logout());
        expect(store.getActions()).toEqual([
          { type: LOG_OUT_REQUEST },
          { type: LOG_OUT_SUCCESS },
        ]);
      });
    });
  });

  describe('initialState', () => {
    it('returns an initial state object', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    describe('when a session already exists with active token', () => {
      beforeEach(() => {
        storage.set(AUTH_TOKEN_STORAGE_KEY, activeTokenWithExpiredAt);
        storage.set(AUTH_USER_STORAGE_KEY, user);
      });

      it('returns an initial state with the session information', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
      });
    });

    describe('when a session already exists with an expired token', () => {
      beforeEach(() => {
        storage.set(AUTH_TOKEN_STORAGE_KEY, expiredTokenWithExpiredAt);
        storage.set(AUTH_USER_STORAGE_KEY, user);
      });

      it('returns an initial state with the session information', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
      });
    });
  });

  describe('reducer', () => {
    it('returns the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('handles LOG_IN_REQUEST', () => {
      const actionA = { type: LOG_IN_REQUEST };

      const expected = {
        isAuthenticated: false,
        isAuthenticating: true,
        errorMessage: '',
        user: null,
      };

      expect(reducer(undefined, actionA)).toEqual(expected);
    });

    it('handles LOG_OUT_REQUEST', () => {
      const action = { type: LOG_OUT_REQUEST };

      const initial = {
        isAuthenticated: true,
        isAuthenticating: false,
        errorMessage: '',
        user,
      };

      // NOTE: we clear `user` in LOG_OUT_REQUEST (rather than SUCCESS) since we
      // want the client to "log out" even if we can't reach the server.
      const expected = {
        isAuthenticated: false,
        isAuthenticating: false,
        errorMessage: '',
        user: null,
      };

      expect(reducer(initial, action)).toEqual(expected);
    });

    it('handles LOG_IN_SUCCESS', () => {
      const actionA = { type: LOG_IN_SUCCESS, response: user };

      const expected = {
        isAuthenticated: true,
        isAuthenticating: false,
        errorMessage: '',
        user,
      };

      expect(reducer(undefined, actionA)).toEqual(expected);
    });

    it('handles LOG_IN_FAILURE', () => {
      const actionA = { type: LOG_IN_FAILURE, errorMessage: 'foo' };

      const initial = {
        isAuthenticated: true,
        isAuthenticating: false,
        errorMessage: '',
        user,
      };

      const expected = {
        isAuthenticated: false,
        isAuthenticating: false,
        errorMessage: 'foo',
        user: null,
      };

      expect(reducer(initial, actionA)).toEqual(expected);
    });
  });
});
