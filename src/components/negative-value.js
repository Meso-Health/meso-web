import React from 'react';
import styled from '@emotion/styled';

const StyledNegativeValue = styled.span`
  color: ${props => props.theme.colors[props.color][9]};
  user-select: none;
  line-height: 1em;
  padding: ${props => props.theme.space[props.padding]} 0;
  padding-right: ${props => props.theme.space[1]};
`;

const NegativeValue = props => (
  <StyledNegativeValue {...props}>&ndash;</StyledNegativeValue>
);

export default NegativeValue;
