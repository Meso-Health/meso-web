/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { slice } from 'lodash/fp';
import TablePagination from '@material-ui/core/TablePagination';

// Table wrapper that just adds UI elements for paging through data.
// Use with-api-pagination.js instead if you need to handle and display data from a paginated API.
const withPagination = WrappedComponent => (
  class PaginatedTable extends Component {
    static propTypes = {
      data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      rowsPerPage: PropTypes.number,
    }

    static defaultProps = {
      rowsPerPage: null,
    }

    constructor(props) {
      super(props);
      this.state = {
        page: 0,
        defaultRowsPerPage: 25,
      };
    }

    handleChangePage = (_, page) => {
      this.setState({ page });
    };

    render() {
      const { data, rowsPerPage: rowsPerPageOverride } = this.props;
      const { page, defaultRowsPerPage } = this.state;
      const rowsPerPage = rowsPerPageOverride || defaultRowsPerPage;
      const currentPageRows = data
        ? slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)(data)
        : null;

      return (
        <>
          <WrappedComponent
            {...this.props}
            data={currentPageRows}
          />
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={data ? data.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
          />
        </>
      );
    }
  }
);

export default withPagination;
