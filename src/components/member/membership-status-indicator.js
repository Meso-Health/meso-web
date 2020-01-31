import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { formatDate } from 'lib/formatters/date';
import { MEMBERSHIP_STATUS_STATES } from 'lib/config';

const Alert = styled.div`
  color: ${props => props.theme.colors.red[6]};
`;

const MembershipStatusIndicator = ({ statusEnum, statusDate }) => {
  let statusString;
  switch (statusEnum) {
    case (MEMBERSHIP_STATUS_STATES.ACTIVE):
      statusString = `Active (last renewed ${formatDate(statusDate)})`;
      break;
    case (MEMBERSHIP_STATUS_STATES.EXPIRED):
      if (statusDate) {
        statusString = `Expired (last renewed ${formatDate(statusDate)})`;
      } else {
        statusString = 'Expired';
      }
      break;
    case (MEMBERSHIP_STATUS_STATES.DELETED):
      statusString = `Deleted (${formatDate(statusDate)})`;
      break;
    case (MEMBERSHIP_STATUS_STATES.UNKNOWN):
      statusString = 'Unknown';
      break;
    default:
      statusString = 'Unknown';
      break;
  }

  if (statusEnum === MEMBERSHIP_STATUS_STATES.ACTIVE) {
    return <div>{statusString}</div>;
  }

  return (
    <Alert>{statusString}</Alert>
  );
};

export default MembershipStatusIndicator;

MembershipStatusIndicator.propTypes = {
  statusEnum: PropTypes.string.isRequired,
  statusDate: PropTypes.string.isRequired,
};
