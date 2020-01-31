import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { capitalize, isNil, reduce } from 'lodash/fp';

import { removeCurrencyFormatting, formatCurrencyWithLabel, formatCurrency } from 'lib/formatters/currency';

import { getLineItems } from 'store/encounters/encounters-selectors';
import { encounterPropType, userPropType } from 'store/prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import Box from 'components/box';
import { Text } from 'components/text';
import NullValue from 'components/null-value';
import { TextTableCell, TableCell } from 'components/table';
import { isNullOrUndefined } from 'util';

class EncounterReceipt extends Component {
  renderColgroup = (showFinancials) => {
    if (showFinancials) {
      return (
        <colgroup>
          <col style={{ width: '20%' }} />
          <col style={{ width: '54%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
      );
    }
    return (
      <colgroup>
        <col style={{ width: '20%' }} />
        <col style={{ width: '70%' }} />
        <col style={{ width: '10%' }} />
      </colgroup>
    );
  }

  renderBillableNameWithStockout = ({ stockout, name }) => {
    if (isNil(name)) {
      return (<NullValue />);
    }
    if (stockout) {
      return (
        <Box flex flexDirection="column">
          <Text>{name}</Text>
          <Text fontSize={3} color="red.6" paddingTop={2}>Stockout</Text>
        </Box>
      );
    }
    return (
      <Text>{name}</Text>
    );
  };

  renderSubtotalWithStockout = ({ stockout, subtotal }) => {
    if (isNil(subtotal)) {
      return (<NullValue />);
    }
    if (stockout) {
      return (
        <Box flex flexDirection="column" justifyContent="flex-start">
          <Text>{subtotal}</Text>
          <Text fontSize={3} color="red.6" paddingTop={2}>
            {`-${subtotal}`}
          </Text>
        </Box>
      );
    }
    return (
      <Text>{subtotal}</Text>
    );
  };

  renderFooter = (encounterWithExtras, totals) => (
    <TableFooter>
      <TableRow>
        <TableCell>
          <Box flex flexDirection="column">
            <Text fontFamily="sans" paddingBottom={2} fontSize={3} color="gray.6">Total amount</Text>
            {totals.stockoutTotal > 0 && <Text fontFamily="sans" paddingBottom={2} fontSize={3} color="gray.6">Stockouts</Text>}
            {totals.bypassTotal > 0 && <Text fontFamily="sans" fontSize={3} color="gray.6">Bypass fee</Text>}
          </Box>
        </TableCell>
        <TableCell colSpan={4} align="right">
          <Box flex flexDirection="column">
            <Text fontFamily="sans" paddingBottom={2} fontSize={3}>{formatCurrency(totals.serviceTotal)}</Text>
            {totals.stockoutTotal > 0 && <Text fontFamily="sans" paddingBottom={2} fontSize={3} color="red.6">{`-${formatCurrency(totals.stockoutTotal)}`}</Text>}
            {totals.bypassTotal > 0 && <Text fontFamily="sans" fontSize={3}>{`-${formatCurrency(totals.bypassTotal)}`}</Text>}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TextTableCell color="gray.9">
          Total claimed
        </TextTableCell>
        <TextTableCell colSpan={4} align="right" color="gray.9" fontSize={5}>
          {formatCurrencyWithLabel(encounterWithExtras.reimbursalAmount)}
        </TextTableCell>
      </TableRow>
    </TableFooter>
  );

  render() {
    const { encounterWithExtras, currentUser, adjudicationIsAllowed } = this.props;
    const showFinancials = adjudicationIsAllowed
      || currentUser.providerId === encounterWithExtras.providerId;
    const tableData = getLineItems(encounterWithExtras);
    const totals = reduce((acc, i) => {
      if (isNullOrUndefined(i.subtotal)) {
        return acc;
      }
      const subtotal = removeCurrencyFormatting(i.subtotal);
      if (i.stockout) {
        return ({
          serviceTotal: acc.serviceTotal + subtotal,
          stockoutTotal: acc.stockoutTotal + subtotal,
        });
      }
      return ({ ...acc, serviceTotal: acc.serviceTotal + subtotal });
    }, { serviceTotal: 0, stockoutTotal: 0 })(tableData);
    const bypassTotal = totals.serviceTotal - encounterWithExtras.reimbursalAmount - totals.stockoutTotal;

    return (
      <>
        <Table>
          {this.renderColgroup(showFinancials)}
          <TableHead>
            <TableRow>
              <TextTableCell>Line Items</TextTableCell>
              <TextTableCell padding="none">Name</TextTableCell>
              {showFinancials && <TextTableCell align="right">Fee</TextTableCell>}
              <TextTableCell align="right">Qty.</TextTableCell>
              {showFinancials && <TextTableCell align="right">Total</TextTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((d, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={i}>
                <TextTableCell color="gray.6">{capitalize(d.type)}</TextTableCell>
                <TextTableCell padding="none">{this.renderBillableNameWithStockout(d)}</TextTableCell>
                {showFinancials && <TextTableCell align="right">{d.price || <NullValue />}</TextTableCell>}
                <TextTableCell align="right">{d.quantity || <NullValue />}</TextTableCell>
                {showFinancials && (<TextTableCell align="right">{this.renderSubtotalWithStockout(d)}</TextTableCell>)}
              </TableRow>
            ))}
          </TableBody>
          {showFinancials && this.renderFooter(encounterWithExtras, { ...totals, bypassTotal })}
        </Table>
      </>
    );
  }
}

EncounterReceipt.propTypes = {
  encounterWithExtras: encounterPropType.isRequired,
  currentUser: userPropType.isRequired,
  adjudicationIsAllowed: PropTypes.bool.isRequired,
};

export default EncounterReceipt;
