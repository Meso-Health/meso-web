import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduce, values } from 'lodash/fp';

import { formatNumber } from 'lib/formatters';
import { formatCurrencyWithLabel } from 'lib/formatters/currency';

import Box from 'components/box';
import Divider from 'components/dividers/divider';
import { PillLink } from 'components/links';

import LoadingIndicator from 'components/loading-indicator';
import LargeStatsDisplay from 'components/large-stats-display';
import { LayoutWithHeader } from 'components/layouts';

import { userPropType, historyPropType } from 'store/prop-types';
import { fetchProviders } from 'store/providers/providers-actions';
import { fetchReimbursements, fetchReimbursementStats } from 'store/reimbursements/reimbursements-actions';

import { providerNamesKeyedByIdSelector } from 'store/providers/providers-selectors';
import { userSelector, isProviderUserSelector } from 'store/auth/auth-selectors';
import { reimbursementStatsKeyedByProviderIdSelector } from 'store/reimbursements/reimbursements-selectors';
import OverviewBalanceTable from './components/overview-balance-table';

class ReimbursementsOverviewContainer extends Component {
  static mapStateToProps = state => ({
    user: userSelector(state),
    reimbursementStatsByProviderId: reimbursementStatsKeyedByProviderIdSelector(state),
    providerNamesById: providerNamesKeyedByIdSelector(state),
    isLoading: state.providers.isLoadingProviders
      || state.reimbursements.isLoadingReimbursements
      || state.reimbursements.isLoadingStats,
    isProviderUser: isProviderUserSelector(state),
  })

  static mapDispatchToProps = dispatch => ({
    loadData(providerId) {
      dispatch(fetchProviders());
      dispatch(fetchReimbursements(providerId));
      dispatch(fetchReimbursementStats(providerId));
    },
  })

  componentDidMount() {
    const { loadData, user, isProviderUser } = this.props;
    loadData(isProviderUser ? user.providerId : null);
  }

  handleRowClick = (route) => {
    const { history } = this.props;
    history.push(route);
  }

  render() {
    const {
      providerNamesById,
      isLoading,
      steps,
      reimbursementStatsByProviderId,
      isProviderUser,
    } = this.props;

    const totals = reduce((total, providerStats) => {
      const claimsCount = total.claimsCount + providerStats.total.claimsCount;
      const totalPrice = total.totalPrice + providerStats.total.totalPrice;
      return { claimsCount, totalPrice };
    }, { claimsCount: 0, totalPrice: 0 })(reimbursementStatsByProviderId);

    const stats = [
      { label: 'No. of providers', value: isProviderUser ? 1 : values(providerNamesById).length },
      { label: 'No. of total claims', value: formatNumber(totals.claimsCount) },
      { label: 'Total amount', value: formatCurrencyWithLabel(totals.totalPrice) },
    ];
    return (
      <LayoutWithHeader pageTitle="Reimbursements" steps={steps}>
        <Box flex marginBottom={4}>
          <Box marginRight={3}>
            <PillLink to="/reimbursements" exact>Accrued amount</PillLink>
          </Box>
          <Box marginRight={3}>
            <PillLink to="/reimbursements/created" exact>Created reimbursements</PillLink>
          </Box>
        </Box>
        <Box marginTop={5} marginBottom={5}><Divider /></Box>
        {isLoading && <LoadingIndicator noun="" />}
        {!isLoading && (
          <>
            <Box marginBottom={5}>
              <LargeStatsDisplay stats={stats} />
            </Box>
            <Box marginTop={6}>
              <OverviewBalanceTable
                data={values(reimbursementStatsByProviderId)}
                onClickRow={this.handleRowClick}
                providerNamesById={providerNamesById}
              />
            </Box>
          </>
        )}
      </LayoutWithHeader>
    );
  }
}

ReimbursementsOverviewContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isProviderUser: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  user: userPropType.isRequired, // TODO MAKE SHAPE
  providerNamesById: PropTypes.shape({}).isRequired, // TODO MAKE SHAPE
  reimbursementStatsByProviderId: PropTypes.shape({}).isRequired, // TODO MAKE SHAPE
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO MAKE SHAPE
  history: historyPropType.isRequired,
};

export default connect(
  ReimbursementsOverviewContainer.mapStateToProps,
  ReimbursementsOverviewContainer.mapDispatchToProps,
)(ReimbursementsOverviewContainer);
