import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Box from 'components/box';
import Button from 'components/button';

import { SearchInput } from 'components/inputs';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
    };
  }

  handleClear = () => {
    this.setState({ searchQuery: '' });
  }

  handleClick = () => {
    const { handleSearchButtonClick } = this.props;
    const { searchQuery } = this.state;
    handleSearchButtonClick(searchQuery);
  }

  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  }

  render() {
    const { placeholder, disabled } = this.props;
    const { searchQuery } = this.state;
    return (
      <Box marginBottom={4} flex>
        <Box width="30%">
          <SearchInput
            value={searchQuery}
            placeholder={placeholder}
            onChange={this.handleChange}
          />
        </Box>
        <Box marginLeft={4}>
          <Button primary inline disabled={disabled} onClick={this.handleClick}>Search</Button>
        </Box>
      </Box>
    );
  }
}


SearchBar.propTypes = {
  handleSearchButtonClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

SearchBar.defaultProps = {
  placeholder: 'Search',
  disabled: false,
};

export default SearchBar;
