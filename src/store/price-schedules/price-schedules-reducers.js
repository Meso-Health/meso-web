import { merge } from 'lodash/fp';
import { normalize } from 'normalizr';
import {
  FETCH_BILLABLES_SUCCESS,
} from 'store/billables/billables-actions';

import billableSchema from 'store/schemas/billable-schema';
import {
  CREATE_PRICE_SCHEDULE,
  STORE_PRICE_SCHEDULES,
} from './price-schedules-actions';

export const omittableFields = [
  'isLoadingPriceSchedules',
  'priceSchedulesError',
];

export const initialState = {
  isLoadingPriceSchedules: false,
  priceSchedulesError: '',
  priceSchedules: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_PRICE_SCHEDULE: {
      const newPriceSchedule = action.priceSchedule;
      const result = {
        ...state,
        priceSchedules: {
          ...state.priceSchedules,
          [newPriceSchedule.id]: newPriceSchedule,
        },
      };
      return result;
    }
    case FETCH_BILLABLES_SUCCESS: {
      const normalizedResponse = normalize(action.response, [billableSchema]);
      return {
        ...state,
        priceSchedules: merge(state.priceSchedules)(normalizedResponse.entities.priceSchedules),
      };
    }
    case STORE_PRICE_SCHEDULES: {
      return {
        ...state,
        priceSchedules: merge(state.priceSchedules)(action.payload),
      };
    }
    default:
      return state;
  }
}
