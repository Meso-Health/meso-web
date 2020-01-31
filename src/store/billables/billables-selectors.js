import { createSelector } from 'reselect';
import { flow, filter, map, mapValues, groupBy, orderBy } from 'lodash/fp';
import { priceSchedulesKeyedByIdSelector } from 'store/price-schedules/price-schedules-selectors';

export const billablesByIdSelector = state => state.billables.billables;

const getLatestIssueAtPriceSchedule = (priceSchedules) => {
  if (!priceSchedules || priceSchedules.length <= 0) {
    return null;
  }
  return priceSchedules.reduce((a, b) => (a > b ? a : b));
};

export const billablesWithPriceSchedulesByIdSelector = createSelector(
  priceSchedulesKeyedByIdSelector,
  billablesByIdSelector,
  (priceSchedules, billables) => {
    // groupBy will give us a list of price schedules from that billableId
    // so we need to select the most recent by issuedAt
    const priceScheduleByBillableId = groupBy('billableId', priceSchedules);

    return mapValues(billable => ({
      billable,
      activePriceSchedule: getLatestIssueAtPriceSchedule(priceScheduleByBillableId[billable.id]),
    }))(billables);
  },
);

export const activeBillablesByCategorySelector = state => flow(
  filter(b => b.active),
  map(b => ({ ...b, value: b.id })),
  orderBy(['name', 'unit', 'composition'], ['asc', 'asc', 'asc']),
  groupBy('type'),
)(state.billables.billables);
