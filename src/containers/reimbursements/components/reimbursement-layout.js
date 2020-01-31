import React from 'react';
import PropTypes from 'prop-types';

import { LayoutWithHeader } from 'components/layouts';

const ReimbursementsLayout = ({ children, pageTitle, steps }) => (
  <LayoutWithHeader
    pageTitle={pageTitle}
    steps={steps}
  >
    {children}
  </LayoutWithHeader>
);

export default ReimbursementsLayout;

ReimbursementsLayout.propTypes = {
  children: PropTypes.node.isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pageTitle: PropTypes.string,
};

ReimbursementsLayout.defaultProps = {
  pageTitle: 'Reimbursements',
};
