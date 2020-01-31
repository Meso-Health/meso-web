import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash/fp';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

import { formatCurrency } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import Box from 'components/box';
import ClaimIcon from 'components/claim-icon';
import { TableCell, TextTableCell, withPagination } from 'components/table';
import { Text } from 'components/text';

const RecentClaimsList = ({ data, onClickRow }) => (
  <Box flex>
    {isEmpty(data)
      ? <Text colSpan={3} align="center" color="gray.6">No recent claims</Text>
      : (
        <Table>
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '35%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <TableBody>
            {data.map((e, i) => {
              const lastRow = i === data.length - 1;
              return (
                <TableRow style={{ height: 'auto', paddingTop: 8, paddingBottom: 8 }} onClick={() => onClickRow(`/claims/${e.id}`)} key={e.id} hover>
                  <TableCell style={{ borderBottom: lastRow && 'none', height: 40 }} padding="checkbox"><ClaimIcon claim={e} /></TableCell>
                  <TextTableCell style={{ borderBottom: lastRow && 'none', height: 40 }} padding="checkbox" align="right">{formatCurrency(e.price)}</TextTableCell>
                  <TextTableCell style={{ borderBottom: lastRow && 'none', height: 40 }} padding="checkbox">{e.providerName}</TextTableCell>
                  <TextTableCell style={{ borderBottom: lastRow && 'none', height: 40 }} padding="checkbox" align="right">{formatDate(e.occurredAt)}</TextTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
  </Box>
);

RecentClaimsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClickRow: PropTypes.func.isRequired,
};

export default withPagination(RecentClaimsList);
