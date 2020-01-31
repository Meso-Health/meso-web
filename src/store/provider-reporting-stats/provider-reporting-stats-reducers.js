import {
  FETCH_PROVIDER_REPORTING_STATS_FAILURE,
  FETCH_PROVIDER_REPORTING_STATS_REQUEST,
  FETCH_PROVIDER_REPORTING_STATS_SUCCESS,
} from './provider-reporting-stats-actions';

const initialState = {
  isLoadingProviderReportingStats: false,
  providerReportingStatsError: '',
  providerReportingStats: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROVIDER_REPORTING_STATS_REQUEST:
      return {
        ...state,
        isLoadingProviderReportingStats: true,
        providerReportingStatsError: '',
      };
    case FETCH_PROVIDER_REPORTING_STATS_SUCCESS:
      return {
        ...state,
        isLoadingProviderReportingStats: false,
        providerReportingStatsError: '',
        providerReportingStats: action.response,
      };
    case FETCH_PROVIDER_REPORTING_STATS_FAILURE:
      return {
        ...state,
        isLoadingProviderReportingStats: false,
        providerReportingStatsError: action.errorMessage,
      };
    default:
      return state;
  }
}
