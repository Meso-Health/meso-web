import { createSelector } from 'reselect';
import { filter, findIndex, flow, includes, isEmpty, values } from 'lodash/fp';
import moment from 'moment';

import { objectHasProp } from 'lib/utils';
import { MEMBERSHIP_STATUS_STATES } from 'lib/config';
import { administrativeDivisionsByIdSelector, viewableAdminDivisionIdsSelector } from 'store/administrative-divisions/administrative-divisions-selectors';

export const membersKeyedByIdSelector = state => state.members.members;

export const memberByIdSelector = createSelector(
  (_, memberId) => memberId,
  membersKeyedByIdSelector,
  (memberId, members) => ((members && objectHasProp(members, memberId))
    ? members[memberId]
    : null));

export const viewableMembersSelector = createSelector(
  membersKeyedByIdSelector,
  viewableAdminDivisionIdsSelector,
  (membersKeyedById, viewableDivisions) => filter(
    member => includes(member.administrativeDivisionId)(viewableDivisions),
  )(membersKeyedById),
);

export const getMemberIndexById = id => findIndex(member => member.id === id);

// this takes in the memberId and returns a list of members in the associated household
export const householdByMemberIdSelector = createSelector(
  memberByIdSelector,
  membersKeyedByIdSelector,
  (currentMember, members) => (currentMember
    ? flow(
      filter(m => (m.householdId === currentMember.householdId && m.id !== currentMember.id)),
      filter(m => (m.householdId !== null)))(values(members))
    : []),
);

export const memberAdministrativeDivisionSelector = createSelector(
  memberByIdSelector,
  administrativeDivisionsByIdSelector,
  (member, adminDivisionsById) => {
    if (!member || !adminDivisionsById) {
      return null;
    }
    const adminDivisionId = member.administrativeDivisionId;
    if (!adminDivisionId || !objectHasProp(adminDivisionsById, adminDivisionId)) {
      return null;
    }

    return adminDivisionsById[adminDivisionId];
  },
);

export const curriedMemberAdministrativeDivisionSelectorCreator = state => (memberId) => {
  memberAdministrativeDivisionSelector(state, memberId);
};

const enrollmentPeriodsSelector = state => state.enrollment.enrollmentPeriods;

export const membershipStatusByMemberIdSelector = createSelector(
  memberByIdSelector,
  enrollmentPeriodsSelector,
  (member, enrollmentPeriodsById) => {
    if (!member || isEmpty(enrollmentPeriodsById)) {
      return null;
    }
    const {
      archivedAt,
      archivedReason,
      householdId,
      relationshipToHead,
      householdCoverageEndDate,
      memberCoverageEndDate,
      renewedAt,
    } = member;

    const membershipStatus = {
      memberStatusEnum: null,
      memberStatusDate: null,
      beneficiaryStatusEnum: null,
      beneficiaryStatusDate: null,
    };

    // no enrollment information, so status is unknown
    if (householdId === null) {
      membershipStatus.memberStatusEnum = MEMBERSHIP_STATUS_STATES.UNKNOWN;
      return membershipStatus;
    }

    const withinCoveragePeriod = moment().diff(householdCoverageEndDate, 'days') <= 0;
    const lastRenewedAt = renewedAt;
    const isHeadOfHousehold = relationshipToHead === 'SELF';
    if (withinCoveragePeriod) {
      membershipStatus.memberStatusEnum = MEMBERSHIP_STATUS_STATES.ACTIVE;
      membershipStatus.memberStatusDate = lastRenewedAt;
    } else {
      membershipStatus.memberStatusEnum = MEMBERSHIP_STATUS_STATES.EXPIRED;
      membershipStatus.memberStatusDate = lastRenewedAt;
    }

    if (isHeadOfHousehold && archivedReason) {
      membershipStatus.memberStatusEnum = MEMBERSHIP_STATUS_STATES.DELETED;
      membershipStatus.memberStatusDate = archivedAt;
      return membershipStatus;
    }

    const memberWithinCoveragePeriod = moment().diff(memberCoverageEndDate, 'days') <= 0;
    if (!isHeadOfHousehold) {
      if (memberWithinCoveragePeriod) {
        membershipStatus.beneficiaryStatusEnum = membershipStatus.memberStatusEnum;
        membershipStatus.beneficiaryStatusDate = membershipStatus.memberStatusDate;
      } else if (archivedReason && archivedReason !== 'UNPAID') {
        membershipStatus.beneficiaryStatusEnum = MEMBERSHIP_STATUS_STATES.DELETED;
        membershipStatus.beneficiaryStatusDate = archivedAt;
      } else {
        membershipStatus.beneficiaryStatusEnum = MEMBERSHIP_STATUS_STATES.EXPIRED;
        // we can't computer when the individual beneficiary last renewed so leave the date blank
      }
    }

    return membershipStatus;
  },
);

export const curriedMembershipStatusSelectorCreator = state => (
  memberId => membershipStatusByMemberIdSelector(state, memberId)
);
