import React from 'react';
import PropTypes from 'prop-types';

import { Link, Route } from 'react-router-dom';
import Pill from 'components/pill';

const PillLink = ({ to, inverse, exact, children, ...rest }) => (
  <Link to={to} {...rest}>
    <Route path={to} exact={exact}>
      {({ match }) => (
        <Pill inverse={inverse} active={Boolean(match)}>
          {children}
        </Pill>
      )}
    </Route>
  </Link>
);

export default PillLink;

PillLink.propTypes = {
  to: PropTypes.string.isRequired,
  inverse: PropTypes.bool,
  exact: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

PillLink.defaultProps = {
  inverse: false,
  exact: false,
};
