import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import UnderlinedAnchor from './underlined-anchor';

/**
 * NOTE: The `UnderlinedLink` component wraps React Router's `Link` for internal
 * navigation.
 */

function UnderlinedLink({ newTab, ...props }) {
  return (
    <StyledUnderlinedLink target={newTab ? '_blank' : null} {...props} />
  );
}

const StyledUnderlinedLink = UnderlinedAnchor.withComponent(Link);

export default UnderlinedLink;

UnderlinedLink.propTypes = {
  newTab: PropTypes.bool,
};

UnderlinedLink.defaultProps = {
  newTab: false,
};
