import React, { Component } from 'react';
import { map, capitalize } from 'lodash/fp';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { TextTableCell } from 'components/table';
import Box from 'components/box';

import { formatNumber } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';
import { objectHasProp } from 'lib/utils';

class ClaimsStatusTable extends Component {
  render() {
    const { claimsByAdjudicationState } = this.props;
    const data = map((adjudicationState) => {
      if (claimsByAdjudicationState && objectHasProp(claimsByAdjudicationState, adjudicationState)) {
        return ({
          adjudicationState,
          ...claimsByAdjudicationState[adjudicationState],
        });
      }
      return ({ adjudicationState, claims: 0, total: 0 });
    })(['pending', 'returned', 'approved', 'total']);

    return (
      <OutlinedBox>
        <Table>
          <TableHead>
            <TableRow>
              <TextTableCell>Category</TextTableCell>
              <TextTableCell align="right">No. of claims</TextTableCell>
              <TextTableCell align="right">Total</TextTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d, i) => (
              <TableRow key={d.adjudicationState}>
                <TextTableCell style={{ borderBottom: i === data.length - 1 && 'none' }}>{capitalize(d.adjudicationState)}</TextTableCell>
                <TextTableCell style={{ borderBottom: i === data.length - 1 && 'none' }} align="right">{formatNumber(d.claimsCount)}</TextTableCell>
                <TextTableCell style={{ borderBottom: i === data.length - 1 && 'none' }} align="right">{formatCurrency(d.totalPrice)}</TextTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </OutlinedBox>
    );
  }
}

const OutlinedBox = styled(Box)`
  border-radius: 3px;
  border: 1px ${props => props.theme.colors.gray[2]} solid;
  padding: 4px 10px;
`;

ClaimsStatusTable.propTypes = {
  claimsByAdjudicationState: PropTypes.shape({}).isRequired, // TODO make shape
};

export default ClaimsStatusTable;
