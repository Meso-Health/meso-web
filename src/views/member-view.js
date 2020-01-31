import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import MemberContainer from 'containers/member/member-container';
import MemberSearchContainer from 'containers/member/member-search-container';

const MemberView = ({ viewOnly }) => (
  <>
    <Switch>
      <Route
        exact
        path="/members/:id"
        render={props => (<MemberContainer {...props} viewOnly={viewOnly} />)}
      />
      <Route
        exact
        path="/members/"
        render={props => (<MemberSearchContainer {...props} />)}
      />
    </Switch>
  </>
);

export default MemberView;

MemberView.propTypes = {
  viewOnly: PropTypes.bool,
};

MemberView.defaultProps = {
  viewOnly: false,
};
