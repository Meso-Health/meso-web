import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { formatDate } from 'lib/formatters/date';

import Box from 'components/box';

const StatusDate = ({ date }) => {
  const status = date ? 'complete' : 'incomplete';
  const displayDate = formatDate(date) || 'pending';

  return (
    <Box flex>
      <Status isComplete={Boolean(date)}>{status}</Status>
      <Date>
        {`Date: ${displayDate}`}
      </Date>
    </Box>
  );
};

const Status = styled.div`
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size[1]};
  text-transform: uppercase;
  color: ${props => (props.isComplete ? props.theme.colors.green[3] : props.theme.colors.yellow[8])};
  border: 2px ${props => (props.isComplete ? props.theme.colors.green[3] : props.theme.colors.yellow[8])} solid;
  border-radius: 3px;
  padding: 4px 8px;
`;

const Date = styled.div`
  color: ${props => props.theme.colors.gray[6]};
  font-size: ${props => props.theme.font.size[1]};
  padding: 4px 8px;
`;

StatusDate.propTypes = {
  date: PropTypes.string,
};

StatusDate.defaultProps = {
  date: null,
};

export default StatusDate;
