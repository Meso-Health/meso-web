import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { reduce } from 'lodash/fp';

import { formatNumber } from 'lib/formatters';
import { formatCurrencyWithLabel } from 'lib/formatters/currency';

import Box from 'components/box';
import { SelectField } from 'components/inputs';
import LargeStatsDisplay from 'components/large-stats-display';
import LoadingIndicator from 'components/loading-indicator';
import { LayoutWithHeader } from 'components/layouts';
import { PillLink } from 'components/links';

import Divider from 'components/dividers/divider';

import { userPropType, historyPropType } from 'store/prop-types';
import { fetchProviders } from 'store/providers/providers-actions';
import { fetchReimbursements } from 'store/reimbursements/reimbursements-actions';

import { userSelector, isProviderUserSelector } from 'store/auth/auth-selectors';
import { encounterIsLoading } from 'store/encounters/encounters-selectors';
import { providersKeyedByIdSelector, providerNamesKeyedByIdSelector, providerIsLoading } from 'store/providers/providers-selectors';
import { reimbursementsArraySelector, createdReimbursementsStatsSelector, reimbursementIsLoading } from 'store/reimbursements/reimbursements-selectors';
import CreatedReimbursementsTable from './components/created-reimbursements-table';

class ReimbursementsIndexContainer extends Component {
  static mapStateToProps = state => ({
    user: userSelector(state),
    reimbursements: reimbursementsArraySelector(state),
    statValues: createdReimbursementsStatsSelector(state),
    providersById: providersKeyedByIdSelector(state),
    providerNamesById: providerNamesKeyedByIdSelector(state),
    isLoading: encounterIsLoading(state)
      || providerIsLoading(state)
      || reimbursementIsLoading(state),
    isProviderUser: isProviderUserSelector(state),
  });

  static mapDispatchToProps = dispatch => ({
    loadData(providerId) {
      dispatch(fetchProviders());
      dispatch(fetchReimbursements(providerId));
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      selectedProviderId: null,
    };
  }

  componentDidMount() {
    const { loadData, user, isProviderUser } = this.props;
    loadData(isProviderUser ? user.providerId : null);
  }

  handleProviderChange = (e) => {
    const selectedProviderId = parseInt(e.target.value, 10) || null;
    this.setState({ selectedProviderId });
  }

  handleRowClick = (route) => {
    const { history } = this.props;
    history.push(route);
  }

  getTableData = () => {
    const { reimbursements, providerNamesById } = this.props;
    return reimbursements.map(r => ({
      ...r,
      provider: providerNamesById[r.providerId],
      startDate: moment(r.startDate),
      endDate: moment(r.endDate),
    }));
  }

  render() {
    const {
      providersById,
      providerNamesById,
      statValues,
      isLoading,
      steps,
      isProviderUser,
    } = this.props;
    const { selectedProviderId } = this.state;
    const providerOptions = reduce((opts, p) => [...opts, { ...p, value: p.id }], [{ name: 'All Providers', value: 0 }])(providersById);

    const providerCount = isProviderUser ? 1 : (providerOptions.length - 1);
    const stats = [
      { label: 'No. of providers', value: providerCount }, // list includes 'All Providers' ie -1
      { label: 'No. of total claims', value: formatNumber(statValues.claims) },
      { label: 'Total amount', value: formatCurrencyWithLabel(statValues.amount) },
    ];
    const filters = {
      providerId: selectedProviderId || null,
    };

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
            <LargeStatsDisplay stats={stats} />
            <Box flex flexDirection="column" width="30%" marginTop={6} marginBottom={4}>
              {!isProviderUser && (
                <SelectField
                  key="provider"
                  name="provider"
                  options={providerOptions}
                  onChange={this.handleProviderChange}
                />
              )}
            </Box>
            <CreatedReimbursementsTable
              data={this.getTableData()}
              onClickRow={this.handleRowClick}
              valueFilters={filters}
              providerNamesById={providerNamesById}
            />
          </>
        )}
      </LayoutWithHeader>
    );
  }
}

ReimbursementsIndexContainer.propTypes = {
  isProviderUser: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  user: userPropType.isRequired,
  providersById: PropTypes.shape({}).isRequired,
  providerNamesById: PropTypes.shape({}).isRequired,
  reimbursements: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  statValues: PropTypes.shape({
    claims: PropTypes.number,
    amount: PropTypes.number,
  }).isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  history: historyPropType.isRequired,
};

export default connect(
  ReimbursementsIndexContainer.mapStateToProps,
  ReimbursementsIndexContainer.mapDispatchToProps,
)(ReimbursementsIndexContainer);
