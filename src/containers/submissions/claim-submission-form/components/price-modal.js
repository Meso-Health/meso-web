import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import moment from 'moment';

import { isFinite } from 'lodash/fp';

import { BILLABLE_TYPES } from 'lib/config';
import { formatCurrency } from 'lib/formatters/currency';

import Box from 'components/box';
import Button from 'components/button';
import Icon from 'components/icon';
import { Text } from 'components/text';
import Modal from 'components/modal';
import { TextField, CurrencyInput } from 'components/inputs';
import { Divider } from 'components/dividers';

class PriceModal extends Component {
  constructor(props) {
    super(props);
    const { quantity, priceSchedule, originalPriceSchedule, stockout } = props.encounterItem;
    const originalPrice = originalPriceSchedule.price;
    this.state = {
      originalPrice,
      newPrice: priceSchedule.price,
      newQuantity: quantity,
      stockout,
    };
  }

  handleBlur = (value) => {
    // if value is empty or not an integer we are setting quantity to 1 by default
    if (value.length === 0
        || parseInt(value, 10) === 0
        || !isFinite(parseInt(value, 10))) {
      this.handleQuantityChange(1);
    }
  }

  handlePriceChange = (price) => {
    this.setState({ newPrice: price });
  }

  handleQuantityChange = (quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    if (isFinite(parsedQuantity) || quantity.length === 0) {
      const newQuantity = isFinite(parsedQuantity) ? parsedQuantity : quantity;
      this.setState({ newQuantity });
    }
  }

  handleSave = () => {
    const { newPrice, newQuantity, stockout } = this.state;
    const { onSave, encounterItem, onClose } = this.props;
    const updates = {};
    let hasUpdates = false;

    if (newPrice !== encounterItem.priceSchedule.price) {
      // if the price is different, update encounterItem to point to a new price schedule.
      const { originalPriceSchedule } = encounterItem;

      // If price is the same as the original price, just set it back to the old price schedule.
      // Otherwise, create a new price schedule.
      if (originalPriceSchedule.price === newPrice) {
        updates.priceSchedule = originalPriceSchedule;
        updates.priceScheduleId = originalPriceSchedule.id;
        updates.priceScheduleIssued = false;
      } else {
        const newPriceSchedule = {
          id: uuid(),
          previousPriceScheduleId: originalPriceSchedule.id,
          billableId: originalPriceSchedule.billableId,
          providerId: originalPriceSchedule.providerId,
          price: newPrice,
          issuedAt: moment(),
        };
        updates.priceSchedule = newPriceSchedule;
        updates.priceScheduleId = newPriceSchedule.id;
        updates.priceScheduleIssued = true;
      }
      hasUpdates = true;
    }

    if (newQuantity !== encounterItem.quantity) {
      updates.quantity = newQuantity;
      hasUpdates = true;
    }

    if (stockout !== encounterItem.stockout) {
      updates.stockout = stockout;
      hasUpdates = true;
    }

    if (hasUpdates) {
      onSave(updates);
    }
    onClose();
  }

  renderFooter() {
    const { onClose, onDelete } = this.props;

    return (
      <Box flex alignItems="space-between" justifyContent="space-between">
        <Box flex>
          <Box marginRight={2}>
            <Button small inline primaryRed onClick={onDelete}>Delete</Button>
          </Box>
          <Box>
            <Button small inline onClick={onClose}>Cancel</Button>
          </Box>
        </Box>
        <Button small inline primary onClick={this.handleSave}>Save</Button>
      </Box>
    );
  }

  render() {
    const { onClose, encounterItem } = this.props;
    const { newPrice, newQuantity, stockout, originalPrice } = this.state;
    const { billable } = encounterItem;
    const canStockout = [
      BILLABLE_TYPES.drug.key,
      BILLABLE_TYPES.lab.key,
      BILLABLE_TYPES.imaging.key,
    ].includes(billable.type);

    const disablePriceChange = ![
      BILLABLE_TYPES.drug.key,
      BILLABLE_TYPES.lab.key,
      BILLABLE_TYPES.imaging.key,
      BILLABLE_TYPES.bed_day.key,
    ].includes(billable.type);
    return (
      <Modal title="Edit Fee" onRequestClose={onClose} footer={this.renderFooter()}>
        <Box flex marginTop={-4} flexDirection="column">
          <Text>{billable.name}</Text>
          <Box flex justifyContent="space-between">
            <Box>
              {billable.unit && <Text color="gray.5">{billable.unit}</Text>}
              {billable.composition && <Text color="gray.5">{` ${billable.composition}`}</Text>}
            </Box>
            <Box flex alignItems="center">
              <Text paddingRight={2} color="gray.5">{formatCurrency(originalPrice * encounterItem.quantity)}</Text>
              <Icon name="direct-right" size={9} iconSize={9} />
              <Text paddingLeft={2}>{formatCurrency(newPrice * newQuantity)}</Text>
            </Box>
          </Box>
        </Box>
        <Divider marginHorizontal="-32" marginBottom={4} marginTop={4} />
        <Box flex>
          <Box padding={2} width="33%">
            <CurrencyInput
              name="unit-price"
              label="Unit Fee"
              disabled={disablePriceChange}
              onChange={this.handlePriceChange}
              value={newPrice}
              defaultValue={originalPrice}
            />
          </Box>
          <Box padding={2} width="33%">
            <TextField
              name="quantity"
              onBlur={e => this.handleBlur(e.target.value)}
              onChange={e => this.handleQuantityChange(e.target.value)}
              label="Quantity"
              value={newQuantity}
            />
          </Box>
          <Box padding={2} width="33%">
            <TextField name="total" readOnly disabled label="Total" value={formatCurrency(newPrice * newQuantity)} />
          </Box>
        </Box>
        {canStockout && (
          <Box flex marginTop={4}>
            <label htmlFor="stockout">
              <input type="checkbox" name="stockout" checked={stockout} onChange={() => this.setState({ stockout: !stockout })} />
              <Text onClick={() => this.setState({ stockout: !stockout })}>Mark as stockout</Text>
            </label>
          </Box>
        )}
      </Modal>
    );
  }
}

export default PriceModal;

PriceModal.propTypes = {
  encounterItem: PropTypes.shape({}).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
