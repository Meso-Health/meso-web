import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash/fp';

import { formatDate } from 'lib/formatters/date';

import { userSelector } from 'store/auth/auth-selectors';
import { fetchProviderReportingStats } from 'store/provider-reporting-stats/provider-reporting-stats-actions';
import {
  providerReportingStatsSelector,
  providerReportingStatsErrorSelector,
  providerReportingStatsLoadingSelector,
} from 'store/provider-reporting-stats/provider-reporting-stats-selectors';
import Box from 'components/box';
import { Layout } from 'components/layouts';
import Container from 'components/container';
import { Text } from 'components/text';
import { DatePicker } from 'components/inputs';
import LoadingIndicator from 'components/loading-indicator';

import ProviderReportingStatsOverview from 'containers/provider-reporting-stats/components/provider-reporting-stats-overview';
import { userPropType } from 'store/prop-types';

class ProviderReportingStatsView extends Component {
  static mapStateToProps = state => ({
    error: providerReportingStatsErrorSelector(state),
    providerStats: providerReportingStatsSelector(state),
    user: userSelector(state),
    isLoading: providerReportingStatsLoadingSelector(state),
  })

  static mapDispatchToProps = dispatch => ({
    loadData(providerId, startDate, endDate) {
      dispatch(fetchProviderReportingStats(providerId, startDate, endDate));
    },
  })

  constructor(props) {
    super(props);

    this.state = { startDate: null, endDate: null };
  }

  componentDidMount() {
    this.fetchStats();
  }

  handleDateChange = (gregorianDate, formattedDate, isStart) => {
    if (isStart) {
      this.setState({ startDate: gregorianDate }, () => this.fetchStats());
    } else {
      this.setState({ endDate: gregorianDate }, () => this.fetchStats());
    }
  }

  fetchStats() {
    const { loadData, user } = this.props;
    const { startDate, endDate } = this.state;

    const formattedStartDate = startDate ? startDate.format() : null;
    const formattedEndDate = endDate ? endDate.format() : null;
    loadData(user.providerId, formattedStartDate, formattedEndDate);
  }

  renderProviderStatsOverview = (stats) => {
    const { isLoading, error } = this.props;

    if (isLoading || isEmpty(stats)) {
      return <LoadingIndicator noun="report" />;
    }

    if (error) {
      return <LoadingIndicator noun="report" error={error} />;
    }

    return (
      <Container>
        <ProviderReportingStatsOverview stats={stats} />
      </Container>
    );
  }

  render() {
    const { isLoading, providerStats } = this.props;
    const {
      startDate,
      endDate,
    } = this.state;
    let reportHeaderText;
    if (!startDate && !endDate) {
      reportHeaderText = 'All time';
    } else {
      reportHeaderText = `${startDate ? formatDate(startDate) : 'Beginning Of Time'} to ${endDate ? formatDate(endDate) : 'End Of Time'}`;
    }

    return (
      <Layout pageTitle="Summary" supportsMobile>
        <DropdownBar>
          <Box flex justifyContent="flex-end" alignItems="center">
            <Box marginRight={4}>
              <DatePicker
                label="Start Date"
                onChange={(formattedDate, rawDate) => this.handleDateChange(formattedDate, rawDate, true)}
                name="start-date"
                disabled={isLoading}
              />
            </Box>
            <Box marginRight={4}>
              <DatePicker
                label="End Date"
                onChange={(formattedDate, rawDate) => this.handleDateChange(formattedDate, rawDate, false)}
                name="end-date"
                disabled={isLoading}
              />
            </Box>
          </Box>
        </DropdownBar>
        <Container>
          <ReportHeader>
            <Text fontSize={6}>{reportHeaderText}</Text>
            <Box marginTop={2}>
              <Text fontSize={2}>Report Period</Text>
            </Box>
          </ReportHeader>
        </Container>
        {this.renderProviderStatsOverview(providerStats)}
      </Layout>
    );
  }
}

ProviderReportingStatsView.propTypes = {
  providerStats: PropTypes.shape({}),
  error: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  user: userPropType,
};

ProviderReportingStatsView.defaultProps = {
  user: null,
  providerStats: null,
};

export default connect(
  ProviderReportingStatsView.mapStateToProps,
  ProviderReportingStatsView.mapDispatchToProps,
)(ProviderReportingStatsView);

const DropdownBar = styled.div`
  background-color: ${props => props.theme.colors.gray[0]};
  border-bottom: 1px #f2f2f2 solid;
  padding: 16px;
`;

const ReportHeader = styled.div`
  border-bottom: 1px #f2f2f2 solid;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-left: 16px;
  margin-right: 16px;
`;
