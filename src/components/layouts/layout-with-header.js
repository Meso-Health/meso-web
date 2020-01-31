import React from 'react';
import PropTypes from 'prop-types';
import Container from 'components/container';
import Header from 'components/header';

import Layout from './layout';
import LayoutContent from './layout-content';

const LayoutWithHeader = ({ children, steps, ...props }) => (
  <Layout {...props}>
    <Header steps={steps} />
    <LayoutContent>
      <Container>
        {children}
      </Container>
    </LayoutContent>
  </Layout>
);

export default LayoutWithHeader;

LayoutWithHeader.propTypes = {
  children: PropTypes.node.isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({})),
};

LayoutWithHeader.defaultProps = {
  steps: null,
};
