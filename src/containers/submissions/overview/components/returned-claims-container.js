import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { filterByPredicate } from 'lib/utils';
import { formatDate } from 'lib/formatters/date';
import { formatShortId } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Box from 'components/box';
import { SearchInput } from 'components/inputs';
import { Text } from 'components/text';
import { withFilter, withApiPagination, withApiSorting, TableCell, TextTableCell } from 'components/table';
import ClaimIcon from 'components/claim-icon';

class ReturnedClaimsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: null,
    };
  }

  handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    this.setState({ searchValue });
  }

  render() {
    const { data, onClickRow, onSortChange, sortDirection, sortField, providerId } = this.props;
    const { searchValue } = this.state;
    let filteredData = data;
    if (searchValue) {
      filteredData = filterByPredicate(searchValue, ['claimId', 'reimbursalAmount', 'member.membershipNumber', 'member.medicalRecordNumber', 'visitType'])(data);
    }
    const hasData = filteredData && filteredData.length > 0;
    const cols = [
      { id: 'claimId', label: 'Claim ID', alignLeft: true, padding: false },
      { id: 'reimbursalAmount', label: 'Amount', alignLeft: false, padding: false },
      { id: 'member.membershipNumber', label: 'Beneficiary ID', alignLeft: true, padding: false },
      { id: 'member.medicalRecordNumber', label: 'MRN', alignLeft: true, padding: false },
      { id: 'visitType', label: 'Visit Type', alignLeft: true, padding: false },
      { id: 'updatedAt', label: 'Returned', alignLeft: false, padding: false },
    ];
    return (
      <>
        <Box width="30%">
          <SearchInput
            placeholder="Search"
            onChange={this.handleSearchInputChange}
          />
        </Box>
        <Box flex justifyContent="center">
          <Table>
            <colgroup>
              <col style={{ width: '17%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '23%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '19%' }} />
              <col style={{ width: '24%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                {cols.map(col => (
                  <TableCell
                    key={col.id}
                    padding="checkbox"
                    sortDirection={sortField === col.id ? sortDirection : false}
                    align={col.alignLeft ? 'left' : 'right'}
                  >
                    <TableSortLabel
                      active={sortField === col.id}
                      direction={sortDirection}
                      onClick={() => onSortChange(col.id)}
                    >
                      <Text fontSize={3} fontFamily="sans">{col.label}</Text>
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!hasData && <TableRow><TextTableCell align="center" colSpan={6}>No data available</TextTableCell></TableRow>}
              {hasData && filteredData.map(c => (
                <TableRow key={c.id} style={{ height: 40, paddingTop: 8, paddingBottom: 8 }} onClick={() => onClickRow(`/submissions/${c.id}/edit`)} hover>
                  <TableCell padding="checkbox">
                    <ClaimIcon claim={{ ...c, shortClaimId: formatShortId(c.claimId) }} />
                  </TableCell>
                  <TextTableCell padding="checkbox" align="right">{formatCurrency(c.reimbursalAmount)}</TextTableCell>
                  <TextTableCell style={{ height: 40, paddingTop: 8, paddingBottom: 8 }} padding="checkbox">{c.member && c.member.membershipNumber}</TextTableCell>
                  <TextTableCell padding="checkbox">{c.member && c.member.medicalRecordNumbers[providerId]}</TextTableCell>
                  <TextTableCell padding="checkbox">{c.visitType}</TextTableCell>
                  <TextTableCell padding="checkbox" align="right">{formatDate(c.updatedAt)}</TextTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    );
  }
}

export default withFilter(withApiSorting((withApiPagination(ReturnedClaimsTable))));

ReturnedClaimsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO make shape
  sortDirection: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  onClickRow: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  providerId: PropTypes.number.isRequired,
};

ReturnedClaimsTable.defaultProps = {
};
