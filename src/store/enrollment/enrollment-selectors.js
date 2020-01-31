import { createSelector } from 'reselect';
import { pickBy, filter, map, some, values } from 'lodash/fp';
import moment from 'moment';
import { formatDate } from 'lib/formatters/date';

import { memberByIdSelector } from 'store/members/members-selectors';
import { administrativeDivisionsByIdSelector } from 'store/administrative-divisions/administrative-divisions-selectors';

export const enrollmentPeriodsKeyedByIdSelector = state => state.enrollment.enrollmentPeriods;

const EMPTY_VALUE = -1;

export const pastAndPresentEnrollmentPeriodsKeyedByIdSelector = (state) => {
  const currentTime = moment();
  return pickBy(period => currentTime.isAfter(moment(period.startDate)))(state.enrollment.enrollmentPeriods);
};

export const enrollmentPeriodOptionsSelector = createSelector(
  pastAndPresentEnrollmentPeriodsKeyedByIdSelector,
  administrativeDivisionsByIdSelector,
  (enrollmentPeriods, adminDivisions) => {
    const emptyValue = { value: EMPTY_VALUE, name: 'Select an enrollment period...', disabled: true };
    return [
      emptyValue,
      ...map(ep => ({
        value: ep.id,
        name: `${adminDivisions[ep.administrativeDivisionId].name} ${formatDate(ep.startDate)}`,
      }))(enrollmentPeriods),
    ];
  },
);

export const activeEnrollmentPeriodsSelector = createSelector(
  enrollmentPeriodsKeyedByIdSelector,
  (enrollmentPeriodsKeyedById) => {
    const currentTime = moment();
    return filter(enrollmentPeriod => currentTime.isBetween(
      moment(enrollmentPeriod.startDate),
      moment(enrollmentPeriod.endDate),
    ))(values(enrollmentPeriodsKeyedById));
  },
);

export const memberCanRenewSelector = createSelector(
  memberByIdSelector,
  activeEnrollmentPeriodsSelector,
  // If the member's coverageEndDate matches the coverageEndDate of any active enrollment period
  // we can assume they have enrolled. This avoids having to do a complex look-up using
  // administrative divisions.
  (member, activeEnrollmentPeriods) => {
    if (!member || !activeEnrollmentPeriods) {
      return null;
    }
    return !some(
      enrollmentPeriod => member.coverageEndDate === enrollmentPeriod.coverageEndDate,
    )(activeEnrollmentPeriods);
  },
);
