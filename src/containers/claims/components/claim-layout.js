import React from 'react';
import PropTypes from 'prop-types';

import { startCase } from 'lodash/fp';
import { formatShortId } from 'lib/formatters';

import { claimPropType } from 'store/prop-types';

import { LayoutWithHeader } from 'components/layouts';
import LoadingIndicator from 'components/loading-indicator';

const ClaimLayout = ({ children, page, pageTitle, error, path, claim, encounterId, isLoading }) => {
  let component = <LoadingIndicator noun={page} />;

  if (!isLoading && (error || !claim)) {
    component = (<LoadingIndicator noun={page} error={`Could not find claim with the ID '${encounterId}'.`} />);
  } else if (!isLoading && claim) {
    component = children;
  }

  const shortClaimId = claim ? formatShortId(claim.id) : null;
  return (
    <LayoutWithHeader
      pageTitle={pageTitle}
      steps={[
        { title: startCase(page), href: path },
        ...(shortClaimId ? [{ title: shortClaimId, href: `${path}/${encounterId}` }] : []),
      ]}
    >
      {component}
    </LayoutWithHeader>
  );
};

export default ClaimLayout;

ClaimLayout.propTypes = {
  children: PropTypes.node,
  encounterId: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  claim: claimPropType,
};

ClaimLayout.defaultProps = {
  error: null,
  isLoading: false,
  claim: null,
  children: null,
};
