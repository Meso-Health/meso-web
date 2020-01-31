/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { slice } from 'lodash/fp';
import TablePagination from '@material-ui/core/TablePagination';

// Table wrapper to support displaying data from a paginated API.
// - allows performing an action (i.e. network call) on page change
// - relies on parent component to track page number and total record count (returned from api endpoint)
//   since the parent will be making the network calls, and we want to preserve those two fields after the parent re-renders
const withApiPagination = WrappedComponent => (
  class PaginatedTable extends Component {
    static propTypes = {
      data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      page: PropTypes.number.isRequired,
      total: PropTypes.number,
      onPageChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
      total: null,
    }

    constructor(props) {
      super(props);
      this.state = {
        rowsPerPage: 25,
      };
    }

    handleChangePage = (_, page) => {
      const { onPageChange } = this.props;

      onPageChange(page);
    };

    render() {
      const { data, total, page } = this.props;
      const { rowsPerPage } = this.state;
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
            count={data.length === 0 ? 0 : (total || data.length)}
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

export default withApiPagination;
