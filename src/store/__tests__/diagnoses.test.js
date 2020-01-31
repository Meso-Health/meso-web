import { keyBy } from 'lodash/fp';

import reducer, { initialState } from 'store/diagnoses/diagnoses-reducers';
import {
  FETCH_DIAGNOSES_REQUEST,
  FETCH_DIAGNOSES_SUCCESS,
  FETCH_DIAGNOSES_FAILURE,
  STORE_DIAGNOSES,
} from 'store/diagnoses/diagnoses-actions';
import { getDiagnosesNames } from 'store/diagnoses/diagnoses-selectors';
import moment from 'moment';

describe('diagnoses', () => {
  const diagnoses = {
    1: { id: 1, description: 'Malaria' },
    2: { id: 2, description: 'Cataracts' },
  };

  describe('getDiagnosesNames', () => {
    const diagnosisById = keyBy('id', diagnoses);

    it('returns 2 diagnoses names', () => {
      expect(getDiagnosesNames([1, 2], diagnosisById)).toEqual(['Malaria', 'Cataracts']);
    });

    it('returns 1 diagnoses names', () => {
      expect(getDiagnosesNames([1], diagnosisById)).toEqual(['Malaria']);
    });

    it('returns empty list', () => {
      expect(getDiagnosesNames([], diagnosisById)).toEqual([]);
    });
  });

  describe('reducer', () => {
    it('returns the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('handles FETCH_DIAGNOSES_REQUEST', () => {
      const action = { type: FETCH_DIAGNOSES_REQUEST };

      const expected = {
        isLoadingDiagnoses: true,
        diagnosesError: '',
        diagnoses: {},
        lastSuccessfulFetch: null,
      };

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_DIAGNOSES_SUCCESS', () => {
      const action = { type: FETCH_DIAGNOSES_SUCCESS };

      const expected = expect.objectContaining({
        diagnosesError: '',
        lastSuccessfulFetch: moment().format(),
      });

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles FETCH_DIAGNOSES_FAILURE', () => {
      const action = { type: FETCH_DIAGNOSES_FAILURE, errorMessage: 'Error message' };

      const expected = {
        isLoadingDiagnoses: false,
        diagnosesError: 'Error message',
        diagnoses: {},
        lastSuccessfulFetch: null,
      };

      expect(reducer(undefined, action)).toEqual(expected);
    });

    it('handles STORE_DIAGNOSES', () => {
      const action = { type: STORE_DIAGNOSES, payload: diagnoses };

      const expected = {
        isLoadingDiagnoses: false,
        diagnosesError: '',
        diagnoses: {
          1: { id: 1, description: 'Malaria' },
          2: { id: 2, description: 'Cataracts' },
        },
        lastSuccessfulFetch: null,
      };

      expect(reducer(undefined, action)).toEqual(expected);
    });
  });
});
