import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { filter } from 'lodash/fp';
import styled from '@emotion/styled';

import { SEARCH_METHODS, MEMBERSHIP_STATUS_STATES } from 'lib/config';
import { formatGender, formatPhotoUrl } from 'lib/formatters';

import Box from 'components/box';
import DetailSection from 'components/detail-section';
import { Text } from 'components/text';
import DotDivider from 'components/dividers/dot-divider';
import Indicator from 'components/indicator';

import MemberPhoto from './member-photo';

const MemberHouseholdDetails = (
  { linkBaseUrl, householdMembers, currentMember, searchMethod, membershipStatusSelector },
) => {
  const householdWithoutMember = filter(m => m !== currentMember)(householdMembers);
  const searchMethodUrlParam = SEARCH_METHODS[searchMethod] || '';
  return (
    <DetailSection
      title={`Covered under this membership (${householdWithoutMember.length})`}
      titleProps={{ fontSize: 3 }}
    >
      {householdWithoutMember.map(member => (
        <HouseholdMemberContainer key={member.id}>
          <Link to={`${linkBaseUrl}/${member.id}/${searchMethodUrlParam}`}>
            <Box flex alignItems="center" marginBottom={3}>
              <Box marginRight={4}>
                <MemberPhoto src={formatPhotoUrl(member.photoUrl)} name={member.fullName} small />
              </Box>
              <Box paddingTop={1}>
                <Box flex alignItems="center">
                  <Text>{member.fullName}</Text>
                  {membershipStatusSelector(member.id).beneficiaryStatusEnum === MEMBERSHIP_STATUS_STATES.EXPIRED && (
                    <Box marginLeft={2}><Indicator type="inactive" /></Box>
                  )}
                </Box>
                <Text color="gray.6" fontSize={2}>
                  <span>{formatGender(member.gender)}</span>
                  <DotDivider />
                  <span>{member.age}</span>
                </Text>
              </Box>
            </Box>
          </Link>
        </HouseholdMemberContainer>
      ))}
    </DetailSection>
  );
};

export default MemberHouseholdDetails;

MemberHouseholdDetails.propTypes = {
  currentMember: PropTypes.shape({}).isRequired,
  householdMembers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  linkBaseUrl: PropTypes.string.isRequired,
  searchMethod: PropTypes.string,
  membershipStatusSelector: PropTypes.func.isRequired,
};

MemberHouseholdDetails.defaultProps = {
  searchMethod: null,
};

const HouseholdMemberContainer = styled.div`
  &:hover {
    opacity: 0.6;
  }
   ${props => props.active && `
    opacity: 0.6;
  `}
`;
