import React from 'react';
import { reimbursementPropType } from 'store/prop-types';

import { formatShortId } from 'lib/formatters';

import Box from 'components/box';
import Icon from 'components/icon';
import { Text } from 'components/text';

const ReimbursementIcon = ({ reimbursement }) => {
  const iconName = reimbursement.paymentDate ? 'claim-state-approved' : 'claim-row-pending';

  return (
    <Box flex alignItems="center">
      <Box marginRight={3}>
        <Icon name={iconName} />
      </Box>
      <Text fontSize={3} fontFamily="sans">{formatShortId(reimbursement.id)}</Text>
    </Box>
  );
};

export default ReimbursementIcon;

ReimbursementIcon.propTypes = {
  reimbursement: reimbursementPropType.isRequired,
};
