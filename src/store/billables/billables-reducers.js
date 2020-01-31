import { merge } from 'lodash/fp';
import moment from 'moment';

import {
  FETCH_BILLABLES_FAILURE,
  FETCH_BILLABLES_REQUEST,
  FETCH_BILLABLES_SUCCESS,
  STORE_BILLABLES,
} from './billables-actions';

export const omittableFields = [
  'isLoadingBillables',
  'billablesError',
];

export const initialState = {
  isLoadingBillables: false,
  billablesError: '',
  billables: {},
  lastSuccessfulFetch: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_BILLABLES_REQUEST:
      return {
        ...state,
        isLoadingBillables: true,
        billablesError: '',
      };
    case FETCH_BILLABLES_SUCCESS: {
      return {
        ...state,
        billablesError: '',
        lastSuccessfulFetch: moment().format(),
      };
    }
    case FETCH_BILLABLES_FAILURE:
      return {
        ...state,
        isLoadingBillables: false,
        billablesError: action.errorMessage,
      };
    case STORE_BILLABLES:
      return {
        ...state,
        isLoadingBillables: false,
        billables: merge(state.billables)(action.payload),
      };

    default:
      return state;
  }
}
