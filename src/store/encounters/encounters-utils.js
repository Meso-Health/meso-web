import {
  sum,
} from 'lodash/fp';

export const calculateClaimPrice = encounterItemsWithBillables => (
  sum(encounterItemsWithBillables.map(ei => (ei.stockout ? 0 : ei.quantity * ei.priceSchedule.price)))
);

export const calculateStockoutTotal = encounterItemsWithBillables => (
  sum(encounterItemsWithBillables.map(ei => (ei.stockout ? ei.quantity * ei.priceSchedule.price : 0)))
);
