import styled from '@emotion/styled';
import { css } from '@emotion/core';

const Divider = styled.div`
  border-bottom: 1px ${props => props.theme.colors.gray[3]} solid;
  margin-top: ${props => props.theme.space[props.marginTop] || props.theme.space[4]};
  margin-bottom: ${props => props.theme.space[props.marginBottom] || 0};

  ${props => props.marginHorizontal && css`
    margin-left: ${props.marginHorizontal}px;
    margin-right: ${props.marginHorizontal}px;
  `}
`;

export default Divider;
