import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route as PublicRoute,
  Redirect,
  Switch,
} from 'react-router-dom';

import AuthenticatedRoute from 'components/authenticated-route';

import LogInView from 'views/login-view';
import LogOutView from 'views/logout-view';
import ClaimsView from 'views/claims-view';
import CheckInView from 'views/check-in-view';
import ClaimsSubmissionView from 'views/claims-submission-view';
import NotFoundView from 'views/not-found-view';
import ProviderReportingStatsView from 'views/provider-reporting-view';
import MemberView from 'views/member-view';
import EnrollmentView from 'views/enrollment-view';
import ReimbursementView from 'views/reimbursement-view';
import StatusView from 'views/status-view';

import {
  DEFAULT_PATHS_FOR_ROLE,
  ROUTES,
  ROLE_PERMISSIONS,
  enrollmentPermissions,
  membershipPermissions,
  claimsPreparationPermissions,
  claimsReimbursementPermissions,
  claimsAdjudicationPermissions,
  claimsApprovalPermissions,
  enrollmentStatisticsPermissions,
  claimsStatisticsPermissions,
  identificationPermissions,
  memberViewOnlyPermissions,
  claimsViewOnlyPermissions,
  reimbursementsViewOnlyPermissions,
  reimbursementPaymentPermissions,
  externalClaimsViewPermissions,
} from 'lib/config';
import { userHasAllPermissionsInSet } from 'lib/auth-utils';

import App from './app';

class ResolveRouter extends Component {
  static mapStateToProps = state => ({
    user: state.auth.user,
  })

  render() {
    const { user } = this.props;
    return (
      <Router>
        <App>
          <Switch>
            <AuthenticatedRoute
              permissionScopes={[identificationPermissions]}
              path={ROUTES.CHECK_IN.route_match}
              component={CheckInView}
            />
            <AuthenticatedRoute
              permissionScopes={[
                claimsAdjudicationPermissions,
                claimsPreparationPermissions,
                claimsViewOnlyPermissions,
                externalClaimsViewPermissions]}
              path={ROUTES.CLAIMS.route_match}
              render={props => (
                <ClaimsView
                  {...props}
                  viewOnly={!userHasAllPermissionsInSet(ROLE_PERMISSIONS[user.role], claimsAdjudicationPermissions)}
                  showExternal={userHasAllPermissionsInSet(ROLE_PERMISSIONS[user.role], externalClaimsViewPermissions)}
                />
              )}
            />
            <AuthenticatedRoute
              permissionScopes={[enrollmentStatisticsPermissions]}
              path={ROUTES.ENROLLMENT_REPORTING.route_match}
              component={EnrollmentView}
            />
            <AuthenticatedRoute
              permissionScopes={[
                memberViewOnlyPermissions,
                membershipPermissions,
                enrollmentPermissions,
              ]}
              path={ROUTES.MEMBERS.route_match}
              render={props => (
                <MemberView
                  {...props}
                  viewOnly={userHasAllPermissionsInSet(ROLE_PERMISSIONS[user.role], memberViewOnlyPermissions)}
                />
              )}
            />
            <AuthenticatedRoute
              permissionScopes={[claimsReimbursementPermissions]}
              path={ROUTES.REIMBURSEMENTS.route_match}
              render={props => (
                <ReimbursementView
                  {...props}
                  viewOnly={userHasAllPermissionsInSet(ROLE_PERMISSIONS[user.role], reimbursementsViewOnlyPermissions)}
                  canCompletePayment={
                    userHasAllPermissionsInSet(ROLE_PERMISSIONS[user.role], reimbursementPaymentPermissions)
                  }
                />
              )}
            />
            <AuthenticatedRoute
              permissionScopes={[claimsApprovalPermissions, claimsPreparationPermissions]}
              path={ROUTES.SUBMISSIONS.route_match}
              component={ClaimsSubmissionView}
            />
            <AuthenticatedRoute
              permissionScopes={[claimsStatisticsPermissions]}
              providerOnly
              supportsMobile
              path={ROUTES.SUMMARY.route_match}
              component={ProviderReportingStatsView}
            />
            <AuthenticatedRoute
              permissionScopes={[claimsPreparationPermissions]}
              path={ROUTES.STATUS.route_match}
              component={StatusView}
            />
            <PublicRoute exact path={ROUTES.LOGIN.route_match} component={LogInView} />
            <PublicRoute exact path={ROUTES.LOGOUT.route_match} component={LogOutView} />
            {user && <Redirect exact path="/" to={DEFAULT_PATHS_FOR_ROLE[user.role]} />}
            {!user && <Redirect exact path="/" to={ROUTES.LOGIN.base_url} />}
            <PublicRoute component={NotFoundView} />
          </Switch>
        </App>
      </Router>
    );
  }
}

export default connect(
  ResolveRouter.mapStateToProps,
)(ResolveRouter);

ResolveRouter.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
};

ResolveRouter.defaultProps = {
  user: null,
};
