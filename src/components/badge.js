import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

/**
 * Component
 */

const Badge = styled.div`
  position: relative;
  display: inline-block;
  height: 22px;
  border: 1px solid hsla(199, 8%, 47%, 0.4);
  border-radius: 14px;
  padding-left: 5px;
  padding-right: 5px;
  color: #6f7c82;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 0.4px;
  text-transform: uppercase;

  ${props => props.small && css`
    padding-left: 5px;
    padding-right: 5px;
    height: 17px;
    font-size: 10px;
    line-height: 15px;
  `}
`;

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  small: PropTypes.bool,
};

Badge.defaultProps = {
  small: false,
};

/**
 * Exports
 */

export default Badge;
