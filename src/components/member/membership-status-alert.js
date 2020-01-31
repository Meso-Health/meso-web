import React from 'react';
import PropTypes from 'prop-types';

import { MessageAlert } from 'components/alerts';

const MembershipStatusAlert = ({ encounter }) => {
  let alert = null;
  if (encounter.memberInactiveAtTimeOfService) {
    alert = {
      type: 'error',
      title: 'Inactive',
      description: 'Member was not active on the date of service for this claim. Please use discretion when proceeding with this claim.',
    };
  }
  if (encounter.memberUnconfirmed) {
    alert = {
      type: 'info',
      title: 'Unknown',
      description: 'Membership status unknown due to manual check-in. Please use discretion when proceeding.',
    };
  }
  if (alert === null) {
    return null;
  }
  return (
    <MessageAlert
      type={alert.type}
      title={alert.title}
      description={alert.description}
    />
  );
};

export default MembershipStatusAlert;

MembershipStatusAlert.propTypes = {
  encounter: PropTypes.shape({}),
};

MembershipStatusAlert.defaultProps = {
  encounter: {},
};
