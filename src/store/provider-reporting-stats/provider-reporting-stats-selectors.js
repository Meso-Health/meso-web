export const providerReportingStatsSelector = state => (
  state.providerReportingStats.providerReportingStats
);

export const providerReportingStatsErrorSelector = state => (
  state.providerReportingStats.providerReportingStatsError
);

export const providerReportingStatsLoadingSelector = state => (
  state.providerReportingStats.isLoadingProviderReportingStats
);
