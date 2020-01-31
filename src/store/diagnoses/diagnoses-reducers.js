import { merge } from 'lodash/fp';
import moment from 'moment';
import {
  FETCH_DIAGNOSES_FAILURE,
  FETCH_DIAGNOSES_REQUEST,
  FETCH_DIAGNOSES_SUCCESS,
  STORE_DIAGNOSES,
} from './diagnoses-actions';

export const omittableFields = [
  'isLoadingDiagnoses',
  'diagnosesError',
];

export const initialState = {
  isLoadingDiagnoses: false,
  diagnosesError: '',
  diagnoses: {},
  lastSuccessfulFetch: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DIAGNOSES_REQUEST:
      return {
        ...state,
        isLoadingDiagnoses: true,
        diagnosesError: '',
      };
    case FETCH_DIAGNOSES_SUCCESS: {
      return {
        ...state,
        diagnosesError: '',
        lastSuccessfulFetch: moment().format(),
      };
    }
    case FETCH_DIAGNOSES_FAILURE:
      return {
        ...state,
        isLoadingDiagnoses: false,
        diagnosesError: action.errorMessage,
      };
    case STORE_DIAGNOSES: {
      return {
        lastSuccessfulFetch: state.lastSuccessfulFetch,
        diagnosesError: '',
        isLoadingDiagnoses: false,
        diagnoses: merge(state.diagnoses)(action.payload),
      };
    }
    default:
      return state;
  }
}
