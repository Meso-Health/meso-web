import React from 'react';
import styled from '@emotion/styled';

const StyledNullValue = styled.span`
  color: ${props => props.theme.colors.gray[4]};
  user-select: none;
`;

const NullValue = () => (
  <StyledNullValue>&mdash;</StyledNullValue>
);

export default NullValue;
