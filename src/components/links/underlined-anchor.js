import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

/**
 * NOTE: `UnderlinedAnchor` wraps an `a` tag in the underlined styles. This
 * component should be used when we're just using a link but not navigating.
 *
 * In other words:
 * * `UnderlinedAnchor`: `onClick` and linking to an external `href`
d */

const UnderlinedAnchor = styled.a`
  color: ${props => props.theme.colors.blue[5]};
  cursor: pointer;
  border-bottom: 1px transparent solid;
  padding-bottom: 1px;
  text-decoration: none;
  transition: color 200ms ease;

  &:hover,
  &:active {
    color: ${props => props.theme.colors.blue[3]};
    border-bottom: 1px ${props => props.theme.colors.blue[2]} solid;
  }

  ${props => props.red && css`
    color: ${props.theme.colors.red[7]};

    &:hover,
    &:active {
      color: ${props.theme.colors.red[5]};
      border-bottom: 1px ${props.theme.colors.red[4]} solid;
    }
  `}
`;

export default UnderlinedAnchor;

UnderlinedAnchor.propTypes = {
  red: PropTypes.bool,
};

UnderlinedAnchor.defaultProps = {
  red: null,
};
