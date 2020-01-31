import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { filter, pickBy, identity, has } from 'lodash/fp';

const withFilter = WrappedComponent => (
  class FilteredTable extends PureComponent {
    static propTypes = {
      data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      // these are filters that require a specific key: value match
      valueFilters: PropTypes.shape({}),
      // these are filters that require that a property exists on the object
      propFilters: PropTypes.arrayOf(PropTypes.string),
    }

    static defaultProps = {
      propFilters: [],
      valueFilters: {},
    }

    render() {
      const { valueFilters, propFilters, data } = this.props;
      const nonNullValueFilters = pickBy(identity)(valueFilters);
      let filteredData = filter(nonNullValueFilters)(data);
      if (propFilters && propFilters.length > 0) {
        filteredData = filter(d => has(propFilters)(d))(filteredData);
      }
      return (
        <WrappedComponent {...this.props} data={filteredData} />
      );
    }
  });

export default withFilter;
