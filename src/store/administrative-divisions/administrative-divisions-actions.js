import { getErrorMessage } from 'lib/utils';

export const FETCH_ADMINISTRATIVE_DIVISIONS_REQUEST = 'FETCH_ADMINISTRATIVE_DIVISIONS_REQUEST';
export const FETCH_ADMINISTRATIVE_DIVISIONS_SUCCESS = 'FETCH_ADMINISTRATIVE_DIVISIONS_SUCCESS';
export const FETCH_ADMINISTRATIVE_DIVISIONS_FAILURE = 'FETCH_ADMINISTRATIVE_DIVISIONS_FAILURE';

export const fetchAdministrativeDivisions = (opts = {}) => ({
  CALL_API: {
    beforeRequest(_, getState) {
      const storedAdministrativeDivisions = getState().administrativeDivisions.administrativeDivisions;
      const isCached = Object.keys(storedAdministrativeDivisions).length > 0;

      if (isCached && opts.force !== true) {
        return Promise.resolve(storedAdministrativeDivisions);
      }

      return undefined;
    },
    call: api => api.fetchAdministrativeDivisions(),
    transformError: err => getErrorMessage(err),
    types: [
      FETCH_ADMINISTRATIVE_DIVISIONS_REQUEST,
      FETCH_ADMINISTRATIVE_DIVISIONS_SUCCESS,
      FETCH_ADMINISTRATIVE_DIVISIONS_FAILURE,
    ],
  },
});
