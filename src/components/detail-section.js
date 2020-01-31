import React from 'react';
import PropTypes from 'prop-types';

import Box from 'components/box';
import { Text } from 'components/text';

const DetailSection = ({ children, titleProps, title, ...props }) => (
  <Box marginBottom={5} {...props}>
    {title && (
      <Box marginBottom={4}>
        <Text fontSize={4} fontWeight="medium" {...titleProps}>{title}</Text>
      </Box>
    )}
    {children}
  </Box>
);

DetailSection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  titleProps: PropTypes.shape({}),
};

DetailSection.defaultProps = {
  title: undefined,
  titleProps: {},
};

export default DetailSection;
