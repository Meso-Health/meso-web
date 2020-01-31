import React from 'react';
import PropTypes from 'prop-types';

import Box from 'components/box';
import { Subtitle, Text } from 'components/text';

const DetailHeader = ({ icon, title, subtitle, ...props }) => (
  <Box marginBottom={5} flex alignItems="center" {...props}>
    <Box marginRight={4}>
      {icon}
    </Box>
    <div>
      <Box marginBottom={1}>
        <Text fontSize={4} fontWeight="medium">{title}</Text>
      </Box>

      <Subtitle>{subtitle}</Subtitle>
    </div>
  </Box>
);

export default DetailHeader;

DetailHeader.propTypes = {
  icon: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

DetailHeader.defaultProps = {
  subtitle: undefined,
};
