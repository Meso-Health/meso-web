import { keyBy } from 'lodash/fp';
import {
  FETCH_PROVIDERS_FAILURE,
  FETCH_PROVIDERS_REQUEST,
  FETCH_PROVIDERS_SUCCESS,
} from './providers-actions';

export const omittableFields = [
  'isLoadingProviders',
  'providersError',
];

export const initialState = {
  isLoadingProviders: false,
  providersError: '',
  providers: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROVIDERS_REQUEST:
      return {
        ...state,
        isLoadingProviders: true,
        providersError: '',
      };
    case FETCH_PROVIDERS_SUCCESS:
      return {
        ...state,
        isLoadingProviders: false,
        providersError: '',
        providers: keyBy('id', action.response),
      };
    case FETCH_PROVIDERS_FAILURE:
      return {
        ...state,
        isLoadingProviders: false,
        providersError: action.errorMessage,
      };
    default:
      return state;
  }
}
