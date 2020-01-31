import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, snakeCase, mergeWith } from 'lodash/fp';

import { objectHasProp } from 'lib/utils';
import { isMembershipNumber, isShortUUID, titleCase } from 'lib/string-utils';
import { formatMembershipNumber, formatStringArray } from 'lib/formatters';
import { ADJUDICATION_STATES } from 'lib/config';

import { historyPropType } from 'store/prop-types';
import { fetchClaims as fetchClaimsAction, fetchClaimsByUrl } from 'store/claims/claims-actions';
import { fetchClaimsReport as fetchClaimsReportAction } from 'store/reporting/reporting-actions';
import {
  encounterErrorSelector,
  claimFlagByIdSelector,
  preparedEncountersWithUiFiltersKeyedByIdSelector,
} from 'store/encounters/encounters-selectors';
import { fetchAdministrativeDivisions } from 'store/administrative-divisions/administrative-divisions-actions';
import { fetchProviders } from 'store/providers/providers-actions';
import { getDiagnosesNames } from 'store/diagnoses/diagnoses-selectors';
import {
  clearClaimFilters as clearClaimFiltersAction,
  setClaimSearch as setClaimSearchAction,
  clearClaimSearch as clearClaimSearchAction,
  setShowSearch as setShowSearchAction,
  setShowFilters as setShowFiltersAction,
  setClaimSort as setClaimSortAction,
} from 'store/claims-ui/claims-ui-actions';
import { initialFiltersState } from 'store/claims-ui/claims-ui-reducers';
import { claimsKeyedByIdSelector } from 'store/claims/claims-selectors';
import {
  claimsSearchSelector,
  claimsFiltersSelector,
  showSearchSelector,
  showFiltersSelector,
  claimSortFieldSelector,
  claimSortDirectionSelector,
} from 'store/claims-ui/claims-ui-selectors';

import { LayoutWithHeader } from 'components/layouts';
import Box from 'components/box';
import Pill from 'components/pill';
import SearchBar from 'components/search-bar';
import LoadingIndicator from 'components/loading-indicator';
import { ErrorLabel } from 'components/alerts';
import { PillLink } from 'components/links';
import { Divider } from 'components/dividers';
import ClaimsTable from './components/claims-table';
import ClaimsFilters from './components/claims-filters';

class ClaimsIndexContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { match } = ownProps;
    const { adjudicationState } = match.params;
    const isLoading = state.providers.isLoadingProviders
      || state.claims.isLoadingClaims
      || state.administrativeDivisions.isLoadingAdministrativeDivisions;
    return {
      isLoading,
      error: encounterErrorSelector(state),
      adjudicationState: adjudicationState || ADJUDICATION_STATES.PENDING,
      encounters: preparedEncountersWithUiFiltersKeyedByIdSelector(state),
      claims: claimsKeyedByIdSelector(state), // only used to get the originally submitted at date
      providers: state.providers.providers,
      diagnoses: state.diagnoses.diagnoses,
      user: state.auth.user,
      encounterFlags: isLoading ? {} : claimFlagByIdSelector(state),
      total: state.claims.pagination.total,
      nextUrl: state.claims.pagination.nextUrl,
      prevUrl: state.claims.pagination.prevUrl,
      filters: claimsFiltersSelector(state),
      searchFields: claimsSearchSelector(state),
      showSearch: showSearchSelector(state),
      showFilters: showFiltersSelector(state),
      sortField: claimSortFieldSelector(state),
      sortDirection: claimSortDirectionSelector(state),
    };
  };

  static mapDispatchToProps = dispatch => ({
    fetchClaims: claimParams => dispatch(fetchClaimsAction(claimParams)),
    loadData(claimParams) {
      dispatch(fetchProviders());
      dispatch(fetchClaimsAction(claimParams));
      dispatch(fetchAdministrativeDivisions());
    },
    fetchClaimsReport: claimParams => dispatch(fetchClaimsReportAction(claimParams)),
    fetchMoreClaims: url => dispatch(fetchClaimsByUrl(url)),
    clearClaimFilters: () => dispatch(clearClaimFiltersAction()),
    setClaimSearch: searchFields => dispatch(setClaimSearchAction(searchFields)),
    clearClaimSearch: () => dispatch(clearClaimSearchAction()),
    setShowSearch: showSearch => dispatch(setShowSearchAction(showSearch)),
    setShowFilters: showFilters => dispatch(setShowFiltersAction(showFilters)),
    setClaimSort: searchFields => dispatch(setClaimSortAction(searchFields)),
  });

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      showSearchError: false,
    };
  }

  componentDidMount() {
    const { loadData } = this.props;

    loadData(this.generateFetchClaimsParams());
  }

  async componentDidUpdate(prevProps) {
    const {
      adjudicationState: prevAdjudicationState,
      sortField: prevSortField,
      sortDirection: prevSortDirection,
    } = prevProps;
    const {
      clearClaimFilters,
      clearClaimSearch,
      adjudicationState,
      sortField,
      sortDirection,
    } = this.props;

    if (adjudicationState !== prevAdjudicationState) {
      await clearClaimFilters();
      await clearClaimSearch();
      this.loadClaims();
    } else if (sortField !== prevSortField || sortDirection !== prevSortDirection) {
      this.loadClaims();
    }
  }

  componentWillUnmount() {
    const { clearClaimFilters } = this.props;
    clearClaimFilters();
  }

  loadClaims = () => {
    const { fetchClaims } = this.props;
    const queryParams = this.generateFetchClaimsParams();

    // fetch claims is always getting a new set of claims so start back at page 0
    fetchClaims(queryParams);
    this.setState({ page: 0 });
  }

  handleRowClick = async (route) => {
    const { history, clearClaimFilters, clearClaimSearch } = this.props;

    await clearClaimFilters();
    await clearClaimSearch();
    history.push(route);
  }

  handleFilterTabClick = async () => {
    const { setShowFilters, showFilters, clearClaimSearch, searchFields } = this.props;

    setShowFilters(!showFilters);

    if (searchFields.searchField !== null || searchFields.searchQuery != null) {
      await clearClaimSearch();
      this.loadClaims();
    }
  }

  handleSearchTabClick = async () => {
    const { setShowSearch, showSearch } = this.props;

    setShowSearch(!showSearch);
  }

  handlePageChange = (newPage) => {
    const { nextUrl, prevUrl, fetchMoreClaims } = this.props;
    const { page } = this.state;

    if (newPage > page) {
      fetchMoreClaims(nextUrl);
    }

    if (newPage < page) {
      fetchMoreClaims(prevUrl);
    }

    this.setState({ page: newPage });
  }

  handleSortChange = (newSortField) => {
    const { sortField: currentSortField, sortDirection: currentSortDirection, setClaimSort } = this.props;

    let newSortDirection = 'desc';
    if (currentSortField === newSortField && currentSortDirection === 'desc') {
      newSortDirection = 'asc';
    }

    setClaimSort({ field: newSortField, direction: newSortDirection });
  }

  generateFetchClaimsParams = () => {
    const { adjudicationState, filters, searchFields, showSearch, sortField, sortDirection } = this.props;

    let queryParams = {
      adjudicationState,
      sort: `${sortDirection === 'desc' ? '-' : ''}${snakeCase(sortField)}`,
    };

    // include filters as long as search isn't showing
    if (!showSearch) {
      const removeInitialValues = (filterValue, initialValue) => (filterValue === initialValue ? null : filterValue);

      const filtersWithNullInitial = mergeWith(removeInitialValues, filters, initialFiltersState);
      queryParams = {
        ...queryParams,
        ...filtersWithNullInitial,
      };
    }

    // Only include search when showing
    if (showSearch) {
      queryParams = {
        ...queryParams,
        ...searchFields,
      };
    }

    return queryParams;
  }

  handleExportClick = () => {
    const { fetchClaimsReport } = this.props;
    fetchClaimsReport(this.generateFetchClaimsParams());
  }

  handleSearchButtonClick = async (searchQuery) => {
    const { setClaimSearch, setClaimSort } = this.props;
    let predictedSearchField = null;

    if (isShortUUID(searchQuery)) {
      predictedSearchField = 'claim_id';
      await setClaimSearch({ searchField: predictedSearchField, searchQuery });
    } else if (isMembershipNumber(formatMembershipNumber(searchQuery))) {
      predictedSearchField = 'membership_number';
      await setClaimSearch({ searchField: predictedSearchField, searchQuery: formatMembershipNumber(searchQuery) });
    }

    if (predictedSearchField) {
      this.setState({ showSearchError: false });
      await setClaimSort({ field: 'submittedAt', direction: 'desc' });
      this.loadClaims();
    } else {
      this.setState({ showSearchError: true });
    }
  }

  render() {
    const {
      isLoading,
      error,
      encounters,
      claims,
      providers,
      diagnoses,
      adjudicationState,
      encounterFlags,
      total,
      showExternal,
      showFilters,
      showSearch,
      sortField,
      sortDirection,
    } = this.props;
    const { showSearchError, page } = this.state;
    const steps = [{ title: 'Claims', href: '/claims' }];

    if (adjudicationState !== ADJUDICATION_STATES.PENDING) {
      steps.push({ title: titleCase(adjudicationState), href: `/claims/${adjudicationState}` });
    }

    let component;
    if (isLoading || error) {
      component = (
        <Box paddingVertical={5}>
          <LoadingIndicator noun="claims" error={error} />
        </Box>
      );
    } else {
      const tableData = map(e => ({
        ...e,
        indicator: (encounterFlags && objectHasProp(encounterFlags, e.claimId)) && encounterFlags[e.claimId]
          ? 'flag'
          : null,
        providerName: objectHasProp(providers, e.providerId) ? providers[e.providerId].name : '',
        diagnoses: formatStringArray(getDiagnosesNames(e.diagnosisIds, diagnoses)),
        originallySubmittedAt: objectHasProp(claims, e.claimId)
          ? claims[e.claimId].originallySubmittedAt
          : null,
      }))(encounters);

      const valueFilters = { adjudicationState };

      component = (
        <ClaimsTable
          data={tableData}
          adjudicationState={adjudicationState}
          valueFilters={valueFilters}
          onClickRow={this.handleRowClick}
          total={total}
          page={page}
          onPageChange={this.handlePageChange}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={this.handleSortChange}
        />
      );
    }

    return (
      <LayoutWithHeader pageTitle="Claims" steps={steps}>
        <Box flex flexDirection="row" justifyContent="space-between" marginBottom={1}>
          <Box flex marginBottom={5}>
            <Box marginRight={3}>
              <PillLink exact to="/claims">Pending</PillLink>
            </Box>
            <Box marginRight={3}>
              <PillLink to="/claims/returned">Returned</PillLink>
            </Box>
            <Box marginRight={3}>
              <PillLink to="/claims/rejected">Rejected</PillLink>
            </Box>
            <Box marginRight={3}>
              <PillLink to="/claims/approved">Approved</PillLink>
            </Box>
            {showExternal && (
              <PillLink to="/claims/external">External</PillLink>
            )}
          </Box>
          <Box flex marginBottom={1}>
            <Box marginRight={3}>
              <Pill
                active={showFilters}
                onClick={() => this.handleFilterTabClick()}
              >
                Filters
              </Pill>
            </Box>
            <Box>
              <Pill
                active={showSearch}
                onClick={() => this.handleSearchTabClick()}
              >
                Search
              </Pill>
            </Box>
          </Box>
        </Box>
        {showFilters && (
          <>
            <Divider marginBottom={4} />
            <ClaimsFilters
              loadClaims={this.loadClaims}
              handleExportClick={this.handleExportClick}
              adjudicationState={adjudicationState}
            />
          </>
        )}
        {showSearch && (
          <>
            <Divider marginBottom={4} />
            <SearchBar
              handleSearchButtonClick={this.handleSearchButtonClick}
              placeholder="Enter Claim ID or Beneficiary ID"
            />
            {showSearchError && (
              <ErrorLabel>Please enter a valid Claim ID or Beneficiary ID.</ErrorLabel>
            )}
          </>
        )}
        <Divider marginTop={4} />
        {component}
      </LayoutWithHeader>
    );
  }
}

