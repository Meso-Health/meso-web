import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isNil } from 'lodash/fp';
import styled from '@emotion/styled';

import { formatNumber, formatShortId } from 'lib/formatters';
import { formatCurrencyWithLabel } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import { fetchProviders } from 'store/providers/providers-actions';
import { fetchReimbursementReport as fetchReimbursementReportAction } from 'store/reporting/reporting-actions';
import {
  fetchReimbursements,
  updateReimbursement as updateReimbursementAction,
  fetchReimbursableClaimsMetaData as fetchReimbursableClaimsMetaDataAction,
  fetchReimbursementClaims as fetchReimbursementClaimsAction,
} from 'store/reimbursements/reimbursements-actions';
import { fetchAdministrativeDivisions } from 'store/administrative-divisions/administrative-divisions-actions';

import {
  reimbursableEncounterIdsSelector,
  reimbursableEncountersTotalPriceSelector,
  reimbursementByIdSelector,
  reimbursementsDetailStatsSelector,
} from 'store/reimbursements/reimbursements-selectors';
import { providersKeyedByIdSelector } from 'store/providers/providers-selectors';
import { administrativeDivisionsByIdSelector } from 'store/administrative-divisions/administrative-divisions-selectors';
import { accountingStatsForReimbursementSelector } from 'store/stats/stats-selectors';

import Box from 'components/box';
import { UnderlinedAnchor } from 'components/links';
import Icon from 'components/icon';
import { Text, ViewTitle } from 'components/text';
import LargeStatsDisplay from 'components/large-stats-display';
import LoadingIndicator from 'components/loading-indicator';
import Divider from 'components/dividers/divider';
import StatusDate from './components/status-date';

import AccountingCategoryTable from './components/accounting-category-table';
import ReimbursementPaymentModal from './components/reimbursement-payment-modal';
import ReimbursementPaymentDetails from './components/reimbursement-payment-details';
import ReimbursementActionModal from './components/reimbursement-action-modal';
import ReimbursementsLayout from './components/reimbursement-layout';

const PAYMENT_MODAL = 'payment';
const EDIT_MODAL = 'edit';

class ReimbursementsDetailContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { reimbursementId } = ownProps.match.params;

    return ({
      reimbursementId,
      administrativeDivisions: administrativeDivisionsByIdSelector(state),
      providersById: providersKeyedByIdSelector(state),
      reimbursement: reimbursementByIdSelector(state, reimbursementId),
      statValues: reimbursementsDetailStatsSelector(state, reimbursementId),
      accountingStats: accountingStatsForReimbursementSelector(state, reimbursementId),
      isLoading: state.providers.isLoadingProviders
        || state.reimbursements.isLoadingReimbursements,
      isLoadingClaims: state.reimbursements.isLoadingReimbursementClaims,
      isPerformingAction: state.reimbursements.isPerformingReimbursementAction,
      reimbursableEncounterIds: reimbursableEncounterIdsSelector(state),
      totalPrice: reimbursableEncountersTotalPriceSelector(state),
    });
  }

  static mapDispatchToProps = dispatch => ({
    loadData(reimbursementId) {
      dispatch(fetchProviders());
      dispatch(fetchReimbursements());
      dispatch(fetchAdministrativeDivisions());
      dispatch(fetchReimbursementClaimsAction(reimbursementId));
    },
    fetchReimbursementReport: reimbursementId => dispatch(fetchReimbursementReportAction(reimbursementId)),
    fetchReimbursableClaimsMetaData: (providerId, endDate, reimbursementId) => (
      dispatch(fetchReimbursableClaimsMetaDataAction(providerId, endDate, reimbursementId))
    ),
    updateReimbursement: reimbursement => dispatch(updateReimbursementAction(reimbursement)),
  });

  constructor(props) {
    super(props);

    this.state = {
      paymentModalOpen: false,
      editModalOpen: false,
      serverError: false,
    };
  }

  componentDidMount() {
    const { loadData, reimbursementId } = this.props;
    loadData(reimbursementId);
  }

  handleModalOpenClick = (modal) => {
    const { reimbursement, fetchReimbursableClaimsMetaData } = this.props;
    fetchReimbursableClaimsMetaData(reimbursement.providerId, reimbursement.endDate, reimbursement.id);
    if (modal === PAYMENT_MODAL) {
      this.setState({ paymentModalOpen: true });
    } else if (modal === EDIT_MODAL) {
      this.setState({ editModalOpen: true });
    }
  }

  handleModalCloseClick = (modal) => {
    if (modal === PAYMENT_MODAL) {
      this.setState({ paymentModalOpen: false, serverError: false });
    } else if (modal === EDIT_MODAL) {
      this.setState({ editModalOpen: false, serverError: false });
    }
  }

  handleExportClick = () => {
    const { reimbursement, fetchReimbursementReport } = this.props;
    // TODO: handle possible backend error:
    fetchReimbursementReport(reimbursement.id);
  }

  resolveUpdate = (action) => {
    if (action.errorMessage) {
      this.setState({ serverError: true });
    } else {
      this.setState({ editModalOpen: false, serverError: false });
    }
  }

  handleUpdateReimbursement = () => {
    const { match, updateReimbursement, totalPrice, reimbursableEncounterIds } = this.props;
    const { reimbursementId } = match.params;
    updateReimbursement({
      id: reimbursementId,
      total: totalPrice,
      encounterIds: reimbursableEncounterIds,
    }).then((action) => {
      this.resolveUpdate(action);
    });
  }

  handleFetchReimbursableClaimsMetaData = (endDate) => {
    const { fetchReimbursableClaimsMetaData, reimbursement } = this.props;

    fetchReimbursableClaimsMetaData(reimbursement.providerId, endDate, reimbursement.id);
  }

  render() {
    const { paymentModalOpen, editModalOpen, serverError } = this.state;
    const {
      match,
      reimbursement,
      providersById,
      accountingStats,
      totalPrice,
      reimbursableEncounterIds,
      isLoading,
      isLoadingClaims,
      steps,
      updateReimbursement,
      viewOnly,
      canCompletePayment,
      isPerformingAction,
    } = this.props;

    const { reimbursementId } = match.params;
    if (isLoading) {
      return (
        <ReimbursementsLayout steps={steps}>
          <LoadingIndicator noun="" />
        </ReimbursementsLayout>
      );
    }

    if (isNil(reimbursement)) {
      return (
        <ReimbursementsLayout steps={steps}>
          <div>
            {`Could not find reimbursement with the ID '${reimbursementId}'.`}
          </div>
        </ReimbursementsLayout>
      );
    }

    const provider = (providersById && reimbursement && reimbursement.providerId)
      ? providersById[reimbursement.providerId]
      : null;
    const providerName = provider ? provider.name : '';
    const stats = [
      { label: 'No. of claims', value: formatNumber(reimbursement.claimCount) },
      { label: 'Amount', value: formatCurrencyWithLabel(reimbursement.total) },
      { label: 'Start Date', value: formatDate(reimbursement.startDate) },
      { label: 'End Date', value: formatDate(reimbursement.endDate) },
    ];

    const date = (reimbursement && reimbursement.paymentDate) ? reimbursement.paymentDate : null;
    const paymentField = (reimbursement && reimbursement.paymentField) ? reimbursement.paymentField : null;

    const editDisabled = Boolean(date) || viewOnly;
    return (
      <ReimbursementsLayout steps={[...steps, { title: formatShortId(reimbursementId), href: `/reimbursements/created/${reimbursementId}` }]}>
        <Box flex flexDirection="column" justifyContent="space-between" marginBottom={5}>
          <Box>
            <ViewTitle fontWeight="medium">{providerName}</ViewTitle>
          </Box>
          <Box flex justifyContent="space-between">
            <Text color="gray.6" fontSize={2}>{formatShortId(reimbursementId)}</Text>
            <Box flex>
              {!editDisabled && (
                <BorderBox textAlign="center" paddingLeft={3} paddingRight={3}>
                  <UnderlinedAnchor onClick={() => this.handleModalOpenClick(EDIT_MODAL)}>
                    <Icon name="edit" size={18} iconSize={18} />
                    {' Edit details'}
                  </UnderlinedAnchor>
                </BorderBox>
              )}
              {canCompletePayment && !date && (
                <BorderBox textAlign="center" paddingRight={3} paddingLeft={3}>
                  <UnderlinedAnchor onClick={() => this.handleModalOpenClick(PAYMENT_MODAL)}>
                    <Icon name="add" size={18} iconSize={18} />
                    {' Payment info'}
                  </UnderlinedAnchor>
                </BorderBox>
              )}
              <BorderBox textAlign="center" paddingLeft={3} paddingRight={3}>
                <UnderlinedAnchor onClick={this.handleExportClick}>
                  <Icon name="download" size={18} iconSize={18} />
                  {' Export report'}
                </UnderlinedAnchor>
              </BorderBox>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box flex marginTop={5} marginBottom={5} justifyContent="center">
          <StatusDate date={date} />
        </Box>
        <LargeStatsDisplay stats={stats} />
        {paymentField
          && <ReimbursementPaymentDetails paymentDate={reimbursement.paymentDate} paymentDetails={paymentField} />}

        <Box marginTop={5}>
          <AccountingCategoryTable accountingStats={accountingStats} isLoading={isLoadingClaims} />
        </Box>
        {editModalOpen
          && (
            <ReimbursementActionModal
              isEdit
              provider={provider}
              onCancel={() => this.handleModalCloseClick(EDIT_MODAL)}
              onPrimaryClick={this.handleUpdateReimbursement}
              onDateUpdate={this.handleFetchReimbursableClaimsMetaData}
              totalPrice={totalPrice}
              encounterIds={reimbursableEncounterIds}
              startDate={reimbursement.startDate}
              endDate={reimbursement.endDate}
              serverError={serverError}
              isPerformingAction={isPerformingAction}
            />
          )}
        {paymentModalOpen
          && (
            <ReimbursementPaymentModal
              updateReimbursement={updateReimbursement}
              reimbursementId={reimbursement.id}
              reimbursementEndDate={reimbursement.endDate}
              onCancel={() => this.handleModalCloseClick(PAYMENT_MODAL)}
            />
          )}
      </ReimbursementsLayout>
    );
  }
}


