import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { validators, validateField } from 'lib/validations';
import { snakeCaseObject, isObjectEmpty } from 'lib/utils';
import { formatDate } from 'lib/formatters/date';

import Modal from 'components/modal';
import { TabLinks, TabLink } from 'components/tabs';
import Pill from 'components/pill';
import Box from 'components/box';
import { DatePicker, TextField } from 'components/inputs';
import { Label } from 'components/text';
import Button from 'components/button';
import { Alert } from 'components/alerts';

const EMPTY_VALUE = -1;
const CHECK_PAYMENT = 'check';
const BANK_PAYMENT = 'bank';

const BANK_FIELDS = [
  { name: 'bankTransferId', label: 'Transfer ID' },
  { name: 'bankName', label: 'Bank name / routing number' },
  { name: 'bankAccountNumber', label: 'Bank Account #' },
];

const CHECK_FIELDS = [
  { name: 'checkNumber', label: 'Check number' },
];

// sets empty initial values on fields
const emptyFieldsReducer = (emptyFields, field) => {
  const newEmptyFields = emptyFields;
  newEmptyFields[field.name] = '';
  return newEmptyFields;
};

const EMPTY_BANK_FIELDS = BANK_FIELDS.reduce(emptyFieldsReducer, {});
const EMPTY_CHECK_FIELDS = CHECK_FIELDS.reduce(emptyFieldsReducer, {});

