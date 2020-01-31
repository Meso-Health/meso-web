import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { map, forEach, snakeCase } from 'lodash/fp';
import uuid from 'uuid/v4';

import { userHasAllPermissionsInSet, userHasPermissionSetFromList } from 'lib/auth-utils';
import {
  ROLES,
  ROLE_PERMISSIONS,
  SUBMISSION_STATES,
  claimsPreparationPermissions,
  claimsApprovalPermissions,
} from 'lib/config';

import { formatStringArray } from 'lib/formatters';

import Box from 'components/box';
import { TabLinks, TabLink } from 'components/tabs';
import Pill from 'components/pill';
import { LayoutWithHeader } from 'components/layouts';
import LoadingIndicator from 'components/loading-indicator';
import Button from 'components/button';
import { Link } from 'react-router-dom';
import { Text } from 'components/text';

import { historyPropType, userPropType } from 'store/prop-types';
import { fetchDiagnoses } from 'store/diagnoses/diagnoses-actions';
import { fetchOpenIdEvents } from 'store/identification-events/identification-events-actions';
import { fetchBillables } from 'store/billables/billables-actions';
import { fetchClaims, fetchClaimsByUrl } from 'store/claims/claims-actions';
import { patchEncounter as patchEncounterAction } from 'store/encounters/encounters-actions';
import { fetchProviders } from 'store/providers/providers-actions';
import { exportData as exportDataAction } from 'store/export/export-actions';
import { uploadData as uploadDataAction } from 'store/upload/upload-actions';
import { getDiagnosesNames } from 'store/diagnoses/diagnoses-selectors';
import { countUnsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';
import {
  encounterErrorSelector,
  openClaimsForPreparerSelector,
  returnedClaimsForPreparerSelector,
  pendingClaimsForFacilityHeadSelector,
} from 'store/encounters/encounters-selectors';
import { userSelector } from 'store/auth/auth-selectors';

import PendingClaimsContainer from './components/pending-claims-container';
import ReturnedClaimsContainer from './components/returned-claims-container';
import OpenClaimsContainer from './components/open-claims-container';
import SyncStatusIndicator from './components/sync-status-indicator';

const PENDING_TAB = 'prepared';
const RETURNED_TAB = 'needs_revision';
const OPEN_TAB = 'started';

const DESC_ORDER = 'desc';
const ASC_ORDER = 'asc';

class SubmissionOverviewContainer extends Component {
  static mapStateToProps = (state) => {
    const { billables, isLoadingBillables } = state.billables;
    const unsyncedClaimCount = countUnsyncedDeltasByModelType(state, 'Encounter');
    return {
      isLoadingBillables,
      isLoadingClaims: state.claims.isLoadingClaims,
      isLoadingDiagnoses: state.diagnoses.isLoadingDiagnoses,
      isLoadingIdentificationEvents: state.identificationEvents.isLoadingIdentificationEvents,
      isLoadingProviders: state.providers.isLoadingProviders,
      providers: state.providers.providers,
      unsyncedClaimCount,
      error: encounterErrorSelector(state),
      encountersById: state.encounters.encounters,
      diagnoses: state.diagnoses.diagnoses,
      user: userSelector(state),
      loadedBillablesCount: Object.keys(billables).length,
      totalClaims: state.claims.pagination.total,
      nextPageUrl: state.claims.pagination.nextUrl,
      prevPageUrl: state.claims.pagination.prevUrl,
      pendingClaimsForFacilityHead: pendingClaimsForFacilityHeadSelector(state),
      openClaimsForPreparer: openClaimsForPreparerSelector(state),
      returnedClaimsForPreparer: returnedClaimsForPreparerSelector(state),
    };
  }

  static mapDispatchToProps = dispatch => ({
    loadClaims: claimParams => dispatch(fetchClaims(claimParams)),
    loadData(claimParams) {
      dispatch(fetchClaims(claimParams));
      dispatch(fetchDiagnoses());
      dispatch(fetchBillables(claimParams.providerId));
      dispatch(fetchOpenIdEvents(claimParams.providerId));
      dispatch(fetchProviders());
    },
    patchEncounter: encounterChanges => dispatch(patchEncounterAction(encounterChanges)),
    fetchMoreClaims: url => dispatch(fetchClaimsByUrl(url)),
    exportData: () => dispatch(exportDataAction()),
    uploadData: () => dispatch(uploadDataAction()),
  });

  constructor(props) {
    super(props);

    const { user } = props;

    const currentPermissions = ROLE_PERMISSIONS[user.role];
    const canPrepareClaims = userHasAllPermissionsInSet(currentPermissions, claimsPreparationPermissions);
    const canApproveClaims = userHasAllPermissionsInSet(currentPermissions, claimsApprovalPermissions);
    const offlineUser = userHasPermissionSetFromList(
      currentPermissions,
      [[ROLES.CLAIMS_PREPARER], [ROLES.CLAIMS_OFFICER]],
    );

    const visibleTabs = [RETURNED_TAB];
    if (canApproveClaims) {
      visibleTabs.splice(0, 0, PENDING_TAB);
    }
    if (canPrepareClaims) {
      visibleTabs.splice(0, 0, OPEN_TAB);
    }

    const activeTabKey = canPrepareClaims ? OPEN_TAB : PENDING_TAB;
    const sortField = 'occurredAt';
    const hasLoadedPendingClaims = user.role !== ROLES.FACILITY_DIRECTOR;

    this.state = {
      page: 0,
      sortField,
      sortDirection: DESC_ORDER,
      activeTabKey,
      canPrepareClaims,
      offlineUser,
      visibleTabs,
      hasLoadedReturnedClaims: false,
      hasLoadedPendingClaims,
    };
  }

  componentDidMount() {
    const { loadData, uploadData } = this.props;
    uploadData();
    loadData(this.generateFetchClaimsParams());
  }

  componentDidUpdate(_, prevState) {
    const { activeTabKey: prevActiveTabKey, sortField: prevSortField, sortDirection: prevSortDirection } = prevState;
    const { activeTabKey, sortField, sortDirection } = this.state;
    const { loadClaims } = this.props;

    if (activeTabKey !== prevActiveTabKey || sortField !== prevSortField || sortDirection !== prevSortDirection) {
      loadClaims(this.generateFetchClaimsParams());
    }
  }

  handleTabLinkClick = (tabKey) => {
    let updatedState = { activeTabKey: tabKey };
    if (tabKey === RETURNED_TAB) {
      updatedState = {
        ...updatedState,
        sortField: 'updatedAt',
        hasLoadedReturnedClaims: true,
      };
    }
    if (tabKey === PENDING_TAB) {
      updatedState = {
        ...updatedState,
        sortField: 'occurredAt',
        hasLoadedPendingClaims: true,
      };
    }
    if (tabKey === OPEN_TAB) {
      updatedState = {
        ...updatedState,
        sortField: 'occurredAt',
      };
    }
    this.setState(updatedState);
  }

  handleRowClick = (route) => {
    const { history } = this.props;
    history.push(route);
  }

  handleExportClick = () => {
    const { exportData } = this.props;
    exportData();
  }

  handlePageChange = (newPage) => {
    const { nextPageUrl, prevPageUrl, fetchMoreClaims } = this.props;
    const { page } = this.state;

    if (newPage > page) {
      fetchMoreClaims(nextPageUrl);
    }

    if (newPage < page) {
      fetchMoreClaims(prevPageUrl);
    }

    this.setState({ page: newPage });
  }

  handleSortChange = (newSortField) => {
    const { sortField: currentSortField, sortDirection: currentSortDirection } = this.state;

    let newSortDirection = DESC_ORDER;
    if (currentSortField === newSortField && currentSortDirection === DESC_ORDER) {
      newSortDirection = ASC_ORDER;
    }

    this.setState({ page: 0, sortField: newSortField, sortDirection: newSortDirection });
  }

  generateFetchClaimsParams = () => {
    const { activeTabKey, sortField, sortDirection } = this.state;
    const { user } = this.props;

    if (activeTabKey === RETURNED_TAB) {
      return {
        providerId: user.providerId,
        returnedToPreparer: true,
        sort: `${sortDirection === 'desc' ? '-' : ''}${snakeCase(sortField)}`,
      };
    }
    return {
      providerId: user.providerId,
      submissionState: activeTabKey,
      sort: `${sortDirection === 'desc' ? '-' : ''}${snakeCase(sortField)}`,
    };
  }

  handleSubmit = (encounterIds) => {
    const { patchEncounter } = this.props;
    const submittedAt = moment();
    const submissionState = SUBMISSION_STATES.SUBMITTED;
    forEach(id => patchEncounter({ id, submittedAt, submissionState }))(encounterIds);
  }

  render() {
    const {
      canPrepareClaims,
      offlineUser,
      activeTabKey,
      page,
      sortDirection,
      sortField,
      visibleTabs,
      hasLoadedReturnedClaims,
      hasLoadedPendingClaims,
    } = this.state;
    const {
      openClaimsForPreparer,
      pendingClaimsForFacilityHead,
      returnedClaimsForPreparer,
      diagnoses,
      loadedBillablesCount,
      isLoadingBillables,
      isLoadingClaims,
      isLoadingDiagnoses,
      isLoadingIdentificationEvents,
      isLoadingProviders,
      providers,
      error,
      totalClaims,
      user,
      unsyncedClaimCount,
    } = this.props;
    const openClaimCount = openClaimsForPreparer.length;
    const pendingClaimCount = pendingClaimsForFacilityHead.length;
    const returnedClaimCount = returnedClaimsForPreparer.length;
    const pendingClaimsTableData = map(e => ({
      ...e,
      diagnoses: formatStringArray(getDiagnosesNames(e.diagnosisIds, diagnoses)),
    }))(pendingClaimsForFacilityHead);

    const returnedClaimsTableData = map(e => ({
      ...e,
      diagnoses: formatStringArray(getDiagnosesNames(e.diagnosisIds, diagnoses)),
    }))(returnedClaimsForPreparer);

    let component;
    if (loadedBillablesCount === 0 || Object.keys(diagnoses).length === 0 || Object.keys(providers).length === 0) {
      // TODO: add error to second LoadingIndicator
      if (isLoadingBillables || isLoadingDiagnoses || isLoadingProviders) {
        component = (<LoadingIndicator noun="billables, diagnoses, and provider info" />);
      } else {
        component = (<LoadingIndicator noun="billables, diagnoses, and provider info" />);
      }
    } else {
      if (activeTabKey === OPEN_TAB) {
        component = (
          <OpenClaimsContainer
            data={openClaimsForPreparer}
            onClickRow={this.handleRowClick}
            page={page}
            total={totalClaims}
            onPageChange={this.handlePageChange}
            onSortChange={this.handleSortChange}
            sortDirection={sortDirection}
            sortField={sortField}
            providerId={user.providerId}
          />
        );
      }
      if (activeTabKey === PENDING_TAB) {
        component = (
          <PendingClaimsContainer
            data={pendingClaimsTableData}
            onClickRow={this.handleRowClick}
            onSubmit={this.handleSubmit}
            page={page}
            total={totalClaims}
            onPageChange={this.handlePageChange}
            onSortChange={this.handleSortChange}
            sortDirection={sortDirection}
            sortField={sortField}
            providerId={user.providerId}
          />
        );
      }
      if (activeTabKey === RETURNED_TAB) {
        component = (
          <ReturnedClaimsContainer
            data={returnedClaimsTableData}
            page={page}
            total={totalClaims}
            onPageChange={this.handlePageChange}
            onSortChange={this.handleSortChange}
            sortDirection={sortDirection}
            sortField={sortField}
            onClickRow={canPrepareClaims ? this.handleRowClick : () => { }}
            providerId={user.providerId}
          />
        );
      }
    }
    const tabsData = {
      [OPEN_TAB]: { tabKey: OPEN_TAB, text: `Open (${openClaimCount})` },
      [PENDING_TAB]: { tabKey: PENDING_TAB, text: `Pending Approval (${hasLoadedPendingClaims ? pendingClaimCount : '-'})` },
      [RETURNED_TAB]: { tabKey: RETURNED_TAB, text: `Returned (${hasLoadedReturnedClaims ? returnedClaimCount : '-'})` },
    };
    const visibleTabsData = map(tab => tabsData[tab])(visibleTabs);
    const showCreateButton = canPrepareClaims
      && (activeTabKey === RETURNED_TAB || activeTabKey === OPEN_TAB);
    return (
      <LayoutWithHeader pageTitle="Submissions" steps={[{ title: 'Submission', href: '/submissions' }]}>
        <Box paddingBottom={5} flex alignItems="center" justifyContent="space-between">
          <Box flex flexDirection="row">
            <TabLinks activeTabKey={activeTabKey} onTabLinkClick={this.handleTabLinkClick}>
              {visibleTabsData.map(tab => (
                <TabLink key={tab.tabKey} tabKey={tab.tabKey}><Pill>{tab.text}</Pill></TabLink>
              ))}
            </TabLinks>
            {offlineUser && (
              <Box flex alignItems="center">
                <SyncStatusIndicator
                  isLoading={isLoadingBillables || isLoadingDiagnoses
                    || isLoadingIdentificationEvents || isLoadingClaims}
                  fetchingError={error}
                  unsyncedClaimCount={unsyncedClaimCount}
                  handleExportClick={this.handleExportClick}
                />
              </Box>
            )}
          </Box>
          {showCreateButton && (
            <Box>
              <Link to={`/submissions/${uuid()}/new`}>
                <Button primary inline>
                  <Text>Create a new claim</Text>
                </Button>
              </Link>
            </Box>
          )}
        </Box>
        {component}
      </LayoutWithHeader>
    );
  }
}

export default connect(
  SubmissionOverviewContainer.mapStateToProps,
  SubmissionOverviewContainer.mapDispatchToProps,
)(SubmissionOverviewContainer);

SubmissionOverviewContainer.propTypes = {
  user: userPropType.isRequired,
  loadData: PropTypes.func.isRequired,
  loadClaims: PropTypes.func.isRequired,
  patchEncounter: PropTypes.func.isRequired,
  fetchMoreClaims: PropTypes.func.isRequired,
  diagnoses: PropTypes.shape({}).isRequired,
  providers: PropTypes.shape({}).isRequired,
  error: PropTypes.string.isRequired,
  exportData: PropTypes.func.isRequired,
  uploadData: PropTypes.func.isRequired,
  returnedClaimsForPreparer: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  openClaimsForPreparer: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pendingClaimsForFacilityHead: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  history: historyPropType.isRequired,
  unsyncedClaimCount: PropTypes.number.isRequired,
  loadedBillablesCount: PropTypes.number.isRequired,
  totalClaims: PropTypes.number,
  nextPageUrl: PropTypes.string,
  prevPageUrl: PropTypes.string,
  isLoadingBillables: PropTypes.bool.isRequired,
  isLoadingDiagnoses: PropTypes.bool.isRequired,
  isLoadingClaims: PropTypes.bool.isRequired,
  isLoadingIdentificationEvents: PropTypes.bool.isRequired,
  isLoadingProviders: PropTypes.bool.isRequired,
};

SubmissionOverviewContainer.defaultProps = {
  nextPageUrl: null,
  prevPageUrl: null,
  totalClaims: 0,
};
