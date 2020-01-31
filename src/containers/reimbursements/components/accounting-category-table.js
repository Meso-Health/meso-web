import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell, TextTableCell } from 'components/table';

import { formatNumber } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';

import Box from 'components/box';
import Divider from 'components/dividers/divider';
import { Text } from 'components/text';
import LoadingIndicator from 'components/loading-indicator';

const AccountingCategoryTable = ({ accountingStats, isLoading }) => {
  const body = isLoading
    ? (
      <TableBody>
        <TableRow>
          <TableCell>
            <LoadingIndicator noun="detail" />
          </TableCell>
        </TableRow>
      </TableBody>
    ) : (
      <TableBody>
        {accountingStats.map((d) => {
          const bypass = d.reimbursedTotal - d.total - d.stockoutTotal;
          const total = d.total - d.stockoutTotal;
          return (
            <TableRow key={d.category}>
              <TextTableCell>{d.category}</TextTableCell>
              <TextTableCell align="right">{formatNumber(d.count)}</TextTableCell>
              <TextTableCell align="right">
                <Box><Text>{formatCurrency(d.reimbursedTotal)}</Text></Box>
                {bypass > 0 && (
                  <Box flex justifyContent="space-between">
                    <Text color="gray.6">Bypass</Text>
                    <Text color="gray.6">{` -${formatCurrency(bypass)}`}</Text>
                  </Box>
                )}
                {d.stockoutTotal > 0 && (
                  <Box flex justifyContent="space-between">
                    <Text color="red.6">Stockout</Text>
                    <Text color="red.6">{` -${formatCurrency(d.stockoutTotal)}`}</Text>
                  </Box>
                )}
                {total !== d.reimbursedTotal && (
                  <>
                    <Divider marginTop={4} marginBottom={4} />
                    <Box><Text fontWeight="medium">{formatCurrency(total)}</Text></Box>
                  </>
                )}
              </TextTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );

  return (
    <>
      <Table>
        <colgroup>
          <col style={{ width: '55%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TextTableCell>Service categories</TextTableCell>
            <TextTableCell align="right">No. of claims</TextTableCell>
            <TextTableCell align="right">Amount</TextTableCell>
          </TableRow>
        </TableHead>
        {body}
      </Table>
    </>
  );
};

AccountingCategoryTable.propTypes = {
  accountingStats: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO make shape
  isLoading: PropTypes.bool.isRequired,
};

export default AccountingCategoryTable;
