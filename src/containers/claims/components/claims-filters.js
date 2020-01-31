import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduce } from 'lodash/fp';

import { isNull } from 'util';
import {
  ADJUDICATION_STATES,
  ADMIN_DIVISIONS,
} from 'lib/config';
import {
  CLAIM_AMOUNT_FILTERS,
  CLAIM_STATUS_FILTERS,
  FLAG_STATUS_FILTERS,
  PAID_STATUS_FILTERS,
  PROVIDER_TYPE_FILTERS,
} from 'lib/config/claims-filters';
import { formatDate } from 'lib/formatters/date';

import { isProviderUserSelector } from 'store/auth/auth-selectors';
import { secondLevelFilterOptionsSelector } from 'store/administrative-divisions/administrative-divisions-selectors';
import { hasClaimFiltersSetSelector } from 'store/claims-ui/claims-ui-selectors';
import {
  setClaimFilters as setClaimFiltersAction,
  clearClaimFilters as clearClaimFiltersAction,
} from 'store/claims-ui/claims-ui-actions';

import Grid from '@material-ui/core/Grid';

import { DatePicker, SelectField } from 'components/inputs';
import Box from 'components/box';
import Button from 'components/button';

class ClaimsFilters extends Component {
  static mapStateToProps = state => ({
    isProviderUser: isProviderUserSelector(state),
    providers: state.providers.providers,
    filters: state.claimsUi.filters,
    secondLevelFilterOptions: secondLevelFilterOptionsSelector(state),
    showClearButton: hasClaimFiltersSetSelector(state),
  });

  static mapDispatchToProps = dispatch => ({
    setClaimFilters: filters => dispatch(setClaimFiltersAction(filters)),
    clearClaimFilters: () => dispatch(clearClaimFiltersAction()),
  });

  startDateRef = React.createRef();

  endDateRef = React.createRef();

  handleAddFilters = () => {
    const { loadClaims } = this.props;
    loadClaims();
  }

  handleClearFilters = async () => {
    const { clearClaimFilters, loadClaims } = this.props;
    await clearClaimFilters();
    loadClaims();

    if (this.startDateRef.current) {
      this.startDateRef.current.clear();
    }

    if (this.endDateRef.current) {
      this.endDateRef.current.clear();
    }
  }

  handleSetStatusFilter = (value) => {
    const { setClaimFilters } = this.props;
    let resubmitted = null;
    let audited = null;

    switch (value) {
      case 'resubmissions':
        resubmitted = true;
        break;
      case 'no_resubmissions':
        resubmitted = false;
        break;
      case 'audits':
        audited = true;
        break;
      case 'no_audits':
        audited = false;
        break;
      default:
        break;
    }
    setClaimFilters({ resubmitted, audited });
  }

  handleSetPaidFilter = (value) => {
    const { setClaimFilters } = this.props;
    let paid = null;

    switch (value) {
      case 'none':
        paid = 'none';
        break;
      case 'paid':
        paid = true;
        break;
      case 'unpaid':
        paid = false;
        break;
      default:
        break;
    }
    setClaimFilters({ paid });
  }

  createStatusFilterValue = () => {
    const { filters: { resubmitted, audited } } = this.props;
    if (resubmitted != null) {
      return resubmitted ? 'resubmissions' : 'no_resubmissions';
    }
    if (audited != null) {
      return audited ? 'audits' : 'no_audits';
    }
    return 'none';
  }

  createPaidFilterValue = () => {
    const { filters: { paid } } = this.props;
    if (paid === 'none') {
      return 'none';
    }
    return paid ? 'paid' : 'unpaid';
  }

  handleSetIntFilter = (value, filter) => {
    const { setClaimFilters } = this.props;
    setClaimFilters({ [filter]: parseInt(value, 10) || null });
  }

  handleSetStringFilter = (value, filter) => {
    const { setClaimFilters } = this.props;
    // since value=null returns the label we are using "none" instead
    setClaimFilters({ [filter]: value });
  }

  handleDateChange = (formattedDate, _, isStart) => {
    const { setClaimFilters } = this.props;
    if (isStart) {
      setClaimFilters({ startDate: formattedDate });
    } else {
      setClaimFilters({ endDate: formattedDate });
    }
  }