export default class ReimbursementPaymentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTabKey: BANK_PAYMENT,
      paymentDate: EMPTY_VALUE,
      bankTransferFields: EMPTY_BANK_FIELDS,
      checkFields: EMPTY_CHECK_FIELDS,
      bankTransferErrors: EMPTY_BANK_FIELDS,
      checkErrors: EMPTY_CHECK_FIELDS,
      displayServerError: false,
    };
  }

  handleDateChange = (paymentDate) => {
    this.setState({ paymentDate });
  }

  handleTabLinkClick = (tabKey) => {
    this.setState({
      activeTabKey: tabKey,
      paymentDate: EMPTY_VALUE,
    });
  }

  handleFieldChange = (e, paymentType) => {
    const { bankTransferFields, checkFields } = this.state;

    if (paymentType === BANK_PAYMENT) {
      this.setState({
        bankTransferFields: { ...bankTransferFields, [e.target.name]: e.target.value },
      });
    } else if (paymentType === CHECK_PAYMENT) {
      this.setState({
        checkFields: { ...checkFields, [e.target.name]: e.target.value },
      });
    }
  }

  handleCancelClick = () => {
    const { onCancel } = this.props;
    onCancel();
    this.setState({
      activeTabKey: BANK_PAYMENT,
      bankTransferFields: EMPTY_BANK_FIELDS,
      checkFields: EMPTY_CHECK_FIELDS,
      bankTransferErrors: EMPTY_BANK_FIELDS,
      checkErrors: EMPTY_CHECK_FIELDS,
      displayServerError: false,
    });
  }

  handleFieldErrors = (callback) => {
    const { activeTabKey, bankTransferFields, checkFields, bankTransferErrors, checkErrors } = this.state;

    if (activeTabKey === BANK_PAYMENT) {
      this.setState({
        bankTransferErrors: {
          ...bankTransferErrors,
          // all fields can support alphanumber values
          bankTransferId: validateField(validators.name, bankTransferFields.bankTransferId, null),
          bankName: validateField(validators.name, bankTransferFields.bankName, null),
          bankAccountNumber: validateField(validators.name, bankTransferFields.bankAccountNumber, null),
        },
      }, callback);
    } else if (activeTabKey === CHECK_PAYMENT) {
      this.setState({
        checkErrors: {
          ...checkErrors,
          checkNumber: validateField(validators.number, checkFields.checkNumber, null),
          checkApproverName: validateField(validators.name, checkFields.checkApproverName, null),
        },
      }, callback);
    }
  }

  resolveUpdate = (action) => {
    if (action.errorMessage) {
      this.setState({ displayServerError: true });
    } else {
      this.handleCancelClick();
    }
  }

  sendPaymentUpdateRequest = () => {
    const {
      activeTabKey,
      bankTransferFields,
      checkFields,
      bankTransferErrors,
      checkErrors,
      paymentDate,
    } = this.state;

    const { reimbursementId, updateReimbursement } = this.props;
    const noFieldErrors = activeTabKey === BANK_PAYMENT
      ? isObjectEmpty(bankTransferErrors)
      : isObjectEmpty(checkErrors);
    const paymentField = activeTabKey === BANK_PAYMENT ? bankTransferFields : checkFields;

    if (noFieldErrors) {
      const reimbursementChanges = {
        id: reimbursementId,
        paymentDate,
        paymentField,
      };

      updateReimbursement(snakeCaseObject(reimbursementChanges)).then((action) => {
        this.resolveUpdate(action);
      });
    }
  }

  handleSubmitClick = () => {
    this.handleFieldErrors(this.sendPaymentUpdateRequest);
  }

  renderPaymentDateField = (minDate, maxDate) => {
    const { activeTabKey } = this.state;
    const dateLabel = activeTabKey === BANK_PAYMENT ? 'Transfer date' : 'Check issued date';
    const fieldName = 'payment-date';

    return (
      <Box>
        <Box marginBottom={3}>
          <Label fontSize={3} fontWeight="medium" htmlFor={fieldName}>{dateLabel}</Label>
        </Box>
        <Box marginBottom={4}>
          <DatePicker onChange={this.handleDateChange} minDate={minDate} maxDate={maxDate} name={fieldName} />
        </Box>
      </Box>
    );
  }

  renderTextFields = () => {
    const { activeTabKey, bankTransferFields, bankTransferErrors, checkFields, checkErrors } = this.state;
    const fields = activeTabKey === BANK_PAYMENT ? BANK_FIELDS : CHECK_FIELDS;
    const fieldValues = activeTabKey === BANK_PAYMENT ? bankTransferFields : checkFields;
    const errors = activeTabKey === BANK_PAYMENT ? bankTransferErrors : checkErrors;

    return (
      <Box>
        {fields.map(field => (
          <Box marginBottom={4} key={field.name}>
            <TextField
              value={fieldValues[field.name]}
              label={field.label}
              name={field.name}
              onChange={e => this.handleFieldChange(e, activeTabKey)}
              error={errors[field.name]}
            />
          </Box>
        ))}
      </Box>
    );
  }

  renderFooter() {
    const { paymentDate } = this.state;
    const disabled = paymentDate === EMPTY_VALUE;

    return (
      <Box flex alignItems="space-between" justifyContent="space-between">
        <Button small inline onClick={this.handleCancelClick}>Cancel</Button>
        <Button small inline primary disabled={disabled} onClick={this.handleSubmitClick}>Submit and complete</Button>
      </Box>
    );
  }

  render() {
    const {
      activeTabKey,
      displayServerError,
    } = this.state;
    const { reimbursementEndDate } = this.props;

    return (
      <Modal title="Add payment info" onRequestClose={this.handleCancelClick} footer={this.renderFooter()}>
        <Box paddingTop={3} paddingBottom={5}>
          <TabLinks activeTabKey={activeTabKey} onTabLinkClick={this.handleTabLinkClick}>
            <TabLink tabKey={BANK_PAYMENT}><Pill>Bank Transfer</Pill></TabLink>
            <TabLink tabKey={CHECK_PAYMENT}><Pill>Check</Pill></TabLink>
          </TabLinks>
        </Box>
        {this.renderPaymentDateField(formatDate(reimbursementEndDate), formatDate(moment.now()))}
        {this.renderTextFields()}
        {displayServerError && (
          <Box marginBottom={4}>
            <Alert>An unknown error occurred. Please refresh the page and try again.</Alert>
          </Box>
        )}
      </Modal>
    );
  }
}

ReimbursementPaymentModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  reimbursementEndDate: PropTypes.string.isRequired,
  reimbursementId: PropTypes.string.isRequired,
  updateReimbursement: PropTypes.func.isRequired,
};
