import { getErrorMessage } from 'lib/utils';

export const FETCH_REIMBURSEMENT_REPORT_REQUEST = 'FETCH_REIMBURSEMENT_REPORT_REQUEST';
export const FETCH_REIMBURSEMENT_REPORT_SUCCESS = 'FETCH_REIMBURSEMENT_REPORT_SUCCESS';
export const FETCH_REIMBURSEMENT_REPORT_FAILURE = 'FETCH_REIMBURSEMENT_REPORT_FAILURE';

export const fetchReimbursementReport = reimbursementId => ({
  CALL_API: {
    call: api => api.fetchReimbursementReportCSV(reimbursementId),
    transformError: err => getErrorMessage(err),
    types: [
      FETCH_REIMBURSEMENT_REPORT_REQUEST,
      FETCH_REIMBURSEMENT_REPORT_SUCCESS,
      FETCH_REIMBURSEMENT_REPORT_FAILURE,
    ],
  },
});

export const FETCH_CLAIMS_REPORT_REQUEST = 'FETCH_CLAIMS_REPORT_REQUEST';
export const FETCH_CLAIMS_REPORT_SUCCESS = 'FETCH_CLAIMS_REPORT_SUCCESS';
export const FETCH_CLAIMS_REPORT_FAILURE = 'FETCH_CLAIMS_REPORT_FAILURE';

export const fetchClaimsReport = params => ({
  CALL_API: {
    call: api => api.fetchClaimsReportCSV(params),
    transformError: err => getErrorMessage(err),
    types: [
      FETCH_CLAIMS_REPORT_REQUEST,
      FETCH_CLAIMS_REPORT_SUCCESS,
      FETCH_CLAIMS_REPORT_FAILURE,
    ],
  },
});
