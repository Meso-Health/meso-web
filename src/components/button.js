import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

/**
 * Component
 */

const Button = styled.button`
  background: transparent;
  border: 1px ${props => props.theme.colors.gray[4]} solid;
  border-radius: 3px;
  appearance: none;

  position: relative;
  padding-left: ${props => props.theme.space[5]};
  padding-right: ${props => props.theme.space[5]};
  height: 44px;
  min-width: 80px;

  color: ${props => props.theme.colors.gray[9]};
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size[3]};
  line-height: 43px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;

  transition: ${props => `color ${props.theme.transition.default}, background ${props.theme.transition.default}, border ${props.theme.transition.default}`};

  &:focus {
    outline: none;
  }

  &:hover {
    border-color: ${props => props.theme.colors.gray[6]};
  }

  &:active {
    color: ${props => props.theme.colors.blue[7]};
    border-color: ${props => props.theme.colors.blue[5]};
  }

  &[disabled] {
    color: ${props => props.theme.colors.gray[6]};
    border-color: ${props => props.theme.colors.gray[2]};
    cursor: default;
    pointer-events: none;
  }

  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;

  ${props => props.inline && css`
    display: inline-flex;
    width: auto;
  `}

  ${props => props.small && css`
    height: 34px;
    padding-left: 12px;
    padding-right: 12px;
    font-size: ${props.theme.font.size[3]};
    line-height: 32px;
  `}

  ${props => props.icon && css`
    border: none;
    height: 24px;
    padding-left: 6px;
    padding-right: 6px;
    min-width: 24px;
    &:hover {
      color: ${props.theme.colors.gray[5]};
      border: none;
    }
  `}

  ${props => props.primary && css`
    color: white;
    border: none;
    background: ${props.theme.colors.blue[5]};
    font-weight: ${props.theme.font.weight.medium};

    &:hover {
      color: white;
      border: none;
      background: ${props.theme.colors.blue[4]};
    }

    &[disabled] {
      color: ${props.theme.colors.gray[1]};
      background: ${props.theme.colors.gray[5]};
    }
  `}

  ${props => props.primaryRed && css`
    color: white;
    border: none;
    background: ${props.theme.colors.red[7]};

    &:hover {
      color: white;
      border: none;
      background: ${props.theme.colors.red[6]};
    }

    &:active {
      color: ${props.theme.colors.red[9]};
    }
  `}

  ${props => props.inverse && css`
    color: white;
    border: none;
    background: rgba(255, 255, 255, 0.1);

    &:hover {
      color: white;
      border: none;
      background: rgba(255, 255, 255, 0.3);
    }
  `}
`;

Button.propTypes = {
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
  inverse: PropTypes.bool,
  primary: PropTypes.bool,
  primaryRed: PropTypes.bool,
  small: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
  inline: false,
  inverse: false,
  primary: false,
  primaryRed: false,
  small: false,
  // NOTE: setting the default to button gives a better default behaviour when
  // working with forms. By setting the default to "button", only buttons
  // explicitly defined as type="submit" will be triggered when pressing enter
  // on a form.
  type: 'button',
};

/**
 * Exports
 */

export default Button;
