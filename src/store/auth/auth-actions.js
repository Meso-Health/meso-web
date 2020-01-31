import session from 'lib/session';
import rollbar from 'lib/rollbar';
import { purgeStoredState } from 'redux-persist';
import persistConfig from 'store/persist-config';
import { getErrorMessage } from 'lib/utils';

const authErrorStatusMessages = {
  401: 'Invalid username or password.',
};

export const CLEAR_STATE = 'CLEAR_STATE';
export const clearState = () => ({ type: CLEAR_STATE });

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const logInFailure = errorMessage => ({ type: LOG_IN_FAILURE, errorMessage });

export const login = (username, password) => ({
  CALL_API: {
    call: api => api.login(username, password),
    transformResponse: ({ token, user, expiresAt }, dispatch) => {
      const prevUser = session.getPreviousUser();

      // We are agressively clearing data if the user has changed
      // in the future we can probably support leaving data for
      // the same provider.
      if (prevUser && prevUser.id !== user.id) {
        purgeStoredState(persistConfig);
        dispatch(clearState());
      }
      session.set({ token, expiresAt }, user);
      rollbar.setUser(user);
      return user;
    },
    transformError: err => getErrorMessage(err, authErrorStatusMessages),
    types: [LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE],
  },
});


export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const logout = () => ({
  CALL_API: {
    call: (api) => {
      const authTokenToRevoke = session.getTokenWithExpiry();
      if (authTokenToRevoke !== null) {
        session.setPreviousUser();
        session.clear();
        rollbar.removeUser();
        return api.logout(authTokenToRevoke);
      }
      return Promise.resolve();
    },
    types: [LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE],
  },
});
