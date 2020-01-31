import React from 'react';
import PropTypes from 'prop-types';

import Box from 'components/box';
import { Text } from 'components/text';

import theme from 'styles/theme';

const Section = ({ children, title, ...props }) => (
  <Box marginBottom={5} {...props}>
    {title && (
      <Box marginBottom={4}>
        <Text fontSize={4} fontWeight="medium">{title}</Text>
      </Box>
    )}
    <Box padding={4} style={{ border: `1px ${theme.colors.gray[3]} solid`, borderRadius: '3px' }}>
      {children}
    </Box>
  </Box>
);

Section.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

Section.defaultProps = {
  title: undefined,
};

export default Section;
