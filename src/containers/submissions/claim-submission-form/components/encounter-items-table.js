import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFinite } from 'lodash/fp';

import { TableCell, TextTableCell } from 'components/table';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Box from 'components/box';
import { formatCurrency } from 'lib/formatters/currency';
import { Text } from 'components/text';
import { NumberInput } from 'components/inputs';

class EncounterItemsTable extends Component {
  handleBlur = (encounterItem) => {
    // if value is empty or not an integer we are setting quantity to 1 by default
    const { handleQuantityChange } = this.props;
    if (encounterItem.quantity.length === 0
      || parseInt(encounterItem.quantity, 10) === 0
      || !isFinite(parseInt(encounterItem.quantity, 10))) {
      handleQuantityChange('1', encounterItem);
    }
  }

  handleRowClick = (encounterItem) => {
    const { handleRowClick } = this.props;
    if (handleRowClick) {
      handleRowClick(encounterItem);
    }
  }

  render() {
    const { encounterItemsWithBillable, handleQuantityChange } = this.props;
    return (
      <Table>
        <colgroup>
          <col style={{ width: '8%' }} />
          <col style={{ width: '62%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TextTableCell fontSize={1} color="gray.5" padding="checkbox">Qty.</TextTableCell>
            <TextTableCell fontSize={1} color="gray.5" padding="checkbox">Line Items</TextTableCell>
            <TextTableCell fontSize={1} color="gray.5" padding="checkbox" align="right">Unit Fee</TextTableCell>
            <TextTableCell fontSize={1} color="gray.5" padding="checkbox" align="right">Total</TextTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {encounterItemsWithBillable.map(ei => (
            <TableRow style={{ height: ei.stockout ? 75 : 60, cursor: 'pointer' }} key={ei.id}>
              <TableCell padding="checkbox"><NumberInput onBlur={() => this.handleBlur(ei)} onChange={e => handleQuantityChange(e.target.value, ei)} value={ei.quantity} /></TableCell>
              <TableCell padding="checkbox" onClick={() => this.handleRowClick(ei)}>
                <Box flex flexDirection="column">
                  <Text>{ei.billable.name}</Text>
                  <Box>
                    {ei.billable.unit && <Text color="gray.5">{ei.unit}</Text>}
                    {ei.billable.composition && <Text color="gray.5">{` ${ei.billable.composition}`}</Text>}
                  </Box>
                  {ei.stockout && (
                    <Text color="red.6">Stockout</Text>
                  )}
                </Box>
              </TableCell>
              <TableCell padding="checkbox" align="right">
                <Box flex flexDirection="column" paddingBottom={ei.stockout ? 30 : 15}>
                  <Text>{formatCurrency(ei.priceSchedule.price)}</Text>
                </Box>
              </TableCell>
              <TableCell padding="checkbox" align="right">
                <Box flex flexDirection="column" paddingBottom={ei.stockout ? 0 : 15}>
                  <Text>{formatCurrency(ei.priceSchedule.price * ei.quantity)}</Text>
                  {ei.stockout && (
                    <Text color="red.6" paddingTop={15}>
                      {`-${formatCurrency(ei.priceSchedule.price * ei.quantity)}`}
                    </Text>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default EncounterItemsTable;

EncounterItemsTable.propTypes = {
  encounterItemsWithBillable: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired,
};
