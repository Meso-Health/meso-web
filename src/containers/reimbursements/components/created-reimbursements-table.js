import React from 'react';
import PropTypes from 'prop-types';

import { formatCurrency } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import ReimbursementIcon from 'components/reimbursement-icon';
import { Text } from 'components/text';
import { withFilter, withPagination, withSorting, TableCell, TextTableCell } from 'components/table';

const CreatedReimbursementsTable = ({ data, onClickRow, onRequestSort, order, orderBy, providerNamesById }) => {
  const hasData = data && data.length > 0;

  const cols = [
    { id: 'id', label: 'ID', alignLeft: true },
    { id: 'provider', label: 'Provider', alignLeft: true },
    { id: 'claimCount', label: 'No. of claims', alignLeft: false },
    { id: 'total', label: 'Amount', alignLeft: false },
    { id: 'startDate', label: 'Start date', alignLeft: false },
    { id: 'endDate', label: 'End date', alignLeft: false },
  ];
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {cols.map(col => (
              <TableCell
                key={col.id}
                padding="checkbox"
                sortDirection={orderBy === col.id ? order : false}
                align={col.alignLeft ? 'left' : 'right'}
              >
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={order}
                  onClick={() => onRequestSort(col.id)}
                >
                  <Text fontSize={3} fontFamily="sans">{col.label}</Text>
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!hasData && <TableRow><TableCell align="center" colSpan={6}>No data available</TableCell></TableRow>}
          {hasData && data.map(r => (
            <TableRow onClick={() => onClickRow(`/reimbursements/created/${r.id}`)} key={r.id} hover>
              <TableCell padding="checkbox"><ReimbursementIcon reimbursement={r} /></TableCell>
              <TextTableCell padding="checkbox">{providerNamesById ? providerNamesById[r.providerId] : r.providerId}</TextTableCell>
              <TextTableCell padding="checkbox" align="right">{r.claimCount}</TextTableCell>
              <TextTableCell padding="checkbox" align="right">{formatCurrency(parseInt(r.total, 10))}</TextTableCell>
              <TextTableCell padding="checkbox" align="right">{r.startDate ? formatDate(r.startDate) : ''}</TextTableCell>
              <TextTableCell padding="checkbox" align="right">{r.endDate ? formatDate(r.endDate) : ''}</TextTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default withFilter(withSorting({ orderBy: 'endDate' })(withPagination(CreatedReimbursementsTable)));
// NB: order here matters pagination should always be inner most and filter outer most

CreatedReimbursementsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO make shape
  onClickRow: PropTypes.func.isRequired,
  providerNamesById: PropTypes.shape({}).isRequired, // TODO make shape
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};
