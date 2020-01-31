import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { claimsPreparationPermissions } from 'lib/config';
import AuthenticatedRoute from 'components/authenticated-route';
import SubmissionOverviewContainer from 'containers/submissions/overview/submissions-overview-container';
import SubmissionFormContainer from 'containers/submissions/claim-submission-form/claim-submission-form-container';
import ClaimReviewContainer from 'containers/submissions/claim-review/claim-review-container';

const ClaimsSubmissionView = () => {
  const steps = [{ title: 'Submission', href: '/submissions' }];

  return (
    <>
      <Switch>
        <Route
          path="/submissions/:id/new"
          render={props => (<SubmissionFormContainer {...props} steps={steps} manualSubmission />)}
        />
        <AuthenticatedRoute
          permissionScopes={[claimsPreparationPermissions]}
          path="/submissions/:id/edit"
          render={props => (<SubmissionFormContainer {...props} steps={steps} />)}
        />
        <Route
          path="/submissions/:id"
          render={props => (<ClaimReviewContainer {...props} steps={steps} />)}
        />
        <Route
          path="/submissions"
          exact
          render={props => (<SubmissionOverviewContainer {...props} steps={steps} />)}
        />
      </Switch>
    </>
  );
};

export default ClaimsSubmissionView;

ClaimsSubmissionView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
