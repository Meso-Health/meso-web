import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Box from 'components/box';
import { Label } from 'components/text';
import { ErrorLabel } from 'components/alerts';

import inputStyles from './input-styles';
import TextInput from './text-input';

const TextFieldWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  ${inputStyles}
  height: 51px;
  padding-left: ${props => props.theme.font.size[1]};
  padding-right: ${props => props.theme.font.size[1]};
  
  ${props => !props.withLabel && css`
    border: none;
    background: none;
    height: auto;
    padding-left: 0;
    padding-right: 0;
  `}

  ${props => props.disabled && css`
    color: ${props.theme.colors.gray[5]};
    background: ${props.theme.colors.gray[1]};
  `}
  
  ${props => !props.withLabel && props.disabled && css`
    background: none;
  `}

  ${props => props.hasError && css`
    &,
    &:focus {
      border: 1px ${props.theme.colors.red[4]} solid;
    }
  `}
`;

class TextField extends Component {
  inputRef = React.createRef();

  handleFocus = () => {
    if (this.inputRef) {
      this.inputRef.current.handleIconClick();
    }
  }

  render() {
    const { label, error, name, labelProps, disabled, internalLabel, ...textInputProps } = this.props;

    return (
      <>
        {!internalLabel && label && (
          <Box marginTop={3} flex>
            <Label {...labelProps} fontSize={3} fontWeight="medium" htmlFor={name}>{label}</Label>
          </Box>
        )}
        <TextFieldWrapper
          hasError={Boolean(error)}
          disabled={disabled}
          withLabel={internalLabel && Boolean(label)}
          onClick={this.focus}
        >
          {internalLabel && label && (
            <Box marginTop={2}>
              <Label {...labelProps} color="gray.5" fontSize={0} htmlFor={name}>{label}</Label>
            </Box>
          )}
          <Box marginBottom={3} marginTop={2} flex>
            <TextInput
              withLabel={internalLabel && Boolean(label)}
              ref={this.inputRef}
              hasError={Boolean(error)}
              id={name}
              name={name}
              disabled={disabled}
              {...textInputProps}
            />
          </Box>
          {error && (
            <ErrorLabel>{error}</ErrorLabel>
          )}
        </TextFieldWrapper>
      </>
    );
  }
}

export default TextField;

TextField.propTypes = {
  error: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.shape({}),
  internalLabel: PropTypes.bool,
};

TextField.defaultProps = {
  error: null,
  disabled: false,
  label: null,
  labelProps: {},
  internalLabel: false,
};
