import { keyBy, merge } from 'lodash/fp';
import { getErrorMessage } from 'lib/utils';

export const FETCH_DIAGNOSES_REQUEST = 'FETCH_DIAGNOSES_REQUEST';
export const FETCH_DIAGNOSES_SUCCESS = 'FETCH_DIAGNOSES_SUCCESS';
export const FETCH_DIAGNOSES_FAILURE = 'FETCH_DIAGNOSES_FAILURE';
export const STORE_DIAGNOSES = 'STORE_DIAGNOSES';

export const fetchDiagnoses = () => ({
  CALL_API: {
    call: api => api.fetchDiagnoses(),
    transformError: err => getErrorMessage(err),
    afterResponse: (response, dispatch, getState) => {
      const state = getState();
      const clientDiagnosesKeyedById = state.diagnoses.diagnoses;
      const serverDiagnoses = response;
      const serverDiagnosesIds = serverDiagnoses.map(d => d.id);
      const clientDiagnosesIds = Object.values(clientDiagnosesKeyedById).filter(d => d.active).map(d => d.id);
      // This line below is the equivalent of taking a difference between two arrays.
      // Specifically, serverRemovedDiagnosesIds are the diagnoses that exist on the client but are no longer returned by backend.
      const serverRemovedDiagnosesIds = clientDiagnosesIds.filter(diagnosisId => (
        !serverDiagnosesIds.includes(diagnosisId)
      ));

      // Step 1: Upsert all the diagnoses from server.
      const updatedDiagnoses = merge(clientDiagnosesKeyedById)(keyBy('id', serverDiagnoses));
      // Step 2: Mark as inactive if in serverRemovedDiagnosesIds
      serverRemovedDiagnosesIds.forEach((diagnosisId) => {
        if (diagnosisId in updatedDiagnoses) {
          updatedDiagnoses[diagnosisId] = {
            ...updatedDiagnoses[diagnosisId],
            active: false,
          };
        }
      });

      dispatch({ type: STORE_DIAGNOSES, payload: updatedDiagnoses });
    },
    types: [FETCH_DIAGNOSES_REQUEST, FETCH_DIAGNOSES_SUCCESS, FETCH_DIAGNOSES_FAILURE],
  },
});
