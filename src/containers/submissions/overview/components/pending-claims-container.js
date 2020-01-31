import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map, filter } from 'lodash/fp';

import { filterByPredicate } from 'lib/utils';
import { formatDate } from 'lib/formatters/date';
import { formatShortId } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';

import theme from 'styles/theme';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Box from 'components/box';
import Button from 'components/button';
import { SearchInput } from 'components/inputs';
import { Text } from 'components/text';
import { withFilter, withApiPagination, withApiSorting, TableCell, TextTableCell } from 'components/table';
import ClaimIcon from 'components/claim-icon';

class PendingClaimsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: null,
      selectedEncounterIds: [],
    };
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { selectedEncounterIds } = this.state;
    onSubmit(selectedEncounterIds);
    this.setState({ selectedEncounterIds: [] });
  }

  handleSelectAllClick = () => {
    const { data } = this.props;
    const { selectedEncounterIds } = this.state;
    if (selectedEncounterIds.length === data.length) {
      this.setState({ selectedEncounterIds: [] });
    } else {
      const ids = map(d => d.id)(data);
      this.setState({ selectedEncounterIds: [...ids] });
    }
  }

  handleSelect = (encounterId) => {
    const { selectedEncounterIds } = this.state;
    if (selectedEncounterIds.includes(encounterId)) {
      const filteredSelected = filter(s => s !== encounterId)(selectedEncounterIds);
      this.setState({ selectedEncounterIds: filteredSelected });
    } else {
      this.setState({ selectedEncounterIds: [...selectedEncounterIds, encounterId] });
    }
  }

  handleClick = (e, encounterId, isSelect = false) => {
    const { onClickRow } = this.props;
    if (isSelect) {
      e.stopPropagation();
      this.handleSelect(encounterId);
    } else {
      onClickRow(`/submissions/${encounterId}`);
    }
  }

  handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    this.setState({ searchValue });
  }

  render() {
    const { data, onSortChange, sortDirection, sortField, providerId } = this.props;
    const { searchValue, selectedEncounterIds } = this.state;
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
      { id: 'occurredAt', label: 'Serviced', alignLeft: false, padding: false },
    ];
    const numSelected = selectedEncounterIds.length;
    const rowCount = data.length;
    return (
      <>
        <Box flex justifyContent="flex-end" marginTop="-44px">
          {numSelected > 0 && <Button primary inline onClick={this.handleSubmit}>{`Submit (${numSelected})`}</Button>}
          {numSelected === 0 && <Button primary inline disabled>Submit</Button>}
        </Box>
        <Box width="30%">
          <SearchInput
            placeholder="Search"
            onChange={this.handleSearchInputChange}
          />
        </Box>
        <Box flex justifyContent="center">
          <Table>
            <colgroup>
              <col style={{ width: '8%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '26%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '21%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected === rowCount && rowCount !== 0}
                    onChange={this.handleSelectAllClick}
                    inputProps={{ 'aria-label': 'Select all claims' }}
                    style={{ color: theme.colors.gray[6] }}
                  />
                </TableCell>
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
                <TableRow
                  key={c.id}
                  style={{ height: 40, paddingTop: 8, paddingBottom: 8 }}
                  onClick={e => this.handleClick(e, c.id)}
                  hover
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEncounterIds.includes(c.id)}
                      onClick={e => this.handleClick(e, c.id, true)}
                      style={{ color: theme.colors.gray[6] }}
                    />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <ClaimIcon claim={{ ...c, shortClaimId: formatShortId(c.claimId) }} />
                  </TableCell>
                  <TextTableCell padding="checkbox" align="right">{formatCurrency(c.reimbursalAmount)}</TextTableCell>
                  <TextTableCell style={{ height: 40, paddingTop: 8, paddingBottom: 8 }} padding="checkbox">{c.member && c.member.membershipNumber}</TextTableCell>
                  <TextTableCell padding="checkbox">{c.member && c.member.medicalRecordNumbers[providerId]}</TextTableCell>
                  <TextTableCell padding="checkbox">{c.visitType}</TextTableCell>
                  <TextTableCell padding="checkbox" align="right">{formatDate(c.occurredAt)}</TextTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    );
  }
}

export default withFilter(withApiSorting((withApiPagination(PendingClaimsTable))));

PendingClaimsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO make shape
  sortDirection: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  onClickRow: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  providerId: PropTypes.number.isRequired,
};
