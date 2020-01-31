import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from 'lib/formatters/date';

import Box from 'components/box';
import Icon from 'components/icon';
import { Text } from 'components/text';

const AdjudicationStatus = ({ adjudicationState, adjudicatorName, adjudicatedAt }) => (
  <Box
    border="1px #f2f2f2 solid"
    borderRadius="3px"
    paddingVertical={4}
    paddingHorizontal={4}
    marginBottom={4}
  >
    <Box flex alignItems="center">
      <Box marginRight={4}>
        {adjudicationState === 'approved' && <Icon name="claim-state-approved" />}
        {adjudicationState === 'rejected' && <Icon name="claim-state-rejected" />}
        {adjudicationState === 'returned' && <Icon name="claim-state-returned" />}
      </Box>
      <Text fontWeight="medium">{adjudicatorName}</Text>
      &nbsp;
      {`marked the claim as ${adjudicationState} on ${formatDate(adjudicatedAt)}`}
    </Box>
  </Box>
);

export default AdjudicationStatus;

AdjudicationStatus.propTypes = {
  adjudicationState: PropTypes.string.isRequired,
  adjudicatorName: PropTypes.string.isRequired,
  adjudicatedAt: PropTypes.string.isRequired,
};
