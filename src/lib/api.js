import { isNil } from 'lodash/fp';
import moment from 'moment';
import rollbar from 'lib/rollbar';
import axios, { CancelToken } from 'axios';
import session from 'lib/session';
import { apiConfig } from 'lib/config';
import { formatTimestamp, formatInternationalDate } from 'lib/formatters/date';
import { stripWhitespace } from 'lib/string-utils';
import { camelCaseObject, getFileSystemSafeName, matchesRole, snakeCaseObject, omitUndefined } from 'lib/utils';

/**
 * Constants
 */

const { BASE_URL, ALLOWED_USER_ROLES } = apiConfig;

/**
 * Default Configurations
 */

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => camelCaseObject(data),
  ],
});

/**
 * Helper functions
 */

const tokenAuth = (tokenWithExpiry = session.getTokenWithExpiry()) => ({ Authorization: `Token ${tokenWithExpiry.token}` });
const isAllowedRole = matchesRole(ALLOWED_USER_ROLES);

const downloadFile = (data, filename) => {
  const downloadLink = document.createElement('a');
  const universalBOM = '\uFEFF';
  downloadLink.href = `data:text/csv;charset=utf-8,${encodeURIComponent(universalBOM + data)}`;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

/**
 * Error handling
 */

// The API allows all users to authenticate successfully (e.g. to handle clinic app users logging in),
// so we need to perform this check for allowed roles on our side.
function checkUserRole(responseBody) {
  if (responseBody.user && responseBody.user.role && isAllowedRole(responseBody.user.role)) {
    return Promise.resolve(responseBody);
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({ response: { status: 403 } });
}

const cancelTokenSources = {};
function cancelTokenAndGenerateNewToken(apiMethodName) {
  if (cancelTokenSources[apiMethodName]) {
    cancelTokenSources[apiMethodName].cancel();
  }
  const newTokenSource = CancelToken.source();
  cancelTokenSources[apiMethodName] = newTokenSource;
  return newTokenSource.token;
}
/**
 * API functions
 */

export default {
  login(username, password) {
    if (isNil(username) || isNil(password)) {
      return Promise.reject(new TypeError('Must pass \'username\' and \'password\' to api.login()'));
    }

    const basicAuthCredentials = { username, password };
    const url = '/authentication_token';

    return axiosInstance.post(url, null, { auth: basicAuthCredentials })
      .then(response => response.data)
      .then(checkUserRole)
      .catch((error) => {
        rollbar.logApiError({ method: 'POST', url, error });
        throw error;
      });
  },

  logout(authTokenToRevoke) {
    const headers = tokenAuth(authTokenToRevoke);
    const url = '/authentication_token';
    return axiosInstance.delete(url, { headers })
      .then(() => undefined)
      .catch((error) => {
        rollbar.logApiError({ method: 'DELETE', url, error });
        throw error;
      });
  },

  fetchAdministrativeDivisions() {
    const headers = tokenAuth();

    return axiosInstance.get('/administrative_divisions', { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url: '/administrative_divisions', error });
        throw error;
      });
  },

  fetchDiagnoses() {
    const headers = tokenAuth();

    return axiosInstance.get('/diagnoses', { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url: '/diagnoses', error });
        throw error;
      });
  },

  fetchBillables(providerId) {
    const headers = tokenAuth();
    const cancelToken = cancelTokenAndGenerateNewToken('fetchBillables');
    const url = `/providers/${providerId}/billables`;
    return axiosInstance.get(url, { headers, cancelToken })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  postPriceSchedule(priceSchedule, providerId) {
    if (isNil(priceSchedule)) {
      return Promise.reject(new TypeError('Must pass \'priceSchedule\' to api.postPriceSchedule()'));
    } if (isNil(providerId)) {
      return Promise.reject(new TypeError('Must pass \'providerId\' to api.postPriceSchedule()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(priceSchedule);

    return axiosInstance.post(`providers/${providerId}/price_schedules`, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'POST', url: `/providers/${providerId}/price_schedules`, error });
        throw error;
      });
  },

  fetchMembers(memberData) {
    const headers = tokenAuth();
    const params = snakeCaseObject(memberData);

    return axiosInstance.get('/members/search', {
      headers,
      params,
    }).then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url: `/members/search with params: ${params}`, error });
        throw error;
      });
  },

  fetchHouseholdMembers(memberData) {
    const headers = tokenAuth();
    const params = snakeCaseObject(memberData);

    return axiosInstance.get('/households/search', {
      headers,
      params,
    }).then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url: `/households/search with params: ${params}`, error });
        throw error;
      });
  },

  fetchOpenIdentificationEvents(providerId) {
    const headers = tokenAuth();
    const cancelToken = cancelTokenAndGenerateNewToken('fetchOpenIdentificationEvents');
    const url = `/providers/${providerId}/identification_events/open`;
    return axiosInstance.get(url, { headers, cancelToken })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  postIdentificationEvent(identificationEvent, providerId) {
    if (isNil(identificationEvent)) {
      return Promise.reject(new TypeError('Must pass \'identification event\' object to api.postIdentificationEvent()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(identificationEvent);
    const url = `/providers/${providerId}/identification_events`;
    return axiosInstance.post(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'POST', url, data, error });
        throw error;
      });
  },

  patchIdentificationEvent(identificationEvent) {
    if (isNil(identificationEvent) || isNil(identificationEvent.id)) {
      return Promise.reject(new TypeError('Must pass object with identification event changes and ID to api.patchIdentificationEvent()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(identificationEvent);
    const url = `identification_events/${identificationEvent.id}`;
    return axiosInstance.patch(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'PATCH', url, data, error });
        throw error;
      });
  },

  fetchEncounters() {
    const headers = tokenAuth();

    const cancelToken = cancelTokenAndGenerateNewToken('fetchEncounters');
    const url = '/encounters';
    return axiosInstance.get(url, { headers, cancelToken })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  postEncounter(encounter, providerId) {
    if (isNil(encounter)) {
      return Promise.reject(new TypeError('Must pass \'encounter\' object to api.postEncounter()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(encounter);
    const url = `/providers/${providerId}/encounters`;

    return axiosInstance.post(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'POST', url, data, error });
        throw error;
      });
  },

  patchEncounter(encounter) {
    if (isNil(encounter)) {
      return Promise.reject(new TypeError('Must pass \'encounter\' object to api.updateEncounter()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(encounter);
    const url = `/encounters/${encounter.id}`;
    return axiosInstance.patch(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'PATCH', url, data, error });
        throw error;
      });
  },

  fetchEnrollmentRecords() {
    const headers = tokenAuth();
    const url = '/enrollment_records';
    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  fetchEnrollmentPeriods() {
    const headers = tokenAuth();
    const url = '/enrollment_periods';
    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  fetchEnrollmentReportingStats(filters) {
    const headers = tokenAuth();
    const url = '/enrollment_reporting_stats';
    return axiosInstance.get(url, {
      headers,
      params: snakeCaseObject(omitUndefined(filters)),
    }).then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  fetchReimbursementReportCSV(reimbursementId) {
    const headers = tokenAuth();

    // TODO: Make this code less hacky.
    const method = 'GET';
    const url = `reimbursement_reporting/${reimbursementId}/csv`;
    return axios({
      method,
      baseURL: BASE_URL,
      url,
      headers,
    }).then((response) => {
      const filename = `reimbursement_${reimbursementId}.csv`;
      downloadFile(response.data, filename);
    }).catch((error) => {
      rollbar.logApiError({ method, url, error });
      throw error;
    });
  },

  fetchProviders() {
    const headers = tokenAuth();
    const url = '/providers';
    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  updateMemberCardId(memberId, cardId) {
    if (isNil(memberId) || isNil(cardId)) {
      return Promise.reject(new TypeError('Must pass \'memberId\' and \'cardId\' to api.updateMemberCardId()'));
    }

    // The backend API is a bit picky about what it accepts so we need to transform the
    // card ID to avoid a set of "invalid card ID" errors.
    const transformedCardId = stripWhitespace(cardId).toUpperCase();
    const headers = tokenAuth();
    const data = { card_id: transformedCardId };
    const url = `/members/${memberId}`;
    return axiosInstance.patch(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'PATCH', url, data, error });
        throw error;
      });
  },

  postMember(member) {
    if (isNil(member)) {
      return Promise.reject(new TypeError('Must pass \'member\' object to api.postMember()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(member);

    return axiosInstance.post('/members', data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'POST', url: '/members', data, error });
        throw error;
      });
  },

  updateMember(memberChanges) {
    if (isNil(memberChanges) || isNil(memberChanges.id)) {
      return Promise.reject(new TypeError('Must pass object with member changes and member ID to api.updateMember()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(memberChanges);
    const url = `/members/${memberChanges.id}`;
    return axiosInstance.patch(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'PATCH', url, data, error });
        throw error;
      });
  },

  updateMemberPhoto(memberId, photo) {
    const headers = {
      ...tokenAuth(),
      'content-type': 'multipart/form-data',
    };
    const data = new FormData();
    data.append('photo', photo);
    const url = `/members/${memberId}`;
    return axiosInstance.patch(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'PATCH', url, data, error });
        throw error;
      });
  },

  fetchReimbursements(providerId) {
    const headers = tokenAuth();

    const params = snakeCaseObject({ providerId });
    const url = '/reimbursements';
    return axiosInstance.get(url, { headers, params })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, params, error });
        throw error;
      });
  },

  fetchReimbursementClaims(reimbursementId) {
    const headers = tokenAuth();
    const url = `/reimbursements/${reimbursementId}/claims`;
    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  fetchReimbursableClaimsMetaData(providerId, endDate, reimbursementId = null) {
    const headers = tokenAuth();
    const formattedDate = formatInternationalDate(endDate);
    const url = `reimbursements/reimbursable_claims_metadata?provider_id=${providerId}&reimbursement_id=${reimbursementId}&end_date=${formattedDate}`;

    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  createReimbursement(reimbursement, providerId) {
    if (isNil(reimbursement)) {
      return Promise.reject(new TypeError('Must pass \'reimbursement\' to api.createReimbursement()'));
    } if (isNil(providerId)) {
      return Promise.reject(new TypeError('Must pass \'providerId\' to api.createReimbursement()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(reimbursement);
    const url = `/providers/${providerId}/reimbursements`;
    return axiosInstance.post(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'POST', url, data, error });
        throw error;
      });
  },

  updateReimbursement(reimbursement) {
    if (isNil(reimbursement)) {
      return Promise.reject(new TypeError('Must pass reimbursement to api.updateReimbursement()'));
    }

    const headers = tokenAuth();
    const data = snakeCaseObject(reimbursement);
    const url = `/reimbursements/${reimbursement.id}`;
    return axiosInstance.patch(url, data, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'PATCH', url, data, error });
        throw error;
      });
  },

  fetchProviderReportingStats(providerId, startDate, endDate) {
    const headers = tokenAuth();

    const params = snakeCaseObject({ startDate, endDate });
    const url = `/provider_reporting_stats/${providerId}`;
    return axiosInstance.get(url, { headers, params })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, params, error });
        throw error;
      });
  },

  fetchReimbursementStats(providerId) {
    const headers = tokenAuth();
    const url = `/reimbursements/stats?provider_id=${providerId || ''}`;
    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  // fetch initial page of claims using params constructed by the client
  fetchClaims(queryParams) {
    const headers = tokenAuth();
    const params = snakeCaseObject(queryParams);
    const url = '/claims';
    const cancelToken = cancelTokenAndGenerateNewToken('fetchClaims');
    return axiosInstance.get(url, { headers, params, cancelToken })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, params, error });
        throw error;
      });
  },

  // fetch subsequent pages of claims using a url provided by the server
  fetchClaimsByUrl(url) {
    const headers = tokenAuth();

    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  fetchClaimsReportCSV(queryParams) {
    const headers = tokenAuth();
    const params = snakeCaseObject(queryParams);
    const method = 'GET';
    const url = 'claims.csv';
    return axios({
      method,
      baseURL: BASE_URL,
      url,
      responseType: 'stream',
      headers,
      params,
    }).then((response) => {
      const filename = `claims_report_${getFileSystemSafeName(formatTimestamp(moment()))}.csv`;
      downloadFile(response.data, filename);
    }).catch((error) => {
      rollbar.logApiError({ method, url, params, error });
      throw error;
    });
  },

  fetchClaim(id) {
    const headers = tokenAuth();
    const url = `/claims/${id}`;
    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },

  fetchMemberClaims(id) {
    const headers = tokenAuth();
    const url = `/members/${id}/claims`;
    return axiosInstance.get(url, { headers })
      .then(response => response.data)
      .catch((error) => {
        rollbar.logApiError({ method: 'GET', url, error });
        throw error;
      });
  },
};
