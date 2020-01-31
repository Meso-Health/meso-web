import React from 'react';
import PropTypes from 'prop-types';
import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';

/**
 * Styles
 */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Circle = styled.div`
  display: inline-block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  border: ${props => props.borderWidth}px transparent solid;
  border-top-color: currentColor;
  border-left-color: currentColor;
  animation: ${spin} 500ms linear infinite;
`;

const Variant = {
  SMALL: {
    size: 18,
    borderWidth: 3,
  },
  MEDIUM: {
    size: 24,
    borderWidth: 3,
  },
};

/**
 * Component
 */

const Spinner = ({ small, ...props }) => {
  const variant = small ? Variant.SMALL : Variant.MEDIUM;

  return (
    <Circle
      borderWidth={variant.borderWidth}
      size={variant.size}
      {...props}
    />
  );
};

Spinner.propTypes = {
  small: PropTypes.bool,
};

Spinner.defaultProps = {
  small: false,
};

/**
 * Exports
 */

export default Spinner;
