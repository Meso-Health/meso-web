
import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash/fp';
import { Text } from 'components/text';
import Box from 'components/box';
import LoadingIndicator from 'components/loading-indicator';

const SearchResults = ({
  searchHint,
  isLoading,
  fetchingError,
  searchResults,
  hasQuery,
  children,
  extraHintIfNoResults,
}) => {
  let searchDisplay;
  if (isLoading) {
    searchDisplay = (<LoadingIndicator noun="" />);
  } else if (fetchingError.length > 0) {
    searchDisplay = (<LoadingIndicator noun="" error={fetchingError} />);
  } else if (hasQuery && isEmpty(searchResults)) {
    searchDisplay = (
      <Box flex alignItems="center" flexDirection="column" marginTop={6}>
        <Text>Your search did not match any records.</Text>
        <Text marginTop={3}>
          {searchHint}
          {extraHintIfNoResults}
        </Text>
      </Box>
    );
  } else if (isEmpty(searchResults)) { // this check because advanced search won't have a query
    searchDisplay = (
      <Box flex justifyContent="center" marginTop={6}><Text>{searchHint}</Text></Box>
    );
  } else {
    searchDisplay = children;
  }
  return (<>{searchDisplay}</>);
};


SearchResults.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasQuery: PropTypes.bool,
  fetchingError: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.shape({})),
  searchHint: PropTypes.string.isRequired,
  extraHintIfNoResults: PropTypes.node,
};

SearchResults.defaultProps = {
  searchResults: [],
  hasQuery: false,
  extraHintIfNoResults: null,
};

export default SearchResults;
