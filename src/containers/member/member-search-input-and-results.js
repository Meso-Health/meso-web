import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { values, reduce } from 'lodash/fp';

import Grid from '@material-ui/core/Grid';

import Box from 'components/box';
import { TabLinks, TabLink } from 'components/tabs';
import SearchBar from 'components/search-bar';
import { formatMembershipNumber, formatCardIdQuery, formatGender } from 'lib/formatters';
import Pill from 'components/pill';
import { SelectField } from 'components/inputs';
import AdministrativeDivisionPicker from 'components/inputs/administrative-division-picker';
import SearchResults from 'components/search-results';
import LoadingIndicator from 'components/loading-indicator';

import { fetchAdministrativeDivisions } from 'store/administrative-divisions/administrative-divisions-actions';
import { fetchProviders } from 'store/providers/providers-actions';
import {
  memberSearchResultsSelector,
  memberSearchIsLoadingSelector,
} from 'store/search-ui/search-ui-selectors';

import {
  fetchHouseholdMembers as fetchHouseholdMembersAction,
  fetchMembers as fetchMembersAction,
} from 'store/members/members-actions';
import {
  setSearchQuery as setSearchQueryAction,
  clearSearchQuery as clearSearchQueryAction,
} from 'store/search-ui/search-ui-actions';

import {
  administrativeDivisionsSelector,
} from 'store/administrative-divisions/administrative-divisions-selectors';
import SearchResultsTable from 'components/member/member-search-results-table';

import { userSelector } from 'store/auth/auth-selectors';
import { userPropType } from 'store/prop-types';

// Each key in these tab correspond to the key used in the GET request to backend.
// If we change the key, let's make sure to make sure backend can handle it.
const TABS = {
  membershipNumber: {
    key: 'membershipNumber',
    name: 'Beneficiary ID',
    queryFormatter: formatMembershipNumber,
    placeholder: 'MESO-283-292-ba71e',
    searchHint: 'Search by entering a membership number ',
  },
  cardId: {
    key: 'cardId',
    name: 'QR code',
    queryFormatter: formatCardIdQuery,
    placeholder: 'MESO 000 000',
    searchHint: 'Search by entering a QR code (eg. MESO 123 456).',
  },
  medicalRecordNumber: {
    key: 'medicalRecordNumber',
    name: 'MRN',
    queryFormatter: e => e,
    placeholder: '123456',
    searchHint: 'Search by entering a MRN (eg. 123456).',
  },
  advanced: {
    key: 'advanced',
    name: 'Advanced',
    queryFormatter: e => e,
    placeholder: 'Search',
    searchHint: 'Search by entering a full name (eg. Chase Adams).',
  },
};

class MemberSearchInputAndResults extends Component {
  static mapStateToProps = state => ({
    administrativeDivisions: administrativeDivisionsSelector(state),
    user: userSelector(state),
    isLoading: state.providers.isLoadingProviders
    || state.administrativeDivisions.isLoadingAdministrativeDivisions,
    isLoadingSearchResults: state.members.isLoadingMembers || memberSearchIsLoadingSelector(state),
    providers: state.providers.providers,
    searchResults: memberSearchResultsSelector(state),
    fetchingError: state.members.membersError || state.administrativeDivisions.administrativeDivisionsError,
  });

  static mapDispatchToProps = dispatch => ({
    fetchMembers: (adminDivision, name) => dispatch(fetchMembersAction(adminDivision, name)),
    fetchHouseholdMembers: params => dispatch(fetchHouseholdMembersAction(params)),
    setSearchQuery: query => dispatch(setSearchQueryAction({ query, search: 'memberSearch' })),
    clearSearchQuery: search => dispatch(clearSearchQueryAction(search)),
    loadData() {
      dispatch(fetchProviders());
      dispatch(fetchAdministrativeDivisions());
    },
  });

  initialState = {
    administrativeDivisionId: null,
    activeTab: TABS.membershipNumber,
    providerId: null,
  }

  constructor(props) {
    super(props);
    this.searchBarRef = React.createRef();
    this.state = this.initialState;
  }

  componentDidMount() {
    const { loadData, onSelectTab, clearSearchQuery } = this.props;
    loadData();
    // TODO: Not sure why we need to pass in the specific string, remove this and make sure it doens't break anything.
    clearSearchQuery('memberSearch');
    onSelectTab(TABS.membershipNumber.key);
  }

  handleTabLinkClick = (tabKey) => {
    const { onSelectTab, clearSearchQuery } = this.props;
    this.searchBarRef.current.handleClear();
    this.setState({
      ...this.initialState,
      activeTab: TABS[tabKey],
      query: null,
    });
    onSelectTab(TABS[tabKey]);
    clearSearchQuery('memberSearch');
  }

