import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSelector } from 'store/auth/auth-selectors';
import { isNil } from 'lodash/fp';

import { showRoute } from 'lib/auth-utils';
import { ROLE_PERMISSIONS } from 'lib/config';
import NotFoundView from 'views/not-found-view';
import { userPropType } from 'store/prop-types';

class AuthenticatedRoute extends Component {
  static mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: userSelector(state),
  });

  render() {
    const {
      isAuthenticated,
      user,
      permissionScopes,
      path,
      ...props
    } = this.props;

    if (!isAuthenticated || !user) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: { nextPathname: props.location.pathname },
        }}
        />
      );
    }

    const isProviderUser = !isNil(user.providerId);
    const currentPermissions = ROLE_PERMISSIONS[user.role];
    if (permissionScopes && !showRoute(currentPermissions, path, isProviderUser)) {
      return <Route component={NotFoundView} />;
    }
    return <Route path={path} {...props} />;
  }
}

export default connect(
  AuthenticatedRoute.mapStateToProps,
)(AuthenticatedRoute);

AuthenticatedRoute.propTypes = {
  permissionScopes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  user: userPropType,
  isAuthenticated: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
};

AuthenticatedRoute.defaultProps = {
  permissionScopes: null,
  user: null,
};
