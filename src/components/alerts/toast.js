import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from 'components/box';
import { Text } from 'components/text';

import Alert from './alert';

class Toast extends Component {
  componentDidMount() {
    const { removeToast } = this.props;
    setTimeout(() => {
      removeToast();
    }, 2500);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { message, type, ...props } = this.props;
    return (
      <Box paddingTop={2}>
        <Alert {...props} type={type}>
          <Box flex flexDirection="row" alignItems="center">
            <Text>{message}</Text>
          </Box>
        </Alert>
      </Box>
    );
  }
}

export default Toast;

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  removeToast: PropTypes.func.isRequired,
  type: PropTypes.string,
};

Toast.defaultProps = {
  type: 'success',
};