export default connect(
  ClaimsIndexContainer.mapStateToProps,
  ClaimsIndexContainer.mapDispatchToProps,
)(ClaimsIndexContainer);

ClaimsIndexContainer.propTypes = {
  diagnoses: PropTypes.shape({}).isRequired,
  encounters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  claims: PropTypes.shape({}).isRequired,
  encounterFlags: PropTypes.shape({}),
  filters: PropTypes.shape({}),
  clearClaimFilters: PropTypes.func.isRequired,
  searchFields: PropTypes.shape({
    searchField: PropTypes.string,
    searchQuery: PropTypes.string,
  }),
  setClaimSearch: PropTypes.func.isRequired,
  setClaimSort: PropTypes.func.isRequired,
  setShowSearch: PropTypes.func.isRequired,
  setShowFilters: PropTypes.func.isRequired,
  clearClaimSearch: PropTypes.func.isRequired,
  adjudicationState: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  providers: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  history: historyPropType.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      adjudicationState: PropTypes.string,
    }),
  }).isRequired,
  total: PropTypes.number,
  nextUrl: PropTypes.string,
  prevUrl: PropTypes.string,
  fetchClaims: PropTypes.func.isRequired,
  fetchMoreClaims: PropTypes.func.isRequired,
  fetchClaimsReport: PropTypes.func.isRequired,
  showExternal: PropTypes.bool,
  showSearch: PropTypes.bool,
  showFilters: PropTypes.bool,
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
};

ClaimsIndexContainer.defaultProps = {
  encounterFlags: {},
  filters: {},
  searchFields: {},
  showExternal: false,
  prevUrl: null,
  total: 0,
  nextUrl: null,
  showSearch: false,
  showFilters: false,
};
