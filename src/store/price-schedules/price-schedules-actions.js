import { createDelta } from 'store/deltas/deltas-actions';
import uuid from 'uuid/v4';

export const CREATE_PRICE_SCHEDULE = 'CREATE_PRICE_SCHEDULE';
export const STORE_PRICE_SCHEDULES = 'STORE_PRICE_SCHEDULES';

export const createPriceSchedule = priceSchedule => ({
  type: CREATE_PRICE_SCHEDULE,
  priceSchedule,
});

export const createPriceSchedulesWithDeltas = newPriceSchedules => (
  (dispatch) => {
    newPriceSchedules.forEach((priceSchedule) => {
      dispatch(createPriceSchedule(priceSchedule));
      const delta = {
        id: uuid(),
        modelId: priceSchedule.id,
        modelType: 'PriceSchedule',
        action: 'POST',
        synced: false,
      };
      dispatch(createDelta(delta));
    });
  }
);
