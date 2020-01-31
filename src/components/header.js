import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Box from 'components/box';
import Breadcrumb from 'components/breadcrumb';

/**
 * Component
 */

const Header = ({ children, steps, ...props }) => (
  <HeaderContainer padding={4} flex alignItems="center" justifyContent="space-between" {...props}>
    {steps && (
      <Breadcrumb steps={steps} />
    )}
    {children}
  </HeaderContainer>
);

Header.propTypes = {
  children: PropTypes.node,
  steps: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    href: PropTypes.string,
  })),
  supportsMobile: PropTypes.bool,
};

Header.defaultProps = {
  children: null,
  supportsMobile: false,
  steps: null,
};

/**
 * Styles
 */

const HeaderContainer = styled(Box)`
  background: ${props => props.theme.colors.gray[0]};
  min-width: ${props => (props.supportsMobile === true ? 'none' : props.theme.layout.minMenuWidth)};
  height: ${props => props.theme.layout.menuHeight}px;
`;

/**
 * Exports
 */

export default Header;
