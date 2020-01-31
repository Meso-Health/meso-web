import { merge } from 'lodash/fp';

import { getErrorMessage } from 'lib/utils';
import { normalize } from 'normalizr';
import billableSchema from 'store/schemas/billable-schema';

import { STORE_PRICE_SCHEDULES } from 'store/price-schedules/price-schedules-actions';

export const FETCH_BILLABLES_REQUEST = 'FETCH_BILLABLES_REQUEST';
export const FETCH_BILLABLES_SUCCESS = 'FETCH_BILLABLES_SUCCESS';
export const FETCH_BILLABLES_FAILURE = 'FETCH_BILLABLES_FAILURE';
export const FETCH_BILLABLES_CANCEL = 'FETCH_BILLABLES_CANCEL';
export const STORE_BILLABLES = 'STORE_BILLABLES';

export const fetchBillables = providerId => ({
  CALL_API: {
    call: api => api.fetchBillables(providerId),
    transformError: err => getErrorMessage(err),
    afterResponse: (response, dispatch, getState) => {
      const state = getState();
      const normalizedResponse = normalize(response, [billableSchema]);
      const clientBillableById = state.billables.billables;
      const { billables: serverBillablesKeyedById, priceSchedules: serverPriceSchedules } = normalizedResponse.entities;

      const serverBillableIds = Object.keys(serverBillablesKeyedById);
      const clientBillableIds = Object.values(clientBillableById).filter(b => b.active).map(b => b.id);
      // This line below is the equivalent of taking a difference between two arrays.
      // Specifically, serverRemovedBillablesIds are the billables that exist on the client but are no longer returned by backend.
      const serverRemovedBillablesIds = clientBillableIds.filter(billableId => (
        !serverBillableIds.includes(billableId)
      ));

      // Step 1: Upsert all the billables from server.
      const updatedBillables = merge(clientBillableById)(serverBillablesKeyedById);
      // Step 2: Mark as inactive if in serverRemovedBillablesIds
      serverRemovedBillablesIds.forEach((billableId) => {
        if (billableId in updatedBillables) {
          updatedBillables[billableId] = {
            ...updatedBillables[billableId],
            active: false,
          };
        }
      });

      dispatch({ type: STORE_PRICE_SCHEDULES, payload: serverPriceSchedules });
      dispatch({ type: STORE_BILLABLES, payload: updatedBillables });
    },
    types: [
      FETCH_BILLABLES_REQUEST,
      FETCH_BILLABLES_SUCCESS,
      FETCH_BILLABLES_FAILURE,
      FETCH_BILLABLES_CANCEL,
    ],
  },
});
