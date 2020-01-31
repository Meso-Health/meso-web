import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Icon from 'components/icon';
import inputStyles from './input-styles';

const SelectContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  ${inputStyles}
  width: ${props => (props.inline ? 'auto' : '100%')};

  ${props => props.withLabel && css`
    border: none;
    height: auto;
  `}

  ${props => props.hasError && css`
    &,
    &:focus {
      border: 1px ${props.theme.colors.red[4]} solid;
    }
  `}

  ${props => (props.hasError && props.withLabel) && css`
    &,
    &:focus {
      border: none;
    }
  `}

  // Remove system UI for select on Windows
  // Taken from: http://stackoverflow.com/a/15933790
  &:focus {
    border: 1px #f00 solid;
  }

  &::-ms-expand {
    display: none;
  }
`;

const SelectElement = styled.select`
  appearance: none;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  font-family: ${props => props.theme.font.family.sans};
  font-size: ${props => props.theme.font.size[3]};
  padding-left: 12px;
  padding-right: 32px;

  ${props => props.withLabel && css`
    padding-left: 0px;
    padding-right: 0px;
  }`}
  &:focus {
    outline: none;
  }
  ${props => props.disabled && css`
    background: ${props.theme.colors.gray[1]};
    cursor: default;
  `}
`;

const IconContainer = styled.span`
  position: absolute;
  top: 50%;
  right: ${props => (props.withLabel ? 1 : 12)}px;
  color: ${props => props.theme.colors.gray[7]};
  pointer-events: none;
`;

const IconUpContainer = styled(IconContainer)`
  margin-top: -6px;
`;

const IconDownContainer = styled(IconContainer)`
  margin-top: 1px;
`;

const SelectIcon = ({ withLabel }) => (
  <span>
    <IconUpContainer withLabel={withLabel}>
      <Icon name="direct-up" size={7} />
    </IconUpContainer>
    <IconDownContainer withLabel={withLabel}>
      <Icon name="direct-down" size={7} />
    </IconDownContainer>
  </span>
);

SelectIcon.propTypes = {
  withLabel: PropTypes.bool,
};

SelectIcon.defaultProps = {
  withLabel: false,
};

const Select = ({ className, inline, hasError, disabled, withLabel, ...props }) => (
  <SelectContainer withLabel={withLabel} inline={inline} hasError={hasError} className={className}>
    <SelectElement withLabel={withLabel} disabled={Boolean(disabled)} {...props} />
    {!disabled && <SelectIcon withLabel={withLabel} />}
    {/* TODO: removed this disabled was being used as a standin for a disabled input */}
  </SelectContainer>
);

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  withLabel: PropTypes.bool,
  inline: PropTypes.bool,
};

Select.defaultProps = {
  className: undefined,
  disabled: false,
  hasError: false,
  withLabel: false,
  inline: false,
};

export default Select;
