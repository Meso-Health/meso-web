import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Icon, { icons } from 'components/icon';
import inputStyles from './input-styles';

const StyledInput = styled.input`
  ${inputStyles}
  padding: 0.5rem 0.75rem;
  width: 100%;
  ${props => props.withLabel && css`
    padding: 0;
    height: auto;
  `}
  ${props => props.disabled && css`
    color: ${props.theme.colors.gray[5]};
    background: ${props.theme.colors.gray[1]};
  `}
`;

const TextInputContainer = styled.div`
  display: flex;
  align-items: center;
  ${inputStyles}
  overflow: hidden;
  padding: 0.75rem;
  padding-left: 0.25rem;
  line-height: 1.0;
  width: 100%;
  
  ${props => props.hasError && css`
    &,
    &:focus {
      border: 1px ${props.theme.colors.red[4]} solid;
    }
  `}

  ${props => props.disabled && css`
    background: ${props.theme.colors.gray[1]};
    color: ${props.theme.colors.red[7]};
  `}
  
  ${props => props.withLabel && css`
    padding: 0;
    height: auto;
    &,
    &:focus {
      border: none;
    }
  `}

  ${props => (props.hasError && props.withLabel) && css`
    &,
    &:focus {
      border: none;
    }
  `}
`;

const IconContainer = styled.span`
  color: ${props => props.theme.colors.gray[6]};
`;

class TextInput extends PureComponent {
  inputRef = React.createRef();

  handleIconClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  render() {
    const { beforeIconName, disabled, hasError, withLabel, ...rest } = this.props;

    return (
      <TextInputContainer withLabel={withLabel} disabled={disabled} hasError={hasError}>
        {beforeIconName && (
          <IconContainer onClick={this.handleIconClick}>
            <Icon name={beforeIconName} iconSize={20} size={32} />
          </IconContainer>
        )}
        <StyledInput
          withLabel={withLabel}
          ref={this.inputRef}
          disabled={disabled}
          hasError={hasError}
          noBorder
          {...rest}
        />
      </TextInputContainer>
    );
  }
}

export default TextInput;

TextInput.propTypes = {
  beforeIconName: PropTypes.oneOf(Object.keys(icons)),
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  withLabel: PropTypes.bool,
};

TextInput.defaultProps = {
  beforeIconName: null,
  disabled: false,
  hasError: false,
  withLabel: false,
};
