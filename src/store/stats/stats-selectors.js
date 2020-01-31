import { createSelector } from 'reselect';
import {
  map, flatten, groupBy, reduce,
} from 'lodash/fp';
import { ACCOUNTING_CATEGORIES } from 'lib/config';
import { objectHasProp } from 'lib/utils';
import { priceSchedulesKeyedByIdSelector } from 'store/price-schedules/price-schedules-selectors';
import { billablesByIdSelector } from 'store/billables/billables-selectors';
import { encountersForReimbursementSelector } from 'store/reimbursements/reimbursements-selectors';

// eslint-disable-next-line import/prefer-default-export
export const accountingStatsForReimbursementSelector = createSelector(
  encountersForReimbursementSelector,
  priceSchedulesKeyedByIdSelector,
  billablesByIdSelector,
  (encounters, priceSchedulesById, billablesById) => {
    const claimPriceQuantityGroup = map((encounter) => {
      const { encounterItems } = encounter;
      return map((encounterItem) => {
        const priceSchedule = priceSchedulesById[encounterItem.priceScheduleId];
        const billable = billablesById[priceSchedule.billableId];
        return ({
          accountingGroup: billable.accountingGroup,
          id: encounter.id,
          stockout: encounterItem.stockout,
          quantity: encounterItem.quantity,
          price: priceSchedule.price,
          reimbursalAmount: encounter.reimbursalAmount,
        });
      })(encounterItems);
    })(encounters);
    const priceQuantityByGroup = groupBy('accountingGroup', flatten(claimPriceQuantityGroup));
    const priceQuantityByClaim = groupBy('id', flatten(claimPriceQuantityGroup));

    return Object.entries(ACCOUNTING_CATEGORIES).map(([groupKey, groupVal]) => {
      let total = 0;
      let stockoutTotal = 0;
      let reimbursedTotal = 0;
      if (objectHasProp(priceQuantityByGroup, groupKey)) {
        ({ total, stockoutTotal, reimbursedTotal } = reduce((acc, item) => {
          const newTotal = acc.total + (item.price * item.quantity);
          const newReimbursedTotal = acc.total + (item.reimbursalAmount);
          let newStockoutTotal = acc.stockoutTotal;
          if (item.stockout) {
            newStockoutTotal += (item.price * item.quantity);
          }
          return ({ stockoutTotal: newStockoutTotal, total: newTotal, reimbursedTotal: newReimbursedTotal });
        }, { stockoutTotal: 0, total: 0, reimbursedTotal: 0 })(priceQuantityByGroup[groupKey]));
      }

      const count = reduce((acc, claim) => {
        for (let i = 0; i < claim.length; i += 1) {
          if (claim[i].accountingGroup === groupKey && !claim[i].stockout) {
            // We are counting how many claims that have this accounting category
            // so after we find a price quantity with this category we are done.
            const newAcc = acc + 1;
            return newAcc;
          }
        }
        return acc;
      }, 0)(priceQuantityByClaim);

      return { total, stockoutTotal, reimbursedTotal, count, category: groupVal };
    });
  },
);
