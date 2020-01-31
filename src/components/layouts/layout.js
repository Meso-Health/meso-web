import React from 'react';
import PropTypes from 'prop-types';

import Menu from 'components/menu';

import BaseLayout from './base-layout';

const Layout = ({ children, className, pageTitle, supportsMobile }) => (
  <BaseLayout pageTitle={pageTitle} className={className}>
    <Menu supportsMobile={supportsMobile} />
    {children}
  </BaseLayout>
);

export default Layout;

Layout.propTypes = {
  ...BaseLayout.propTypes,
  supportsMobile: PropTypes.bool,
};

Layout.defaultProps = {
  ...BaseLayout.defaultProps,
  supportsMobile: false,
};
