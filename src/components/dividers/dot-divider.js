import styled from '@emotion/styled';

const DotDivider = styled.span`
  margin-left: ${props => props.theme.space[2]};
  margin-right: ${props => props.theme.space[2]};
  position: relative;
  top: -1px;
  display: inline-block;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: currentColor;
  vertical-align: middle;
`;

export default DotDivider;
