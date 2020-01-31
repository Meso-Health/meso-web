import React from 'react';
import PropTypes from 'prop-types';
import Head from 'react-helmet';

import Box from 'components/box';

const BaseLayout = ({ children, pageTitle, ...props }) => (
  <Box paddingBottom={6} {...props}>
    <Head title={pageTitle} />
    {children}
  </Box>
);

export default BaseLayout;

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  pageTitle: PropTypes.string.isRequired,
};
