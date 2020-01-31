import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash/fp';

import Box from 'components/box';
import { Text } from 'components/text';
import NullValue from 'components/null-value';

const ServiceDetailHeader = ({ headerText, value, first, alignRight }) => (
  // Allow each detail header to default to 25% of the width, grow up to 1/3 if needed, but be no smaller than 25%
  <Box
    flexBasis="25%"
    flexGrow="1"
    paddingLeft={first ? 0 : 5}
    flex
    flexDirection="column"
    alignItems={alignRight ? 'flex-end' : 'flex-start'}
  >
    <Box marginBottom={3}>
      <Text color="gray.6">{headerText}</Text>
    </Box>
    {isEmpty(value) ? <NullValue /> : <Text fontSize={5}>{value}</Text>}
  </Box>
);

export default ServiceDetailHeader;

ServiceDetailHeader.propTypes = {
  headerText: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  first: PropTypes.bool,
  alignRight: PropTypes.bool,
};

ServiceDetailHeader.defaultProps = {
  alignRight: false,
  first: false,
};
