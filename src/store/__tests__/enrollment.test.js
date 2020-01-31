import reducer, { initialState } from 'store/enrollment/enrollment-reducers';
import {
  FETCH_ENROLLMENT_PERIODS_REQUEST,
  FETCH_ENROLLMENT_PERIODS_SUCCESS,
  FETCH_ENROLLMENT_PERIODS_FAILURE,
} from 'store/enrollment/enrollment-actions';

describe('enrollment', () => {
  describe('reducer', () => {
    it('returns the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState());
    });

    it('handles FETCH_ENROLLMENT_PERIODS_REQUEST', () => {
      const action = { type: FETCH_ENROLLMENT_PERIODS_REQUEST };

      const expected = expect.objectContaining({
        isLoadingEnrollmentPeriods: true,
        enrollmentPeriodsError: '',
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_ENROLLMENT_PERIODS_SUCCESS', () => {
      const a = {
        id: '1', providerId: '1', startDate: '2018-01-01', endDate: '2018-01-01',
      };
      const b = {
        id: '2', providerId: '1', startDate: '2018-01-02', endDate: '2018-01-02',
      };

      const action = {
        type: FETCH_ENROLLMENT_PERIODS_SUCCESS,
        response: [a, b],
      };

      const expected = expect.objectContaining({
        isLoadingEnrollmentPeriods: false,
        enrollmentPeriodsError: '',
        enrollmentPeriods: {
          1: a,
          2: b,
        },
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_ENROLLMENT_PERIODS_FAILURE', () => {
      const action = { type: FETCH_ENROLLMENT_PERIODS_FAILURE, errorMessage: 'Error message' };

      const expected = expect.objectContaining({
        isLoadingEnrollmentPeriods: false,
        enrollmentPeriodsError: 'Error message',
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });
  });
});
