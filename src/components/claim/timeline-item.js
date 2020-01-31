import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Box from 'components/box';
import NullValue from 'components/null-value';

const TimelineItem = ({ date, value, action, rightAlignedAction }) => (
  <Item>
    <Label>{date || <NullValue />}</Label>
    <Value>
      {value}
    </Value>
    {action && <Box marginLeft={4}>{action}</Box>}
    {rightAlignedAction && <Box width="22%" marginLeft="auto" paddingLeft={4} paddingRight={4}>{rightAlignedAction}</Box>}
  </Item>
);

export default TimelineItem;

TimelineItem.propTypes = {
  value: PropTypes.node.isRequired,
  date: PropTypes.string,
  action: PropTypes.node,
  rightAlignedAction: PropTypes.node,
};

TimelineItem.defaultProps = {
  date: null,
  action: null,
  rightAlignedAction: null,
};

const Item = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: ${props => props.theme.space[4]};
  padding-bottom: ${props => props.theme.space[4]};

  &:not(:first-of-type) {
    border-top: 1px #f2f2f2 solid;
  }
`;

const Label = styled.dt`
  color: ${props => props.theme.colors.gray[6]};
  padding-right: ${props => props.theme.space[4]};
  min-width: 170px;
  text-align: right;
`;

const Value = styled.dd`
`;
