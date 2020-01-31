import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Menu from 'components/menu';

import BaseLayout from './base-layout';
import LayoutContent from './layout-content';

const StyledErrorLayout = styled(BaseLayout)`
  text-align: center;
`;

const ErrorLayout = ({ children, ...props }) => (
  <StyledErrorLayout {...props}>
    <Menu isErrorMenu supportsMobile />
    <LayoutContent>
      {children}
    </LayoutContent>
  </StyledErrorLayout>
);

export default ErrorLayout;

ErrorLayout.propTypes = {
  children: PropTypes.node.isRequired,
  pageTitle: PropTypes.string.isRequired,
};
