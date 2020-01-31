import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { formatCurrencyWithLabel } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';

import LoadingIndicator from 'components/loading-indicator';
import Box from 'components/box';
import Button from 'components/button';
import Divider from 'components/dividers/divider';
import Modal from 'components/modal';
import { DatePicker, TextField } from 'components/inputs';
import { Text, ViewTitle } from 'components/text';
import { Alert } from 'components/alerts';

class ReimbursementActionModal extends Component {
  constructor(props) {
    super(props);

    const { endDate, startDate } = this.props;

    const maxDate = moment.now();
    const defaultEndDate = endDate || moment.now();

    this.state = {
      minDate: formatDate(startDate),
      maxDate: formatDate(maxDate),
      defaultEndDate: formatDate(defaultEndDate),
    };
  }

  handlePrimaryClick = () => {
    const { onPrimaryClick } = this.props;
    onPrimaryClick();
  }

  handleDateChange = (formattedDate, rawDate) => {
    const { onDateUpdate } = this.props;
    this.setState({ defaultEndDate: rawDate });
    onDateUpdate(formattedDate);
  }

  renderFooter() {
    const { encounterIds, onCancel, isEdit, isPerformingAction } = this.props;

    const noClaimsSelected = encounterIds && encounterIds.length === 0;
    const disabled = isPerformingAction || noClaimsSelected;
    return (
      <>
        <Box flex alignItems="space-between" justifyContent="space-between">
          <Button small inline onClick={onCancel}>Cancel</Button>
          <Button small inline primary disabled={disabled} onClick={this.handlePrimaryClick}>{isEdit ? 'Edit' : 'Create'}</Button>
        </Box>
        {noClaimsSelected && (
          <Box marginTop={4} marginBottom={3}>
            <Alert>No claims are included in this date range.</Alert>
          </Box>
        )}
      </>
    );
  }

  render() {
    const { provider, isEdit = false, serverError, onCancel, totalPrice } = this.props;
    const { minDate, maxDate, defaultEndDate } = this.state;

    if (!provider || !minDate) {
      return (<LoadingIndicator noun="" />);
    }

    return (
      <Modal title={isEdit ? 'Edit reimbursement' : 'Create reimbursement'} onRequestClose={onCancel} footer={this.renderFooter()}>
        <Box>
          <Box marginBottom={4}>
            <TextField
              label="Provider"
              name="provider"
              value={provider.name}
              disabled
            />
          </Box>
          <Box marginBottom={4}>
            <TextField
              label="Start date"
              name="start-date"
              value={minDate}
              disabled
            />
          </Box>
          <Box marginBottom={4}>
            <DatePicker
              label="End date"
              onChange={this.handleDateChange}
              defaultDate={defaultEndDate}
              minDate={minDate}
              maxDate={maxDate}
              name="end-date"
            />
          </Box>
        </Box>
        <Divider />
        <Box flex justifyContent="flex-end" alignItems="flex-end" marginTop={4}>
          <Box marginRight={2} paddingBottom={1}>
            <Text>Total:</Text>
          </Box>
          <Box>
            <ViewTitle>{formatCurrencyWithLabel(totalPrice)}</ViewTitle>
          </Box>
        </Box>
        {serverError && (
          <Box marginTop={4} marginBottom={3}>
            <Alert>An unknown error occurred. Please refresh the page and try again.</Alert>
          </Box>
        )}
      </Modal>
    );
  }
}

ReimbursementActionModal.propTypes = {
  encounterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  endDate: PropTypes.string,
  isEdit: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func.isRequired,
  onDateUpdate: PropTypes.func.isRequired,
  provider: PropTypes.shape({}).isRequired,
  serverError: PropTypes.bool.isRequired,
  startDate: PropTypes.string.isRequired,
  isPerformingAction: PropTypes.bool,
  totalPrice: PropTypes.number,
};

ReimbursementActionModal.defaultProps = {
  endDate: null,
  isEdit: false,
  isPerformingAction: false,
  totalPrice: 0,
};
export default ReimbursementActionModal;
