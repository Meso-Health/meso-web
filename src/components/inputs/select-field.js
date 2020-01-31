import React from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Box from 'components/box';
import { Label } from 'components/text';
import { ErrorLabel } from 'components/alerts';

import Select from './select';
import inputStyles from './input-styles';

const SelectFieldWrapper = styled.div`
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
  
  ${props => (props.hasError && props.withLabel) && css`
    &,
    &:focus {
      border: 1px ${props.theme.colors.red[4]} solid;
    }
  `}

  ${props => props.disabled && css`
    background-color: ${props.theme.colors.gray[1]};
    cursor: default;
  `}
  
  ${props => !props.withLabel && props.disabled && css`
    background: none;
  `}
`;

const SelectField = ({ options, label, error, name, labelProps, disabled, internalLabel, ...selectProps }) => (
  <>
    {!internalLabel && label && (
      <Box marginTop={3} flex>
        <Label {...labelProps} fontSize={3} fontWeight="medium" htmlFor={name}>{label}</Label>
      </Box>
    )}
    <SelectFieldWrapper withLabel={internalLabel && Boolean(label)} hasError={Boolean(error)} disabled={disabled}>
      {internalLabel && label && (
        <Box marginTop={2} flex>
          <Label {...labelProps} color="gray.5" fontSize={0} htmlFor={name}>{label}</Label>
        </Box>
      )}
      <Box marginBottom={3} marginTop={2} flex>
        <Select
          withLabel={internalLabel && Boolean(label)}
          hasError={Boolean(error)}
          id={name}
          name={name}
          disabled={Boolean(disabled)}
          {...selectProps}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>{option.name}</option>
          ))}
        </Select>
      </Box>
      {error && (
        <Box marginBottom={3} marginTop={2} flex>
          <ErrorLabel>{error}</ErrorLabel>
        </Box>
      )}
    </SelectFieldWrapper>
  </>
);

export default SelectField;

SelectField.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.shape(),
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO make shape
  disabled: PropTypes.bool,
  internalLabel: PropTypes.bool,
};

SelectField.defaultProps = {
  error: null,
  label: null,
  labelProps: {},
  disabled: false,
  internalLabel: false,
};
