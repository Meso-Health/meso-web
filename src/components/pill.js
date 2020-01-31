import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const Pill = styled.span`
  display: inline-block;
  border: none;
  border-radius: 3px;
  color: ${props => props.theme.colors.gray[6]};
  background-color: transparent;
  transition: background ${props => props.theme.transition.default};
  user-select: none;

  padding: ${props => `${props.theme.space[2]} ${props.theme.space[4]}`};

  font-weight: ${props => props.theme.font.weight.normal};

  &:hover, &:focus, &:active {
    color: ${props => props.theme.colors.blue[4]};
    background: ${props => props.theme.colors.blue[1]};
  }

  &:focus {
    outline: none;
  }

  ${props => props.active && css`
    &, &:hover, &:active {
      color: ${props.theme.colors.blue[6]};
      background: ${props.theme.colors.blue[1]};
    }
  `}

  ${props => props.inverse && css`
    color: ${props.theme.colors.gray[5]};
    background: transparent;

    &:hover {
      color: white;
      background-color: ${props.theme.colors.black};
    }

    ${props.active && css`
      &, &:hover, &:active {
        color: white;
        background-color: ${props.theme.colors.black};
      }
    `}
  `}
`;

Pill.propTypes = {
  active: PropTypes.bool,
  inverse: PropTypes.bool,
};

Pill.defaultProps = {
  active: false,
  inverse: false,
};

export default Pill;
