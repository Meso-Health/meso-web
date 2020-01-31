import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { formatNumber } from 'lib/formatters';
import { formatCurrencyWithLabel } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import Box from 'components/box';
import Button from 'components/button';
import LoadingIndicator from 'components/loading-indicator';
import Divider from 'components/dividers/divider';
import { LayoutWithHeader } from 'components/layouts';
import { Text } from 'components/text';
import LargeStatsDisplay from 'components/large-stats-display';

import { historyPropType } from 'store/prop-types';
import { fetchProviders } from 'store/providers/providers-actions';
import {
  fetchReimbursements,
  createReimbursement as createReimbursementAction,
  fetchReimbursementStats,
  fetchReimbursableClaimsMetaData as fetchReimbursableClaimsMetaDataAction,
} from 'store/reimbursements/reimbursements-actions';

import { providersKeyedByIdSelector } from 'store/providers/providers-selectors';
import {
  reimbursableEncounterIdsSelector,
  reimbursableEncountersTotalPriceSelector,
  providerHasUnpaidReimbursmentSelector,
  newReimbursementStartDateSelector,
  reimbursementStatsForProviderSelector,
} from 'store/reimbursements/reimbursements-selectors';
import ReimbursementActionModal from './components/reimbursement-action-modal';
import ClaimsStatusTable from './components/claims-status-table';

class ReimbursementsProviderDetailContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { providerId } = ownProps.match.params;
    return ({
      providerId,
      providersById: providersKeyedByIdSelector(state),
      reimbursementStats: reimbursementStatsForProviderSelector(state, providerId),
      hasUnpaidReimbursement: providerHasUnpaidReimbursmentSelector(state, providerId),
      startDate: newReimbursementStartDateSelector(state, providerId),
      isLoading: state.providers.isLoadingProviders
        || state.reimbursements.isLoadingReimbursements
        || state.reimbursements.isLoadingStats,
      isPerformingAction: state.reimbursements.isPerformingReimbursementAction,
      reimbursementActionError: state.reimbursements.reimbursementActionError,
      reimbursableEncounterIds: reimbursableEncounterIdsSelector(state),
      totalPrice: reimbursableEncountersTotalPriceSelector(state),
    });
  }

  static mapDispatchToProps = dispatch => ({
    loadData(providerId) {
      dispatch(fetchProviders());
      dispatch(fetchReimbursements(providerId));
      dispatch(fetchReimbursementStats(providerId));
    },
    fetchReimbursableClaimsMetaData: (providerId, endDate) => (
      dispatch(fetchReimbursableClaimsMetaDataAction(providerId, endDate))
    ),
    createReimbursement: (reimbursement, providerId) => (
      dispatch(createReimbursementAction(reimbursement, providerId))
    ),
  })

  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
      serverError: false,
    };
  }

  componentDidMount() {
    const { loadData, providerId, fetchReimbursableClaimsMetaData } = this.props;
    loadData(providerId);
    fetchReimbursableClaimsMetaData(providerId, moment());
  }

  handleModalOpenClick = () => {
    this.setState({ isShowingModal: true });
  }

  handleModalRequestClose = () => {
    this.setState({ isShowingModal: false, serverError: false });
  }

  resolveCreate = (action) => {
    const { history } = this.props;
    if (action.errorMessage) {
      this.setState({ serverError: true });
    } else {
      this.handleModalRequestClose();
      history.push('/reimbursements/created/');
    }
  }

  handleCreateReimbursement = () => {
    const { match, createReimbursement, reimbursableEncounterIds, totalPrice } = this.props;
    const { providerId } = match.params;
    createReimbursement({ total: totalPrice, encounterIds: reimbursableEncounterIds }, providerId).then((action) => {
      this.resolveCreate(action);
    });
  }

  handleFetchReimbursableClaimsMetaData = (endDate) => {
    const { match, fetchReimbursableClaimsMetaData } = this.props;
    const { providerId } = match.params;

    fetchReimbursableClaimsMetaData(providerId, endDate);
  }

  render() {
    const {
      providersById,
      match,
      hasUnpaidReimbursement,
      isLoading,
      startDate,
      steps,
      viewOnly,
      isPerformingAction,
      reimbursementStats,
      totalPrice,
      reimbursableEncounterIds,
    } = this.props;
    const { serverError, isShowingModal } = this.state;
    const { providerId } = match.params;
    const providerExists = providersById && parseInt(providerId, 10);
    const provider = providerExists ? providersById[parseInt(providerId, 10)] : null;
    const providerName = provider ? provider.name : '';

    if (isLoading || !reimbursementStats) {
      return (<LoadingIndicator noun="stats" />);
    }
    const { lastPaymentDate, ...claimsByAdjudicationState } = reimbursementStats;
    const formattedLastPaymentDate = lastPaymentDate
      ? formatDate(lastPaymentDate)
      : '-';
    const { totalPrice: amount, claimsCount } = reimbursementStats.total;
    const stats = [
      { label: 'No. of claims', value: formatNumber(claimsCount) },
      { label: 'Amount', value: formatCurrencyWithLabel(amount) },
      { label: 'Last payment', value: formattedLastPaymentDate },
    ];

    const createDisabled = reimbursementStats.approved.claimsCount === 0 || hasUnpaidReimbursement;
    return (
      <LayoutWithHeader pageTitle="Reimbursements" steps={[...steps, { title: providerName, href: `/reimbursements/overview/${providerId}` }]}>
        <Box flex justifyContent="space-between" marginBottom={5}>
          <Box flex flexDirection="column">
            <Text fontSize={4} fontWeight="medium">{providerName}</Text>
            <Text color="gray.6" fontSize={2}>
              {'Today: '}
              {formatDate(moment.now())}
            </Text>
          </Box>
          {!viewOnly && (
            <Box flex flexDirection="column" justifyContent="flex-end">
              <Button
                primary
                disabled={createDisabled}
                onClick={this.handleModalOpenClick}
              >
                Create Reimbursement +
              </Button>
            </Box>
          )}
        </Box>
        <Box marginTop={5} marginBottom={5}><Divider /></Box>
        <LargeStatsDisplay stats={stats} />
        <Box marginTop={5} marginBottom={5}>
          <ClaimsStatusTable claimsByAdjudicationState={claimsByAdjudicationState} />
        </Box>
        {isShowingModal && (
          <ReimbursementActionModal
            isEdit={false}
            provider={provider}
            onCancel={this.handleModalRequestClose}
            onPrimaryClick={this.handleCreateReimbursement}
            onDateUpdate={this.handleFetchReimbursableClaimsMetaData}
            totalPrice={totalPrice}
            encounterIds={reimbursableEncounterIds}
            startDate={startDate}
            serverError={serverError}
            isPerformingAction={isPerformingAction}
          />
        )}
      </LayoutWithHeader>
    );
  }
}

ReimbursementsProviderDetailContainer.propTypes = {
  createReimbursement: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hasUnpaidReimbursement: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  fetchReimbursableClaimsMetaData: PropTypes.func.isRequired,
  providersById: PropTypes.shape({}).isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      providerId: PropTypes.string,
    }),
  }).isRequired,
  history: historyPropType.isRequired,
  viewOnly: PropTypes.bool,
  isPerformingAction: PropTypes.bool,
  providerId: PropTypes.string.isRequired,
  reimbursementStats: PropTypes.shape({
    lastPaymentDate: PropTypes.string,
    total: PropTypes.shape({
      totalPrice: PropTypes.number,
      claimsCount: PropTypes.number,
    }),
    approved: PropTypes.shape({
      claimsCount: PropTypes.number,
    }),
  }),
  totalPrice: PropTypes.number.isRequired,
  reimbursableEncounterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ReimbursementsProviderDetailContainer.defaultProps = {
  viewOnly: false,
  isPerformingAction: false,
  reimbursementStats: null,
};

export default connect(
  ReimbursementsProviderDetailContainer.mapStateToProps,
  ReimbursementsProviderDetailContainer.mapDispatchToProps,
)(ReimbursementsProviderDetailContainer);
