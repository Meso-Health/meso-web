import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filter } from 'lodash/fp';

import { fetchAdministrativeDivisions } from 'store/administrative-divisions/administrative-divisions-actions';
import { fetchEnrollmentReportingStats } from 'store/enrollment-reporting-stats/enrollment-reporting-stats-actions';
import { administrativeDivisionsByIdSelector, viewableAdminDivisionIdsSelector } from 'store/administrative-divisions/administrative-divisions-selectors';
import EnrollmentReportingStatsDisplay from 'containers/enrollment/components/enrollment-reporting-stats-display';
import EnrollmentReportingStatsFilters from 'containers/enrollment/components/enrollment-reporting-stats-filters';
import { userSelector } from 'store/auth/auth-selectors';

import { LayoutWithHeader } from 'components/layouts';
import Divider from 'components/dividers/divider';

class EnrollmentReportingStatsContainer extends Component {
  static mapDispatchToProps = dispatch => ({
    loadAdministrativeDivisions() {
      dispatch(fetchAdministrativeDivisions());
    },
    loadEnrollmentStats: filters => dispatch(fetchEnrollmentReportingStats(filters)),
  })

  static mapStateToProps = (state) => {
    const viewableAdminDivisionIds = viewableAdminDivisionIdsSelector(state);
    const filteredAdministrativeDivisions = filter(
      ad => viewableAdminDivisionIds.includes(ad.id),
    )(administrativeDivisionsByIdSelector(state));

    return {
      administrativeDivisions: filteredAdministrativeDivisions,
      administrativeDivisionsError: state.enrollmentReportingStats.administrativeDivisionsError,
      enrollmentReportingStatsResult: state.enrollmentReportingStats.enrollmentReportingStatsResult,
      isLoadingAdministrativeDivisions: state.administrativeDivisions.isLoadingAdministrativeDivisions,
      isLoadingEnrollmentStats: state.enrollmentReportingStats.isLoadingEnrollmentReportingStats,
      user: userSelector(state),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      filters: {
        startDate: undefined,
        endDate: undefined,
        administrativeDivisionId: undefined,
        paying: undefined,
        renewal: undefined,
        gender: undefined,
      },
    };
  }

  componentDidMount() {
    const { loadEnrollmentStats, loadAdministrativeDivisions } = this.props;
    const { filters } = this.state;

    loadAdministrativeDivisions();
    loadEnrollmentStats(filters);
  }

  updateFilters = (filters) => {
    const { loadEnrollmentStats } = this.props;
    this.setState({ filters }, () => {
      loadEnrollmentStats(filters);
    });
  }

  render() {
    const {
      administrativeDivisions,
      enrollmentReportingStatsResult,
      isLoadingAdministrativeDivisions,
      isLoadingEnrollmentStats,
    } = this.props;
    const { filters } = this.state;
    const steps = [{ title: 'Enrollment', href: '/enrollment-reporting' }];

    return (
      <LayoutWithHeader pageTitle="Enrollment" steps={steps}>
        <EnrollmentReportingStatsFilters
          administrativeDivisions={administrativeDivisions}
          filters={filters}
          isLoading={isLoadingAdministrativeDivisions}
          updateFilters={this.updateFilters}
        />
        <Divider />
        <EnrollmentReportingStatsDisplay
          isLoading={isLoadingEnrollmentStats}
          {...enrollmentReportingStatsResult}
        />
      </LayoutWithHeader>
    );
  }
}

export default connect(
  EnrollmentReportingStatsContainer.mapStateToProps,
  EnrollmentReportingStatsContainer.mapDispatchToProps,
)(EnrollmentReportingStatsContainer);

EnrollmentReportingStatsContainer.propTypes = {
  administrativeDivisions: PropTypes.arrayOf(PropTypes.shape({})),
  enrollmentReportingStatsResult: PropTypes.shape({}),
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    administrativeDivisionId: PropTypes.number,
    paying: PropTypes.string,
    renewal: PropTypes.string,
    gender: PropTypes.string,
  }),
  isLoadingAdministrativeDivisions: PropTypes.bool,
  isLoadingEnrollmentStats: PropTypes.bool,
  loadAdministrativeDivisions: PropTypes.func.isRequired,
  loadEnrollmentStats: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
};

EnrollmentReportingStatsContainer.defaultProps = {
  administrativeDivisions: [],
  enrollmentReportingStatsResult: {},
  filters: {},
  isLoadingAdministrativeDivisions: true,
  isLoadingEnrollmentStats: true,
  user: {},
};
