import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isNil } from 'lodash/fp';

import Box from 'components/box';
import NullValue from 'components/null-value';

const MetadataItem = ({ label, name, value, action, rightAlignedAction }) => (
  <Item key={label} name={name}>
    <Label>{label}</Label>
    <Value>
      {isNil(value) ? <NullValue /> : value}
    </Value>
    {action && <Box marginLeft={4}>{action}</Box>}
    {rightAlignedAction && <Box width="22%" marginLeft="auto" paddingLeft={4} paddingRight={4}>{rightAlignedAction}</Box>}
  </Item>
);

export default MetadataItem;

MetadataItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.node,
  label: PropTypes.string.isRequired,
  action: PropTypes.node,
  rightAlignedAction: PropTypes.node,
};

MetadataItem.defaultProps = {
  name: null,
  action: null,
  rightAlignedAction: null,
  value: null,
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
  width: 100%
`;
