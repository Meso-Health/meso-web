import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TextTableCell, TableCell } from 'components/table';
import NullValue from 'components/null-value';

const IdentificationEventsTable = ({ tableData }) => {
  const hasData = tableData && tableData.length > 0;

  return (
    <Table>
      <colgroup>
        <col style={{ width: '23%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '8%' }} />
        <col style={{ width: '9%' }} />
        <col style={{ width: '9%' }} />
        <col style={{ width: '11%' }} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Full Name</TableCell>
          <TableCell>Beneficiary ID</TableCell>
          <TableCell>Administrative Division</TableCell>
          <TableCell>MRN</TableCell>
          <TableCell>Gender</TableCell>
          <TableCell>Age</TableCell>
          <TableCell>Checked In</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!hasData && <TableRow><TextTableCell colSpan={7}>No data available</TextTableCell></TableRow>}
        {hasData && tableData.map(row => (
          <TableRow key={row.id} component={Link} to={{ pathname: `/check-in/members/${row.memberId}`, state: { idEventId: row.id } }} hover>
            <TextTableCell color="blue.5">{row.fullName}</TextTableCell>
            <TextTableCell>{row.membershipNumber}</TextTableCell>
            <TextTableCell>
              {row.administrativeDivisionName ? row.administrativeDivisionName : <NullValue />}
            </TextTableCell>
            <TextTableCell>{row.medicalRecordNumber || <NullValue />}</TextTableCell>
            <TextTableCell>{row.gender}</TextTableCell>
            <TextTableCell>{row.age}</TextTableCell>
            <TextTableCell>{row.occurredAt}</TextTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IdentificationEventsTable;

IdentificationEventsTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    memberId: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    membershipNumber: PropTypes.string.isRequired,
    administrativeDivisionName: PropTypes.string,
    medicalRecordNumber: PropTypes.string,
    gender: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    occurredAt: PropTypes.string.isRequired,
  })).isRequired,
};
