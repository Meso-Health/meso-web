import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Icon, { icons } from 'components/icon';
import inputStyles from './input-styles';

const StyledInput = styled.input`
  ${inputStyles}
  padding: 0.5rem 0.25rem;
  width: 100%;
  text-align: center;

  ${props => props.hasError && css`
    &,
    &:focus {
      border: 1px ${props.theme.colors.red[4]} solid;
    }
  `}

  ${props => props.disabled && css`
    color: ${props.theme.colors.gray[5]};
    background: ${props.theme.colors.gray[1]};
  `}
`;

const NumberInputContainer = styled.div`
  display: flex;
  align-items: center;
  ${inputStyles}
  overflow: hidden;
  line-height: 1.0;
  width: 44px;

  ${props => props.disabled && css`
    background: ${props.theme.colors.gray[1]};
  `}
`;

const IconContainer = styled.span`
  color: ${props => props.theme.colors.gray[6]};
`;

class NumberInput extends PureComponent {
  inputRef = React.createRef();

  handleIconClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  render() {
    const { beforeIconName, disabled, ...rest } = this.props;

    return (
      <NumberInputContainer disabled={disabled}>
        {beforeIconName && (
          <IconContainer onClick={this.handleIconClick}>
            <Icon name={beforeIconName} iconSize={20} size={32} />
          </IconContainer>
        )}
        <StyledInput ref={this.inputRef} disabled={disabled} noBorder {...rest} />
      </NumberInputContainer>
    );
  }
}

export default NumberInput;

NumberInput.propTypes = {
  beforeIconName: PropTypes.oneOf(Object.keys(icons)),
  disabled: PropTypes.bool,
};

NumberInput.defaultProps = {
  beforeIconName: null,
  disabled: false,
};
