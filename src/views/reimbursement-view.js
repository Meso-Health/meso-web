import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import ReimbursementsOverviewContainer from 'containers/reimbursements/reimbursements-overview-container';
import ReimbursementsIndexContainer from 'containers/reimbursements/reimbursements-index-container';
import ReimbursementsProviderDetailContainer from 'containers/reimbursements/reimbursements-provider-detail-container';
import ReimbursementsDetailContainer from 'containers/reimbursements/reimbursements-detail-container';

const ReimbursementView = ({ match, viewOnly, canCompletePayment }) => {
  const steps = [{ title: 'Reimbursements', href: '/reimbursements' }];
  const { route } = match.params;
  switch (route) {
    case 'created':
      steps.push({ title: 'Created', href: '/reimbursements/created' });
      break;
    default:
      break;
  }
  return (
    <>
      <Switch>
        <Route
          exact
          path="/reimbursements"
          render={props => (<ReimbursementsOverviewContainer {...props} steps={steps} />)}
        />
        <Route
          exact
          path="/reimbursements/created"
          render={props => (<ReimbursementsIndexContainer {...props} steps={steps} />)}
        />
        <Route
          path="/reimbursements/overview/:providerId"
          render={props => <ReimbursementsProviderDetailContainer {...props} steps={steps} viewOnly={viewOnly} />}
        />
        <Route
          path="/reimbursements/created/:reimbursementId"
          render={props => (
            <ReimbursementsDetailContainer
              {...props}
              steps={steps}
              viewOnly={viewOnly}
              canCompletePayment={canCompletePayment}
            />
          )}
        />
      </Switch>
    </>
  );
};

export default ReimbursementView;

ReimbursementView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      route: PropTypes.string,
    }),
  }).isRequired,
  viewOnly: PropTypes.bool,
  canCompletePayment: PropTypes.bool,
};

ReimbursementView.defaultProps = {
  viewOnly: false,
  canCompletePayment: false,
};
