import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Box from 'components/box';
import { Text } from 'components/text';

const StatWrapper = styled(Box)`
  display: grid;
  grid-template-columns: ${props => '1fr '.repeat(props.statCount).trim()};
`;

const StatColumn = styled(Box)`
  & + & {
    border-left: 1px ${props => props.theme.colors.gray[2]} solid;
  }
`;

const LargeStatsDisplay = ({ stats }) => (
  <StatWrapper statCount={stats.length}>
    {stats.map(({ value, label }) => (
      <StatColumn key={label} textAlign="center">
        <Text fontSize={5}>{value}</Text>
        <Box marginTop={2}>
          <Text fontSize={2}>{label}</Text>
        </Box>
      </StatColumn>
    ))}
  </StatWrapper>
);

LargeStatsDisplay.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node.isRequired,
    value: PropTypes.node,
  })).isRequired,
};

export default LargeStatsDisplay;
