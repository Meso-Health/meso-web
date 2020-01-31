import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { formatNumber } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { withPagination, TextTableCell } from 'components/table';
import NullValue from 'components/null-value';

class OverviewBalanceTable extends Component {
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
    const { data, providerNamesById, onClickRow } = this.props;
    const { page, rowsPerPage } = this.state;
    const currentPageRows = data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : null;
    const hasData = data.length > 0;

    return (
      <>
        <Table>
          <TableHead>
            <TableRow>
              <TextTableCell padding="checkbox">Provider</TextTableCell>
              <TextTableCell padding="checkbox" align="right">Last payment date</TextTableCell>
              <TextTableCell padding="checkbox" align="right">Approved claims</TextTableCell>
              <TextTableCell padding="checkbox" align="right">Approved amount</TextTableCell>
              <TextTableCell padding="checkbox" align="right">Total claims</TextTableCell>
              <TextTableCell padding="checkbox" align="right">Total amount</TextTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!hasData && <TableRow><TextTableCell colSpan={4}>No data available</TextTableCell></TableRow>}
            {hasData && currentPageRows.map(r => (
              <TableRow onClick={() => onClickRow(`/reimbursements/overview/${r.providerId}`)} key={r.providerId} hover>
                <TextTableCell padding="checkbox">{providerNamesById ? providerNamesById[r.providerId] : r.providerId}</TextTableCell>
                <TextTableCell padding="checkbox" align="right">
                  {r.lastPaymentDate ? formatDate(r.lastPaymentDate) : <NullValue />}
                </TextTableCell>
                <TextTableCell padding="checkbox" align="right">{formatNumber(r.approved.claimsCount)}</TextTableCell>
                <TextTableCell padding="checkbox" align="right">{formatCurrency(r.approved.totalPrice)}</TextTableCell>
                <TextTableCell padding="checkbox" align="right">{formatNumber(r.total.claimsCount)}</TextTableCell>
                <TextTableCell padding="checkbox" align="right">{formatCurrency(r.total.totalPrice)}</TextTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
}

OverviewBalanceTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClickRow: PropTypes.func.isRequired,
  providerNamesById: PropTypes.shape({}).isRequired,
};

export default withPagination(OverviewBalanceTable);
