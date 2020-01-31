import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { typography, spacing, size } from 'styles/system';

const Text = styled.span`
  ${typography}
  ${spacing}
  ${size}
`;

export default Text;

Text.propTypes = {
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ...typography.propTypes,
  ...spacing.propTypes,
  ...size.propTypes,
};

Text.defaultProps = {
  blacklist: [
    'paddingRight',
    'paddingLeft',
    'paddingTop',
    'paddingBottom',
    'paddingVertical',
    'paddingHorizontal',
    'marginRight',
    'marginLeft',
    'marginTop',
    'marginBottom',
    'marginVertical',
    'marginHorizontal',
    'verticalAlign',
    'flexGrow',
    'lineHeight',
  ],
};
