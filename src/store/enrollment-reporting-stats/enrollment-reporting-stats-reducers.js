import {
  FETCH_ENROLLMENT_REPORTING_STATS_FAILURE,
  FETCH_ENROLLMENT_REPORTING_STATS_REQUEST,
  FETCH_ENROLLMENT_REPORTING_STATS_SUCCESS,
} from './enrollment-reporting-stats-actions';

export function initialState() {
  return {
    isLoadingEnrollmentReportingStats: false,
    enrollmentReportingStatsError: '',
    enrollmentReportingCounts: {},
    enrollmentReportingFinancials: {},
  };
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case FETCH_ENROLLMENT_REPORTING_STATS_REQUEST:
      return {
        ...state,
        isLoadingEnrollmentReportingStats: true,
        enrollmentReportingStatsError: '',
      };
    case FETCH_ENROLLMENT_REPORTING_STATS_SUCCESS:
      return {
        ...state,
        isLoadingEnrollmentReportingStats: false,
        enrollmentReportingStatsError: '',
        enrollmentReportingStatsResult: action.response,
      };
    case FETCH_ENROLLMENT_REPORTING_STATS_FAILURE:
      return {
        ...state,
        isLoadingEnrollmentReportingStats: false,
        enrollmentReportingStatsError: action.errorMessage,
      };
    default:
      return state;
  }
}
