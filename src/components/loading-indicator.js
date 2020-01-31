import React from 'react';
import PropTypes from 'prop-types';

import { isEmpty } from 'lodash/fp';

import Box from 'components/box';
import Spinner from 'components/spinner';
import { Text } from 'components/text';
import Icon from 'components/icon';

/**
 * Component
 */

const LoadingIndicator = ({ noun, error, ...props }) => (
  <Box flex justifyContent="center" alignItems="center" {...props}>
    {isEmpty(error) ? (
      <>
        <Box paddingRight={4} color="gray.5">
          <Spinner small />
        </Box>
        <Text verticalAlign="middle">
          {`Loading ${noun}...`}
        </Text>
      </>
    ) : (
      <>
        <Box paddingRight={4} color="yellow.7">
          <Icon name="warning" />
        </Box>
        <Text verticalAlign="middle">
          {`Error loading ${noun} : ${error}`}
        </Text>
      </>
    )}
  </Box>
);

LoadingIndicator.propTypes = {
  error: PropTypes.string,
  noun: PropTypes.string.isRequired,
};

LoadingIndicator.defaultProps = {
  error: null,
};

/**
 * Exports
 */

export default LoadingIndicator;
