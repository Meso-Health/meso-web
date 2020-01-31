import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isNil } from 'lodash/fp';

import { formatShortId, formatCardId, formatGender, formatProfession, formatRelationship } from 'lib/formatters';
import { formatDate } from 'lib/formatters/date';
import { MEMBERSHIP_STATUS_STATES } from 'lib/config';

import { administrativeDivisionPropType, userPropType, memberPropType, historyPropType } from 'store/prop-types';
import { fetchHouseholdMembers as fetchHouseholdMembersAction, updateMember as updateMemberAction, updateMemberPhoto as updateMemberPhotoAction } from 'store/members/members-actions';
import { fetchOpenIdEvents as fetchOpenIdEventsAction } from 'store/identification-events/identification-events-actions';
import { fetchAdministrativeDivisions as fetchAdministrativeDivisionsAction } from 'store/administrative-divisions/administrative-divisions-actions';
import { fetchEnrollmentPeriods as fetchEnrollmentPeriodsAction } from 'store/enrollment/enrollment-actions';
import { fetchMemberClaims as fetchMemberClaimsAction } from 'store/claims/claims-actions';
import { fetchProviders as fetchProviderAction } from 'store/providers/providers-actions';

import {
  memberAdministrativeDivisionSelector,
  householdByMemberIdSelector,
  memberByIdSelector,
  membershipStatusByMemberIdSelector,
  curriedMembershipStatusSelectorCreator,
} from 'store/members/members-selectors';
import { identificationEventsByIdSelector } from 'store/identification-events/identification-events-selectors';
import { userSelector } from 'store/auth/auth-selectors';
import { recentClaimsByMemberIdSelector } from 'store/encounters/encounters-selectors';
import { memberCanRenewSelector } from 'store/enrollment/enrollment-selectors';
import { currentUserProviderSelector } from 'store/providers/providers-selectors';

import { Text } from 'components/text';
import { LayoutWithHeader } from 'components/layouts';
import LoadingIndicator from 'components/loading-indicator';
import MemberDetails from 'components/member/member-details';
import MemberHouseholdDetails from 'components/member/member-household-details';
import RecentClaimsList from 'containers/claims/components/recent-claims-list';
import { BirthdateItem, MetadataItem } from 'components/list';

import CheckInModal from 'containers/check-in/member-detail/components/check-in-modal';
import OverrideModal from 'containers/check-in/member-detail/components/override-modal';
import DismissMemberModal from 'containers/check-in/member-detail/components/dismiss-member-modal';

class CheckInMemberDetailContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { match } = ownProps;
    const { id } = match.params;

    return ({
      member: memberByIdSelector(state, id),
      membershipStatus: membershipStatusByMemberIdSelector(state, id),
      memberCanRenew: memberCanRenewSelector(state, id),
      householdMembers: householdByMemberIdSelector(state, id),
      isLoading: state.members.isLoadingMembers
        || state.administrativeDivisions.isLoadingAdministrativeDivisions
        || state.identificationEvents.isLoadingIdentificationEvents
        || state.enrollment.isLoadingEnrollmentPeriods
        || state.providers.isLoadingProviders,
      isPerformingMemberAction: state.members.isPerformingMemberAction,
      membersError: state.members.membersError,
      administrativeDivision: memberAdministrativeDivisionSelector(state, id),
      identificationEvents: identificationEventsByIdSelector(state),
      user: userSelector(state),
      recentClaims: recentClaimsByMemberIdSelector(state, id),
      currentUserProvider: currentUserProviderSelector(state),
      membershipStatusSelector: curriedMembershipStatusSelectorCreator(state),
    });
  }

  static mapDispatchToProps = dispatch => ({
    fetchEnrollmentPeriods: () => dispatch(fetchEnrollmentPeriodsAction()),
    fetchProviders: () => dispatch(fetchProviderAction()),
    fetchOpenIdEvents: providerId => dispatch(fetchOpenIdEventsAction(providerId)),
    fetchAdministrativeDivisions: () => dispatch(fetchAdministrativeDivisionsAction()),
    fetchHouseholdMembers: memberId => dispatch(fetchHouseholdMembersAction({ memberId })),
    updateMember: memberChanges => dispatch(updateMemberAction(memberChanges)),
    updateMemberPhoto: (memberId, photo) => dispatch(updateMemberPhotoAction(memberId, photo)),
    fetchMemberClaims: memberId => dispatch(fetchMemberClaimsAction(memberId)),
  });

  constructor(props) {
    super(props);

    this.state = {
      checkInModalOpen: false,
      dismissModalOpen: false,
      overrideModalOpen: false,
    };
  }

  componentDidMount() {
    const {
      match,
      fetchEnrollmentPeriods,
      fetchProviders,
      fetchHouseholdMembers,
      fetchAdministrativeDivisions,
      fetchMemberClaims,
      fetchOpenIdEvents,
      user,
      member,
    } = this.props;
    fetchEnrollmentPeriods();
    fetchProviders();
    fetchHouseholdMembers(match.params.id);
    fetchAdministrativeDivisions();
    fetchMemberClaims(member.id);
    fetchOpenIdEvents(user.providerId);
  }

  componentDidUpdate(prevProps) {
    const { match, fetchHouseholdMembers } = this.props;
    if (prevProps.match.params.id !== match.params.id) {
      fetchHouseholdMembers(match.params.id);
    }
  }

  handleOverride = () => {
    this.setState({ checkInModalOpen: true });
  }

  handleCheckInButtonClick = () => {
    const { member, membershipStatus } = this.props;

    const memberStatus = member.relationshipToHead === 'SELF'
      ? membershipStatus.memberStatusEnum : membershipStatus.beneficiaryStatusEnum;
    const warnUser = memberStatus !== MEMBERSHIP_STATUS_STATES.ACTIVE;

    if (warnUser) {
      this.setState({ overrideModalOpen: true });
    } else {
      this.setState({ checkInModalOpen: true });
    }
  }

  handleDismissButtonClick = () => {
    this.setState({ dismissModalOpen: true });
  }

  handleModalCancel = () => {
    this.setState({ checkInModalOpen: false, dismissModalOpen: false, overrideModalOpen: false });
  }

  render() {
    const {
      match,
      isPerformingMemberAction,
      member,
      membershipStatus,
      memberCanRenew,
      householdMembers,
      updateMember,
      updateMemberPhoto,
      isLoading,
      membersError,
      administrativeDivision,
      identificationEvents,
      recentClaims,
      history,
      location,
      currentUserProvider,
      membershipStatusSelector,
    } = this.props;
    const { checkInModalOpen, dismissModalOpen, overrideModalOpen } = this.state;
    const { id, searchMethod } = match.params;
    const noun = 'member information';
    let component;

    const initialStep = { title: 'Check In', href: '/check-in' };
    const searchStep = { title: 'Search', href: '/check-in/search' };
    const currentStep = { title: formatShortId(id), href: `/check-in/members/${id}` };

    const steps = searchMethod ? [initialStep, searchStep, currentStep] : [initialStep, currentStep];

    if (isLoading || membersError.length > 0) {
      component = (<LoadingIndicator noun={noun} error={membersError} />);
    } else if (isNil(member) || isNil(membershipStatus)) {
      component = (
        <Text>{`Could not find member with the ID "${id}".`}</Text>
      );
    } else {
      let action;
      if (location.state) {
        const idEvent = identificationEvents[location.state.idEventId];

        action = {
          onClick: this.handleDismissButtonClick,
          buttonText: `Checked in ${formatDate(idEvent.occurredAt)}`,
        };
      } else {
        action = {
          onClick: this.handleCheckInButtonClick,
          buttonText: 'Check in',
        };
      }

      const medicalRecordNumber = member.medicalRecordNumbers
        && currentUserProvider
        && member.medicalRecordNumbers[currentUserProvider.id];

      component = (
        <>
          <MemberDetails
            member={member}
            membershipStatus={membershipStatus}
            memberCanRenew={memberCanRenew}
            isSubmitting={isPerformingMemberAction}
            updateMember={updateMember}
            updateMemberPhoto={updateMemberPhoto}
            primaryAction={action}
            editableItemNames={['medicalRecordNumber']}
          >
            <MetadataItem name="fullName" label="Full Name" value={member.fullName} />
            <MetadataItem name="administrativeDivision" label="Administrative Division" value={administrativeDivision ? administrativeDivision.name : null} />
            <MetadataItem name="membershipNumber" label="Beneficiary ID" value={member.membershipNumber} />
            <MetadataItem name="cardId" label="QR Code" value={member.cardId ? formatCardId(member.cardId) : null} />
            <MetadataItem name="gender" label="Gender" value={formatGender(member.gender)} />
            <BirthdateItem name="birthdate" member={member} />
            <MetadataItem name="relationshipToMember" label="Relationship to Member" value={formatRelationship(member.relationshipToHead)} />
            <MetadataItem name="profession" label="Profession" value={formatProfession(member.profession)} />
            <MetadataItem name="medicalRecordNumber" label="Medical Record Number" value={medicalRecordNumber} />
            <MetadataItem name="recentClaims" label="Recent Claims" value={<RecentClaimsList data={recentClaims} onClickRow={() => {}} rowsPerPage={10} />} />
          </MemberDetails>
          {householdMembers && (
            <MemberHouseholdDetails
              householdMembers={householdMembers}
              membershipStatusSelector={membershipStatusSelector}
              currentMember={member}
              linkBaseUrl="/check-in/members"
              searchMethod={searchMethod}
            />
          )}
          {checkInModalOpen && (
            <CheckInModal
              onCancel={this.handleModalCancel}
              currentMember={member}
              searchMethod={searchMethod}
              membershipNumber={member.membershipNumber}
              history={history}
            />
          )}
          {dismissModalOpen && (
            <DismissMemberModal
              onCancel={this.handleModalCancel}
              identificationEventId={location.state.idEventId}
              history={history}
            />
          )}
          {overrideModalOpen && (
            <OverrideModal
              onCancel={this.handleModalCancel}
              onOverride={this.handleOverride}
            />
          )}
        </>
      );
    }
    return (
      <LayoutWithHeader
        pageTitle="Check In"
        steps={steps}
      >
        {component}
      </LayoutWithHeader>
    );
  }
}

