import { combineReducers } from 'redux';

import administrativeDivisions from 'store/administrative-divisions/administrative-divisions-reducers';
import auth from 'store/auth/auth-reducers';
import billables from 'store/billables/billables-reducers';
import diagnoses from 'store/diagnoses/diagnoses-reducers';
import encounters from 'store/encounters/encounters-reducers';
import enrollment from 'store/enrollment/enrollment-reducers';
import members from 'store/members/members-reducers';
import providers from 'store/providers/providers-reducers';
import enrollmentReportingStats from 'store/enrollment-reporting-stats/enrollment-reporting-stats-reducers';
import providerReportingStats from 'store/provider-reporting-stats/provider-reporting-stats-reducers';
import priceSchedules from 'store/price-schedules/price-schedules-reducers';
import reimbursements from 'store/reimbursements/reimbursements-reducers';
import searchUi from 'store/search-ui/search-ui-reducers';
import identificationEvents from 'store/identification-events/identification-events-reducers';
import deltas from 'store/deltas/deltas-reducers';
import toasts from 'store/toasts/toasts-reducers';
import claims from 'store/claims/claims-reducers';
import claimsUi from 'store/claims-ui/claims-ui-reducers';

const combinedReducers = combineReducers({
  administrativeDivisions,
  auth,
  billables,
  claims,
  claimsUi,
  deltas,
  diagnoses,
  encounters,
  enrollment,
  enrollmentReportingStats,
  providerReportingStats,
  identificationEvents,
  members,
  priceSchedules,
  providers,
  reimbursements,
  searchUi,
  toasts,
});


const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STATE') {
    const clearedState = {
      administrativeDivisions: undefined,
      auth: { ...state.auth },
      billables: undefined,
      claims: undefined,
      deltas: undefined,
      diagnoses: undefined,
      encounters: undefined,
      enrollment: undefined,
      enrollmentReportingStats: undefined,
      providerReportingStats: undefined,
      identificationEvents: undefined,
      priceSchedules: undefined,
      members: undefined,
      providers: undefined,
      reimbursements: undefined,
      searchUi: undefined,
      toasts: undefined,
    };
    return combinedReducers(clearedState, action);
  }

  return combinedReducers(state, action);
};

export default rootReducer;