  render() {
    const {
      providers,
      filters,
      secondLevelFilterOptions,
      showClearButton,
      isProviderUser,
      adjudicationState,
      handleExportClick,
    } = this.props;
    const {
      providerType,
      providerId,
      memberAdminDivisionId,
      maxAmount,
      flag,
      startDate,
      endDate,
    } = filters;

    const statusFilterValue = this.createStatusFilterValue();
    const paidFilterValue = this.createPaidFilterValue();

    const startDateDefault = startDate ? { defaultDate: formatDate(startDate) } : {};
    const endDateDefault = endDate ? { defaultDate: formatDate(endDate) } : {};

    const providerOptions = reduce((opts, p) => {
      if (providerType === 'none' || p.providerType === providerType) {
        return [...opts, { ...p, value: p.id }];
      }
      return [...opts];
    }, [{ name: 'All providers', value: 0 }])(providers);
    const showProviderFilters = !isProviderUser;
    const showClaimAndFlagStatusFilters = adjudicationState === ADJUDICATION_STATES.PENDING;
    const showPaidStatusFilter = adjudicationState === ADJUDICATION_STATES.APPROVED;
    const showSecondLevelFilter = adjudicationState !== ADJUDICATION_STATES.EXTERNAL;

    return (
      <>
        <Grid container>
          {showProviderFilters && (
            <>
              <Grid item xs={3}>
                <Box paddingRight={3} paddingBottom={3}>
                  <SelectField
                    internalLabel
                    label="Provider level"
                    key="providerLevel"
                    name="providerLevel"
                    options={PROVIDER_TYPE_FILTERS}
                    value={providerType}
                    onChange={e => this.handleSetStringFilter(e.target.value, 'providerType')}
                  />
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box paddingRight={3} paddingBottom={3}>
                  <SelectField
                    internalLabel
                    label="Provider name"
                    key="providerId"
                    name="providerId"
                    options={providerOptions}
                    value={providerId}
                    onChange={e => this.handleSetIntFilter(e.target.value, 'providerId')}
                  />
                </Box>
              </Grid>
            </>
          )}
          <Grid item xs={showProviderFilters ? 3 : 6}>
            <Box paddingRight={3} paddingBottom={3}>
              <DatePicker
                ref={this.startDateRef}
                label="Start date"
                internalLabel
                onChange={(formattedDate, rawDate) => this.handleDateChange(formattedDate, rawDate, true)}
                maxDate={formatDate(endDate)}
                {...startDateDefault}
                name="start-date"
              />
            </Box>
          </Grid>
          <Grid item xs={showProviderFilters ? 3 : 6}>
            <DatePicker
              ref={this.endDateRef}
              label="End date"
              internalLabel
              onChange={(formattedDate, rawDate) => this.handleDateChange(formattedDate, rawDate, false)}
              minDate={formatDate(startDate)}
              {...endDateDefault}
              name="end-date"
              disabled={isNull(startDateDefault)}
            />
          </Grid>
        </Grid>
        <Grid container>
          {showSecondLevelFilter && (
            <Grid item xs={6}>
              <Box paddingRight={3} paddingBottom={3}>
                <SelectField
                  internalLabel
                  label={`Member ${ADMIN_DIVISIONS.SECOND_LEVEL}`}
                  key="memberSecondLevelId"
                  name="memberSecondLevelId"
                  options={secondLevelFilterOptions}
                  value={memberAdminDivisionId}
                  onChange={e => this.handleSetIntFilter(e.target.value, 'memberAdminDivisionId')}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={6}>
            <Box paddingRight={showSecondLevelFilter ? 0 : 3} paddingBottom={3}>
              <SelectField
                internalLabel
                label="Amount"
                key="amount"
                name="amount"
                options={CLAIM_AMOUNT_FILTERS}
                value={maxAmount}
                onChange={e => this.handleSetIntFilter(e.target.value, 'maxAmount')}
              />
            </Box>
          </Grid>
        </Grid>
        {showClaimAndFlagStatusFilters && (
          <Grid container>
            <Grid item xs={6}>
              <Box paddingRight={3} paddingBottom={3}>
                <SelectField
                  internalLabel
                  label="Claim status"
                  key="claimStatus"
                  name="claimStatus"
                  options={CLAIM_STATUS_FILTERS}
                  value={statusFilterValue}
                  onChange={e => this.handleSetStatusFilter(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box paddingBottom={3}>
                <SelectField
                  internalLabel
                  label="Flag status"
                  key="flagStatus"
                  name="flagStatus"
                  options={FLAG_STATUS_FILTERS}
                  value={flag}
                  onChange={e => this.handleSetStringFilter(e.target.value, 'flag')}
                />
              </Box>
            </Grid>
          </Grid>
        )}
        {showPaidStatusFilter && (
          <Grid container>
            <Grid item xs={6}>
              <Box paddingRight={3} paddingBottom={3}>
                <SelectField
                  internalLabel
                  label="Paid status"
                  key="paidStatus"
                  name="paidStatus"
                  options={PAID_STATUS_FILTERS}
                  value={paidFilterValue}
                  onChange={e => this.handleSetPaidFilter(e.target.value, 'paid')}
                />
              </Box>
            </Grid>
          </Grid>
        )}
        <Box flex justifyContent={showClearButton ? 'space-between' : 'flex-end'}>
          {showClearButton && (
            <Box>
              <Button inline onClick={this.handleClearFilters}>Clear all filters</Button>
            </Box>
          )}
          <Box flex>
            <Box marginRight={3}>
              <Button inline onClick={handleExportClick}>Export</Button>
            </Box>
            <Box>
              <Button inline primary onClick={this.handleAddFilters}>Submit</Button>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}
export default connect(
  ClaimsFilters.mapStateToProps,
  ClaimsFilters.mapDispatchToProps,
)(ClaimsFilters);

ClaimsFilters.propTypes = {
  isProviderUser: PropTypes.bool.isRequired,
  providers: PropTypes.shape({}).isRequired,
  secondLevelFilterOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  generateFetchClaimsParams: PropTypes.func.isRequired,
  loadClaims: PropTypes.func.isRequired,
  handleExportClick: PropTypes.func.isRequired,
  showClearButton: PropTypes.bool.isRequired,
  setClaimFilters: PropTypes.func.isRequired,
  clearClaimFilters: PropTypes.func.isRequired,
  adjudicationState: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    resubmitted: PropTypes.string,
    audited: PropTypes.string,
    providerType: PropTypes.string,
    providerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    memberAdminDivisionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    paid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    flag: PropTypes.string,
    startDate: PropTypes.shape({}),
    endDate: PropTypes.shape({}),
  }),
};

ClaimsFilters.defaultProps = {
  filters: {},
};