  handleSearchButtonClick = (searchQuery) => {
    const { activeTab, administrativeDivisionId, providerId } = this.state;
    const { fetchMembers, fetchHouseholdMembers, setSearchQuery, user } = this.props;
    const formattedQuery = activeTab.queryFormatter(searchQuery);

    if (!searchQuery || searchQuery.length <= 0) {
      return;
    }

    if (activeTab.key === TABS.advanced.key) {
      fetchMembers({
        administrativeDivisionId,
        name: formattedQuery,
      });
    } else if (activeTab.key === TABS.medicalRecordNumber.key) {
      fetchMembers({
        medicalRecordNumber: formattedQuery,
        providerId: user.providerId || providerId,
      });
    } else {
      fetchHouseholdMembers(
        {
          [activeTab.key]: formattedQuery,
          providerId: user.providerId || providerId,
        },
      );
    }

    setSearchQuery(formattedQuery);

    this.setState({ query: searchQuery });
  }

  handleProviderChange = (event) => {
    this.setState({ providerId: event.target.value });
  }

  handleAdminDivisionChange = (administrativeDivisionId) => {
    this.setState({ administrativeDivisionId });
  }

  render() {
    const { activeTab, administrativeDivisionId, providerId, query } = this.state;
    const {
      administrativeDivisions,
      user,
      isLoading,
      isLoadingSearchResults,
      providers,
      fetchingError,
      searchResults,
      handleRowClick,
      extraHintIfNoResults,
    } = this.props;

    const providerIdForMRNSearch = user.providerId || providerId;
    const disableSearchButton = (activeTab.key === TABS.medicalRecordNumber.key && !providerIdForMRNSearch);

    const providerOptions = reduce((opts, p) => [...opts, { ...p, value: p.id }], [{ name: 'All providers', value: 0 }])(providers);

    const data = searchResults.map(member => ({
      id: member.id,
      name: member.fullName,
      membershipNumber: member.membershipNumber,
      medicalRecordNumber: member.medicalRecordNumber,
      gender: formatGender(member.gender),
      cardId: member.cardId,
      age: member.age,
    }));
    if (isLoading) {
      return (
        <LoadingIndicator noun="" />
      );
    }

    return (
      <>
        <Box paddingTop={3} paddingBottom={5}>
          <TabLinks activeTabKey={activeTab.key} onTabLinkClick={this.handleTabLinkClick}>
            {values(TABS).map(tab => (
              <TabLink key={tab.key} tabKey={tab.key}><Pill>{tab.name}</Pill></TabLink>
            ))}
          </TabLinks>
        </Box>
        {activeTab.key === TABS.advanced.key && (
          <Box marginBottom={4} marginTop={3}>
            <AdministrativeDivisionPicker
              administrativeDivisions={administrativeDivisions}
              administrativeDivisionId={administrativeDivisionId}
              handleChange={this.handleAdminDivisionChange}
            />
          </Box>
        )}
        {activeTab.key === TABS.medicalRecordNumber.key && !user.providerId && (
          <Grid container>
            <Grid item xs={4}>
              <Box marginBottom={4} marginTop={3}>
                <SelectField
                  label="Provider name"
                  key="providerId"
                  name="providerId"
                  options={providerOptions}
                  value={providerId}
                  onChange={this.handleProviderChange}
                />
              </Box>
            </Grid>
          </Grid>
        )}
        <SearchBar
          ref={this.searchBarRef}
          handleSearchButtonClick={this.handleSearchButtonClick}
          placeholder={activeTab.placeholder}
          disabled={disableSearchButton}
        />
        <SearchResults
          searchHint={activeTab.searchHint}
          isLoading={isLoadingSearchResults}
          fetchingError={fetchingError}
          searchResults={searchResults}
          hasQuery={Boolean(query)}
          extraHintIfNoResults={extraHintIfNoResults}
        >
          <SearchResultsTable data={data} handleRowClick={handleRowClick} />
        </SearchResults>
      </>
    );
  }
}

export default connect(
  MemberSearchInputAndResults.mapStateToProps,
  MemberSearchInputAndResults.mapDispatchToProps,
)(MemberSearchInputAndResults);

MemberSearchInputAndResults.propTypes = {
  administrativeDivisions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchMembers: PropTypes.func.isRequired,
  fetchHouseholdMembers: PropTypes.func.isRequired,
  loadData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isLoadingSearchResults: PropTypes.bool,
  setSearchQuery: PropTypes.func.isRequired,
  user: userPropType.isRequired,
  providers: PropTypes.shape({}).isRequired,
  onSelectTab: PropTypes.func,
  fetchingError: PropTypes.string,
  handleRowClick: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.shape({})),
  clearSearchQuery: PropTypes.func.isRequired,
  extraHintIfNoResults: PropTypes.node,
};

MemberSearchInputAndResults.defaultProps = {
  isLoading: true,
  isLoadingSearchResults: false,
  onSelectTab: () => {},
  fetchingError: null,
  searchResults: [],
  extraHintIfNoResults: null,
};
