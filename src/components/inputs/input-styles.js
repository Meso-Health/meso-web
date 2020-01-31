import { css } from '@emotion/core';

const HEIGHT = 44;
const inputStyles = props => css`
  appearance: none;
  box-sizing: border-box;
  background: #fff;
  border: ${(props.noBorder ? 'none' : `1px ${props.theme.colors.gray[4]} solid`)};
  border-radius: 3px;
  outline: none;
  position: relative;
  height: ${HEIGHT}px;
  font-size: ${props.theme.font.size[3]};
  font-family: ${props.theme.font.family.sans};

  &:focus {
    border: ${(props.noBorder ? 'none' : `1px ${props.theme.colors.blue[4]} solid`)};
    box-shadow: ${(props.noBorder ? 'none' : `0 0 0 3px ${props.theme.colors.blue[1]}`)};
  }
`;

export default inputStyles;
