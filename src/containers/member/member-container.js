import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isNil } from 'lodash/fp';

import { formatGender, formatRelationship, formatProfession } from 'lib/formatters';
import { userHasPermissionSetFromList } from 'lib/auth-utils';
import {
  ROLE_PERMISSIONS,
  claimsAdjudicationPermissions,
  claimsApprovalPermissions,
  claimsPreparationPermissions,
  claimsViewOnlyPermissions,
  externalClaimsViewPermissions,
} from 'lib/config';

import { memberPropType, userPropType, historyPropType } from 'store/prop-types';
import { fetchHouseholdMembers, updateMember as updateMemberAction, updateMemberPhoto as updateMemberPhotoAction } from 'store/members/members-actions';
import { fetchEnrollmentPeriods } from 'store/enrollment/enrollment-actions';
import { fetchMemberClaims } from 'store/claims/claims-actions';
import {
  householdByMemberIdSelector,
  memberByIdSelector,
  membershipStatusByMemberIdSelector,
  curriedMembershipStatusSelectorCreator,
} from 'store/members/members-selectors';
import { recentClaimsByMemberIdSelector } from 'store/encounters/encounters-selectors';
import { userSelector } from 'store/auth/auth-selectors';
import { memberCanRenewSelector } from 'store/enrollment/enrollment-selectors';

import { Text } from 'components/text';
import { LayoutWithHeader } from 'components/layouts';
import LoadingIndicator from 'components/loading-indicator';
import MemberDetails from 'components/member/member-details';
import MemberHouseholdDetails from 'components/member/member-household-details';
import { BirthdateItem, MetadataItem } from 'components/list';
import RecentClaimsList from 'containers/claims/components/recent-claims-list';

class MemberContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { match } = ownProps;
    const { id } = match.params;

    return ({
      user: userSelector(state),
      member: memberByIdSelector(state, id),
      membershipStatus: membershipStatusByMemberIdSelector(state, id),
      memberCanRenew: memberCanRenewSelector(state, id),
      householdMembers: householdByMemberIdSelector(state, id),
      isLoading: state.members.isLoadingMembers || state.enrollment.isLoadingEnrollmentPeriods,
      isPerformingMemberAction: state.members.isPerformingMemberAction,
      membersError: state.members.membersError,
      recentClaims: recentClaimsByMemberIdSelector(state, id),
      membershipStatusSelector: curriedMembershipStatusSelectorCreator(state),
    });
  }

  static mapDispatchToProps = dispatch => ({
    loadData(memberId) {
      dispatch(fetchEnrollmentPeriods());
      dispatch(fetchMemberClaims(memberId));
      dispatch(fetchHouseholdMembers({ memberId }));
    },
    updateMember: memberChanges => dispatch(updateMemberAction(memberChanges)),
    updateMemberPhoto: (memberId, photo) => dispatch(updateMemberPhotoAction(memberId, photo)),
  });

  componentDidMount() {
    const { match, loadData } = this.props;
    loadData(match.params.id);
  }

  componentDidUpdate(prevProps) {
    const { match, loadData } = this.props;
    if (prevProps.match.params.id !== match.params.id) {
      loadData(match.params.id);
    }
  }

  handleClaimClick = (route) => {
    const { history } = this.props;
    history.push(route);
  }

  render() {
    const {
      member,
      membershipStatus,
      memberCanRenew,
      householdMembers,
      isLoading,
      membersError,
      match,
      isPerformingMemberAction,
      updateMember,
      updateMemberPhoto,
      viewOnly,
      recentClaims,
      user,
      membershipStatusSelector,
    } = this.props;
    const { id } = match.params;
    const noun = 'member information';
    let component;
    const initialStep = { title: 'Members', href: '/members' };
    let step = { title: id, href: `/members/${id}` };

    if (isLoading) {
      component = (<LoadingIndicator noun={noun} />);
    }

    if (membersError.length > 0) {
      component = (<LoadingIndicator noun={noun} error={membersError} />);
    }

    if (isNil(member) || isNil(membershipStatus)) {
      component = (
        <Text>{`Could not find member with the ID "${id}".`}</Text>
      );
    } else {
      step = { title: member.fullName, href: `/members/${id}` };

      const permissions = [
        claimsAdjudicationPermissions,
        claimsPreparationPermissions,
        claimsViewOnlyPermissions,
        claimsApprovalPermissions,
        externalClaimsViewPermissions,
      ];

      const onClickRow = userHasPermissionSetFromList(ROLE_PERMISSIONS[user.role], permissions)
        ? this.handleClaimClick
        : () => {};

      component = (
        <>
          <MemberDetails
            member={member}
            membershipStatus={membershipStatus}
            memberCanRenew={memberCanRenew}
            isSubmitting={isPerformingMemberAction}
            updateMemberPhoto={viewOnly ? null : updateMemberPhoto}
            updateMember={updateMember}
            editableItemNames={viewOnly ? [] : ['fullName', 'gender', 'profession', 'phoneNumber']}
          >
            <MetadataItem name="fullName" label="Full Name" value={member.fullName} />
            <MetadataItem name="membershipNumber" label="Beneficiary ID" value={member.membershipNumber} />
            <MetadataItem name="gender" label="Gender" value={formatGender(member.gender)} />
            <BirthdateItem name="birthdate" member={member} />
            <MetadataItem name="relationshipToMember" label="Relationship to Member" value={formatRelationship(member.relationshipToHead)} />
            <MetadataItem name="profession" label="Profession" value={formatProfession(member.profession)} />
            <MetadataItem name="phoneNumber" label="Phone Number" value={member.phoneNumber} />
            <MetadataItem
              name="recentClaims"
              label="Recent Claims"
              value={<RecentClaimsList data={recentClaims} onClickRow={onClickRow} rowsPerPage={10} />}
            />
          </MemberDetails>
          {householdMembers && (
            <MemberHouseholdDetails
              householdMembers={householdMembers}
              membershipStatusSelector={membershipStatusSelector}
              currentMember={member}
              linkBaseUrl="/members"
            />
          )}
        </>
      );
    }

    return (
      <LayoutWithHeader
        pageTitle="Member"
        steps={[initialStep, step]}
      >
        {component}
      </LayoutWithHeader>

    );
  }
}

export default connect(
  MemberContainer.mapStateToProps,
  MemberContainer.mapDispatchToProps,
)(MemberContainer);

MemberContainer.propTypes = {
  member: memberPropType,
  user: userPropType.isRequired,
  membershipStatus: PropTypes.shape({
    memberStatusEnum: PropTypes.string.isRequired,
    memberStatusDate: PropTypes.string.isRequired,
    beneficiaryStatusEnum: PropTypes.string,
    beneficiaryStatusDate: PropTypes.string,
  }),
  memberCanRenew: PropTypes.bool,
  householdMembers: PropTypes.arrayOf(PropTypes.shape({})),
  isLoading: PropTypes.bool,
  isPerformingMemberAction: PropTypes.bool.isRequired,
  membersError: PropTypes.string,
  loadData: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
  updateMemberPhoto: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  viewOnly: PropTypes.bool,
  recentClaims: PropTypes.arrayOf(PropTypes.shape({})),
  history: historyPropType.isRequired,
  membershipStatusSelector: PropTypes.func.isRequired,
};

MemberContainer.defaultProps = {
  membersError: null,
  member: null,
  membershipStatus: null,
  memberCanRenew: null,
  isLoading: true,
  householdMembers: [],
  viewOnly: false,
  recentClaims: [],
};
