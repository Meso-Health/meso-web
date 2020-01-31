import { keyBy } from 'lodash/fp';
import {
  FETCH_ADMINISTRATIVE_DIVISIONS_FAILURE,
  FETCH_ADMINISTRATIVE_DIVISIONS_SUCCESS,
  FETCH_ADMINISTRATIVE_DIVISIONS_REQUEST,
} from './administrative-divisions-actions';

export function initialState() {
  return {
    isLoadingAdministrativeDivisions: false,
    administrativeDivisionsError: '',
    administrativeDivisions: {},
  };
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case FETCH_ADMINISTRATIVE_DIVISIONS_REQUEST:
      return {
        ...state,
        isLoadingAdministrativeDivisions: true,
        administrativeDivisionsError: '',
      };
    case FETCH_ADMINISTRATIVE_DIVISIONS_SUCCESS:
      return {
        ...state,
        isLoadingAdministrativeDivisions: false,
        administrativeDivisionsError: '',
        administrativeDivisions: keyBy('id', action.response),
      };
    case FETCH_ADMINISTRATIVE_DIVISIONS_FAILURE:
      return {
        ...state,
        isLoadingAdministrativeDivisions: false,
        administrativeDivisionsError: action.errorMessage,
      };
    default:
      return state;
  }
}
