import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { sortBy, reverse } from 'lodash/fp';

// Table wrapper that just adds UI elements for sorting existing data.
// Use with-api-sporting.js instead if you need to handle and display data from a paginated API.
const withSorting = injectedProps => WrappedComponent => (
  class FilteredTable extends PureComponent {
    static propTypes = {
      data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }

    constructor(props) {
      super(props);
      const { orderBy, order } = injectedProps;
      this.state = {
        orderBy,
        order: order || 'desc',
        sortingData: null,
      };
    }

    getSorting = () => {
      const { order, orderBy } = this.state;
      const { data } = this.props;

      const sortedList = sortBy(orderBy, data);
      return order === 'asc' ? sortedList : reverse(sortedList);
    }

    handleRequestSort = (property) => {
      const newOrderBy = property;
      let newOrder = 'desc';

      const { orderBy, order } = this.state;

      if (orderBy === property && order === 'desc') {
        newOrder = 'asc';
      }

      this.setState({ order: newOrder, orderBy: newOrderBy });
    };

    render() {
      const { order, orderBy } = this.state;
      const sortedData = this.getSorting();
      return (
        <WrappedComponent
          {...this.props}
          data={sortedData}
          onRequestSort={this.handleRequestSort}
          order={order}
          orderBy={orderBy}
        />
      );
    }
  });


export default withSorting;
