import React from 'react';
import PropTypes from 'prop-types';

import approvedIconLarge from 'assets/images/claim-icon-large-approved.svg';
import rejectedIconLarge from 'assets/images/claim-icon-large-rejected.svg';
import returnedIconLarge from 'assets/images/claim-icon-large-returned.svg';
import paidIconLarge from 'assets/images/claim-icon-large-paid.svg';
import resubmittedIconLarge from 'assets/images/claim-icon-large-resubmitted.svg';
import pendingIconLarge from 'assets/images/claim-icon-large-pending.svg';

const LargeClaimIcon = ({ adjudicationState, isEdited, reimbursementId }) => {
  let claimIconUrl;
  switch (adjudicationState) {
    case 'approved': {
      const paid = reimbursementId !== null;
      claimIconUrl = paid ? paidIconLarge : approvedIconLarge;
      break;
    }
    case 'rejected':
      claimIconUrl = rejectedIconLarge;
      break;
    case 'returned':
      claimIconUrl = returnedIconLarge;
      break;
    default:
      claimIconUrl = isEdited ? resubmittedIconLarge : pendingIconLarge;
      break;
  }

  return <img src={claimIconUrl} alt={adjudicationState} />;
};

export default LargeClaimIcon;

LargeClaimIcon.propTypes = {
  adjudicationState: PropTypes.string,
  isEdited: PropTypes.bool,
  reimbursementId: PropTypes.string,
};

LargeClaimIcon.defaultProps = {
  adjudicationState: null,
  isEdited: false,
  reimbursementId: null,
};
