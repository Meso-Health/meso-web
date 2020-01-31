import React from 'react';
import PropTypes from 'prop-types';
import Box from 'components/box';
import Icon from 'components/icon';
import { Text, Heading } from 'components/text';

import Alert from './alert';

const MessageAlert = ({ title, description, type, ...props }) => (
  <Box paddingBottom={4}>
    <Alert style={{ border: 'none' }} {...props} type={type}>
      <Box flex flexDirection="row" alignItems="center">
        <Box paddingRight={4}>
          <Icon name="error" size={24} />
        </Box>
        <Box flex flexDirection="column" alignItems="flex-start">
          <Heading style={{ lineHeight: 1.3 }}>{title}</Heading>
          <Text>{description}</Text>
        </Box>
      </Box>
    </Alert>
  </Box>
);

export default MessageAlert;

MessageAlert.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string,
};

MessageAlert.defaultProps = {
  type: 'info',
};
