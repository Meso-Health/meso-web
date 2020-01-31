import React from 'react';
import PropTypes from 'prop-types';
import { encounterPropType } from 'store/prop-types';
import Box from 'components/box';
import Indicator from 'components/indicator';
import Icon from 'components/icon';
import { Text } from 'components/text';

const ClaimIcon = ({ claim, indicator }) => {
  const { adjudicationState, shortClaimId, revisedEncounterId, reimbursementId } = claim;

  let iconName;
  switch (adjudicationState) {
    case 'approved': {
      const paid = reimbursementId !== null;
      iconName = paid ? 'claim-row-paid' : 'claim-row-approved';
      break;
    }
    case 'rejected':
      iconName = 'claim-row-rejected';
      break;
    case 'returned':
      iconName = 'claim-row-returned';
      break;
    default:
      iconName = revisedEncounterId ? 'claim-row-resubmitted' : 'claim-row-pending';
      break;
  }

  return (
    <Box flex alignItems="center">
      <Box marginRight={3}>
        <Icon name={iconName} />
      </Box>
      <Text fontSize={3} fontFamily="sans">{shortClaimId}</Text>
      {indicator && <Indicator type={indicator} />}
    </Box>
  );
};

export default ClaimIcon;

ClaimIcon.propTypes = {
  claim: encounterPropType.isRequired,
  indicator: PropTypes.string,
};

ClaimIcon.defaultProps = {
  indicator: null,
};
