import { keyBy } from 'lodash/fp';
import {
  FETCH_ENROLLMENT_PERIODS_FAILURE,
  FETCH_ENROLLMENT_PERIODS_REQUEST,
  FETCH_ENROLLMENT_PERIODS_SUCCESS,
} from './enrollment-actions';

export function initialState() {
  return {
    isLoadingEnrollmentPeriods: false,
    enrollmentPeriodsError: '',
    enrollmentPeriods: {},
  };
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case FETCH_ENROLLMENT_PERIODS_REQUEST:
      return {
        ...state,
        isLoadingEnrollmentPeriods: true,
        enrollmentPeriodsError: '',
      };
    case FETCH_ENROLLMENT_PERIODS_SUCCESS:
      return {
        ...state,
        isLoadingEnrollmentPeriods: false,
        enrollmentPeriodsError: '',
        enrollmentPeriods: keyBy('id', action.response),
      };
    case FETCH_ENROLLMENT_PERIODS_FAILURE:
      return {
        ...state,
        isLoadingEnrollmentPeriods: false,
        enrollmentPeriodsError: action.errorMessage,
      };
    default:
      return state;
  }
}
