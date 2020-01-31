/**
 * Fetch enrollment periods
 */

export const FETCH_ENROLLMENT_PERIODS_REQUEST = 'FETCH_ENROLLMENT_PERIODS_REQUEST';
export const FETCH_ENROLLMENT_PERIODS_SUCCESS = 'FETCH_ENROLLMENT_PERIODS_SUCCESS';
export const FETCH_ENROLLMENT_PERIODS_FAILURE = 'FETCH_ENROLLMENT_PERIODS_FAILURE';

export const fetchEnrollmentPeriods = (id, opts = {}) => ({
  CALL_API: {
    // eslint-disable-next-line consistent-return
    beforeRequest(_, getState) {
      const storedEnrollmentPeriods = getState().enrollment.enrollmentPeriods;

      if (Object.keys(storedEnrollmentPeriods).length > 0 && opts.force !== true) {
        return Promise.resolve(storedEnrollmentPeriods);
      }
    },
    call: api => api.fetchEnrollmentPeriods(),
    types: [FETCH_ENROLLMENT_PERIODS_REQUEST, FETCH_ENROLLMENT_PERIODS_SUCCESS, FETCH_ENROLLMENT_PERIODS_FAILURE],
  },
});
