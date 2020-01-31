import React from 'react';
import PropTypes from 'prop-types';

import { formatCardId } from 'lib/formatters';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withPagination, TextTableCell, TableCell } from 'components/table';

const MemberSearchResultsTable = ({ data, handleRowClick }) => (
  <Table>
    <colgroup>
      <col style={{ width: '30%' }} />
      <col style={{ width: '25%' }} />
      <col style={{ width: '15%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '12%' }} />
      <col style={{ width: '6%' }} />
    </colgroup>
    <TableHead>
      <TableRow>
        <TableCell>Full Name</TableCell>
        <TableCell>Beneficiary ID</TableCell>
        <TableCell>QR Code</TableCell>
        <TableCell>MRN</TableCell>
        <TableCell>Gender</TableCell>
        <TableCell>Age</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map(r => (
        <TableRow key={r.id} onClick={() => handleRowClick(r.id)} hover>
          <TextTableCell color="blue.5">{r.name}</TextTableCell>
          <TextTableCell>{r.membershipNumber}</TextTableCell>
          <TextTableCell>{formatCardId(r.cardId)}</TextTableCell>
          <TextTableCell>{r.medicalRecordNumber}</TextTableCell>
          <TextTableCell>{r.gender}</TextTableCell>
          <TextTableCell>{r.age}</TextTableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default withPagination(MemberSearchResultsTable);

MemberSearchResultsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleRowClick: PropTypes.func.isRequired,
};
