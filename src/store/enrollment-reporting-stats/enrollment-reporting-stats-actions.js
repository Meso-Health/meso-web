export const FETCH_ENROLLMENT_REPORTING_STATS_REQUEST = 'FETCH_ENROLLMENT_STATS_REQUEST';
export const FETCH_ENROLLMENT_REPORTING_STATS_SUCCESS = 'FETCH_ENROLLMENT_STATS_SUCCESS';
export const FETCH_ENROLLMENT_REPORTING_STATS_FAILURE = 'FETCH_ENROLLMENT_STATS_FAILURE';

// TODO: Filter by enrollment period as well.
export const fetchEnrollmentReportingStats = params => ({
  CALL_API: {
    call: api => api.fetchEnrollmentReportingStats(params),
    types: [
      FETCH_ENROLLMENT_REPORTING_STATS_REQUEST,
      FETCH_ENROLLMENT_REPORTING_STATS_SUCCESS,
      FETCH_ENROLLMENT_REPORTING_STATS_FAILURE,
    ],
  },
});
