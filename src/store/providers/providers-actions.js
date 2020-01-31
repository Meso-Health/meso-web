import { getErrorMessage } from 'lib/utils';

export const FETCH_PROVIDERS_REQUEST = 'FETCH_PROVIDERS_REQUEST';
export const FETCH_PROVIDERS_SUCCESS = 'FETCH_PROVIDERS_SUCCESS';
export const FETCH_PROVIDERS_FAILURE = 'FETCH_PROVIDERS_FAILURE';

export const fetchProviders = () => ({
  CALL_API: {
    call: api => api.fetchProviders(),
    transformError: err => getErrorMessage(err),
    types: [FETCH_PROVIDERS_REQUEST, FETCH_PROVIDERS_SUCCESS, FETCH_PROVIDERS_FAILURE],
  },
});
