import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import ClaimsIndexContainer from 'containers/claims/claims-index-container';
import ClaimDetailContainer from 'containers/claims/claim-detail-container';
import AuthenticatedRoute from 'components/authenticated-route';

import {
  externalClaimsViewPermissions,
} from 'lib/config';

const ClaimsView = ({ viewOnly, showExternal }) => (
  <Switch>
    <Route
      exact
      path="/claims/:adjudicationState(approved|returned|rejected)?"
      render={props => (<ClaimsIndexContainer {...props} showExternal={showExternal} />)}
    />
    <AuthenticatedRoute
      exact
      permissionScopes={[externalClaimsViewPermissions]}
      path="/claims/:adjudicationState(external)?"
      render={props => (<ClaimsIndexContainer {...props} showExternal={showExternal} />)}
    />
    <Route
      path="/claims/:id"
      render={props => (<ClaimDetailContainer {...props} viewOnly={viewOnly} />)}
    />
  </Switch>
);

export default ClaimsView;

ClaimsView.propTypes = {
  viewOnly: PropTypes.bool,
  showExternal: PropTypes.bool,
};

ClaimsView.defaultProps = {
  viewOnly: false,
  showExternal: false,
};