export default connect(
  CheckInMemberDetailContainer.mapStateToProps,
  CheckInMemberDetailContainer.mapDispatchToProps,
)(CheckInMemberDetailContainer);

CheckInMemberDetailContainer.propTypes = {
  member: memberPropType,
  membershipStatus: PropTypes.shape({
    memberStatusEnum: PropTypes.string.isRequired,
    memberStatusDate: PropTypes.string.isRequired,
    beneficiaryStatusEnum: PropTypes.string,
    beneficiaryStatusDate: PropTypes.string,
  }),
  memberCanRenew: PropTypes.bool,
  administrativeDivision: administrativeDivisionPropType,
  user: userPropType.isRequired,
  isPerformingMemberAction: PropTypes.bool.isRequired,
  fetchEnrollmentPeriods: PropTypes.func.isRequired,
  fetchProviders: PropTypes.func.isRequired,
  fetchHouseholdMembers: PropTypes.func.isRequired,
  fetchAdministrativeDivisions: PropTypes.func.isRequired,
  fetchMemberClaims: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  membersError: PropTypes.string,
  updateMember: PropTypes.func.isRequired,
  updateMemberPhoto: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      searchMethod: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      idEventId: PropTypes.string,
    }),
  }).isRequired,
  identificationEvents: PropTypes.shape({}).isRequired,
  fetchOpenIdEvents: PropTypes.func.isRequired,
  householdMembers: PropTypes.arrayOf(PropTypes.shape({})),
  recentClaims: PropTypes.arrayOf(PropTypes.shape({})),
  currentUserProvider: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  history: historyPropType.isRequired,
  membershipStatusSelector: PropTypes.func.isRequired,
};

CheckInMemberDetailContainer.defaultProps = {
  membersError: null,
  member: null,
  membershipStatus: null,
  memberCanRenew: null,
  administrativeDivision: null,
  householdMembers: [],
  recentClaims: [],
};