const BorderBox = styled(Box)`
  & + & {
    border-left: 1px ${props => props.theme.colors.gray[2]} solid;
  }
`;

ReimbursementsDetailContainer.propTypes = {
  reimbursementId: PropTypes.string.isRequired,
  accountingStats: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  administrativeDivisions: PropTypes.shape({}).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingClaims: PropTypes.bool,
  loadData: PropTypes.func.isRequired,
  fetchReimbursableClaimsMetaData: PropTypes.func.isRequired,
  fetchReimbursementReport: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      reimbursementId: PropTypes.string,
    }),
  }).isRequired,
  providersById: PropTypes.shape({}).isRequired,
  statValues: PropTypes.shape({}).isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  reimbursableEncounterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateReimbursement: PropTypes.func.isRequired,
  reimbursement: PropTypes.shape({
    id: PropTypes.string,
    providerId: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    claimCount: PropTypes.number,
    total: PropTypes.number,
    paymentDate: PropTypes.string,
    paymentField: PropTypes.string,
  }),
  totalPrice: PropTypes.number,
  viewOnly: PropTypes.bool,
  canCompletePayment: PropTypes.bool,
  isPerformingAction: PropTypes.bool,
};

ReimbursementsDetailContainer.defaultProps = {
  isPerformingAction: false,
  totalPrice: 0,
  reimbursement: {},
  viewOnly: false,
  isLoadingClaims: true,
  canCompletePayment: false,
};

export default connect(
  ReimbursementsDetailContainer.mapStateToProps,
  ReimbursementsDetailContainer.mapDispatchToProps,
)(ReimbursementsDetailContainer);
