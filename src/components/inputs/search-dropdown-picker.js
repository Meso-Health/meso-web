import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { FixedSizeList as VirtualList } from 'react-window';

import { some, flow, filter } from 'lodash/fp';

import theme from 'styles/theme';

import Box from 'components/box';
import { Text } from 'components/text';
import SearchInput from 'components/inputs/search-input';

class SearchDropdownPicker extends Component {
  state = {
    showOptions: false,
    search: '',
  };

  handleSelectOption = (option) => {
    const { handleSelect } = this.props;
    handleSelect(option);
  }

  handleValueChange = (e) => {
    this.setState({ search: e.target.value });
  }

  handleBlur = () => {
    setTimeout(() => {
      this.setState({ showOptions: false });
    }, 100);
  }

  filteredOption = () => {
    const { options, selected } = this.props;
    const { search } = this.state;

    return flow(
      filter(d => !selected.includes(d)),
      filter((d) => {
        const matchesName = d.name.toLowerCase().includes(search.toLowerCase());
        return matchesName || some(a => a.toLowerCase().includes(search.toLowerCase()))(d.aliases);
      }),
    )(options);
  }

  render() {
    const options = this.filteredOption();
    const { showOptions, search } = this.state;
    const { itemSize } = this.props;
    return (
      <Downshift>
        {({ getInputProps }) => (
          <div>
            <SearchInput
              {...getInputProps({
                onBlur: this.handleBlur,
                onFocus: () => this.setState({ showOptions: true }),
              })}
              value={search}
              placeholder="Search"
              onChange={this.handleValueChange}
            />
            {showOptions && (
              <Box style={{ position: 'relative', cursor: 'pointer' }}>
                <VirtualList
                  height={Math.min(options.length * itemSize, 300)}
                  itemCount={options.length}
                  itemSize={itemSize}
                  initialScrollOffset={0}
                  style={{ borderRadius: '3px', top: '-2px', border: `1px ${theme.colors.gray[4]} solid`, zIndex: 1000, width: '100%', background: 'white', position: 'absolute' }}
                >
                  {({ index, style }) => (
                    <div
                      role="menuitem"
                      tabIndex="0"
                      onKeyDown={() => { }}
                      onMouseDown={() => this.handleSelectOption(options[index])}
                      style={{ ...style, padding: '0.75rem', borderBottom: `1px ${theme.colors.gray[4]} solid` }}
                    >
                      <Box flex flexDirection="column">
                        <Text>{options[index].name}</Text>
                        <Box>
                          {options[index].unit && <Text color="gray.5">{options[index].unit}</Text>}
                          {options[index].composition && <Text color="gray.5">{` ${options[index].composition}`}</Text>}
                        </Box>
                      </Box>
                    </div>
                  )}
                </VirtualList>
              </Box>
            )}
          </div>
        )}
      </Downshift>
    );
  }
}

export default SearchDropdownPicker;

SearchDropdownPicker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selected: PropTypes.arrayOf(PropTypes.shape({})),
  handleSelect: PropTypes.func.isRequired,
  counter: PropTypes.shape({
    singular: PropTypes.string.isRequired,
    plural: PropTypes.string.isRequired,
  }),
  itemSize: PropTypes.number,
};

SearchDropdownPicker.defaultProps = {
  counter: null,
  selected: [],
  itemSize: 40,
};
