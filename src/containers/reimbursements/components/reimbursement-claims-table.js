import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { formatShortId } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ClaimIcon from 'components/claim-icon';
import { withPagination, TableCell, TextTableCell } from 'components/table';

class ReimbursementClaimsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 25,
    };
  }

  handleChangePage = (_, page) => {
    this.setState({ page });
  };

  render() {
    const { data } = this.props;
    const { page, rowsPerPage } = this.state;
    const currentPageRows = data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : null;
    const hasData = data && currentPageRows.length >= 0;
    return (
      <>
        <Table>
          <TableHead>
            <TableRow>
              <TextTableCell>Claim ID</TextTableCell>
              <TextTableCell align="right">Amount</TextTableCell>
              <TextTableCell align="right">Approved On</TextTableCell>
              <TextTableCell align="right">Submitted On</TextTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!hasData && <TableRow><TextTableCell colSpan={4}>No data available</TextTableCell></TableRow>}
            {hasData && currentPageRows.map(r => (
              <TableRow key={r.claimId}>
                <TableCell><ClaimIcon claim={{ ...r, shortClaimId: formatShortId(r.claimId) }} /></TableCell>
                <TextTableCell align="right">{formatCurrency(r.reimbursalAmount)}</TextTableCell>
                <TextTableCell align="right">{formatDate(r.adjudicatedAt)}</TextTableCell>
                <TextTableCell align="right">{formatDate(r.submittedAt)}</TextTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
}

ReimbursementClaimsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO make shape
};

export default withPagination(ReimbursementClaimsTable);
