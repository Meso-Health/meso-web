import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { calculateClaimPrice, calculateStockoutTotal } from 'store/encounters/encounters-utils';
import { formatCurrency, formatCurrencyWithLabel } from 'lib/formatters/currency';

import { TextTableCell } from 'components/table';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Box from 'components/box';
import NegativeValue from 'components/negative-value';
import { ErrorLabel } from 'components/alerts';

class AmountSummary extends Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  render() {
    const {
      encounterItemsWithBillable,
      claimTotalError,
    } = this.props;

    const claimPrice = calculateClaimPrice(encounterItemsWithBillable);
    const claimTotal = Math.floor(claimPrice);

    const stockoutTotal = calculateStockoutTotal(encounterItemsWithBillable);
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TextTableCell color="gray.6">Total Services</TextTableCell>
            <TextTableCell align="right">{formatCurrency(claimPrice + stockoutTotal)}</TextTableCell>
          </TableRow>
          <TableRow>
            <TextTableCell color="gray.6">Stockout</TextTableCell>
            {stockoutTotal > 0 ? (
              <TextTableCell align="right" color="red.6">
                <NegativeValue color="red" padding={4} />
                {formatCurrency(stockoutTotal)}
              </TextTableCell>
            ) : (
              <TextTableCell align="right" color="gray.6">
                {formatCurrency(0)}
              </TextTableCell>
            )}
          </TableRow>
          <TableRow>
            <TextTableCell style={{ borderBottom: 'none' }}>Total Claimed</TextTableCell>
            <TextTableCell style={{ borderBottom: 'none' }} align="right" fontSize={4} fontWeight="semibold">
              {formatCurrencyWithLabel(claimTotal)}
              {claimTotalError && (
                <Box>
                  <ErrorLabel>{claimTotalError}</ErrorLabel>
                </Box>
              )}
            </TextTableCell>
          </TableRow>
        </TableBody>
      </Table>

    );
  }
}

export default AmountSummary;

AmountSummary.propTypes = {
  encounterItemsWithBillable: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  claimTotalError: PropTypes.string,
};

AmountSummary.defaultProps = {
  claimTotalError: null,
};
