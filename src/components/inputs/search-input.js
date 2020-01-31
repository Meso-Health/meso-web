import React from 'react';

import TextInput from './text-input';

const SearchInput = props => (
  <TextInput beforeIconName="search" {...props} />
);

export default SearchInput;
