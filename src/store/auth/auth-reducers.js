import session from 'lib/session';
import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_REQUEST,
} from './auth-actions';

export const initialState = {
  isAuthenticated: session.getTokenWithExpiry() !== null,
  isAuthenticating: false,
  errorMessage: '',
  user: session.getUser(),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        errorMessage: '',
      };
    case LOG_OUT_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: false,
        errorMessage: '',
        user: null,
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isAuthenticating: false,
        errorMessage: '',
        user: action.response,
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticating: false,
        errorMessage: action.errorMessage,
        user: null,
      };
    default:
      return state;
  }
}
