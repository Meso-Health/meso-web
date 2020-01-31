import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { sortBy, reverse } from 'lodash/fp';

// Table wrapper to support displaying data from a paginated API.
// - allows performing an action (i.e. network call) when sort field or sort direction changes.
// - relies on parent component to track sortField and sortDirection
//   since the parent will be making the network calls, and we want to preserve those two fields after the parent re-renders
const withApiSorting = WrappedComponent => (
  class FilteredTable extends PureComponent {
    static propTypes = {
      data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      onSortChange: PropTypes.func.isRequired,
      sortField: PropTypes.string.isRequired,
      sortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
    }

    getSortedData = () => {
      const { data, sortField, sortDirection } = this.props;

      const sortedList = sortBy(sortField, data);
      return sortDirection === 'asc' ? sortedList : reverse(sortedList);
    }

    render() {
      const { sortField, sortDirection, onSortChange } = this.props;
      const sortedData = this.getSortedData();

      return (
        <WrappedComponent
          {...this.props}
          data={sortedData}
          order={sortField}
          orderBy={sortDirection}
          onSortChange={onSortChange}
        />
      );
    }
  });

export default withApiSorting;
