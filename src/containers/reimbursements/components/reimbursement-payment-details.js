import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from 'lib/formatters/date';
import { objectHasProp } from 'lib/utils';

import Box from 'components/box';
import DetailSection from 'components/detail-section';
import { MetadataList, MetadataItem } from 'components/list';

const ReimbursementPaymentDetails = ({ paymentDetails, paymentDate }) => {
  const paymentDateForDisplay = formatDate(paymentDate);

  const isBankTransfer = objectHasProp(paymentDetails, 'bankTransferNumber');
  let detailItems;
  if (isBankTransfer) {
    detailItems = [
      { label: 'Bank Transfer Date', value: paymentDateForDisplay },
      { label: 'Bank Transfer No.', value: paymentDetails.bankTransferNumber },
      { label: 'Bank Name', value: paymentDetails.bankName },
      { label: 'Bank Account No.', value: paymentDetails.bankAccountNumber },
      { label: 'Payer\'s Account No.', value: paymentDetails.payerBankAccountNumber },
      { label: 'Authorized By', value: paymentDetails.bankApproverName },
      { label: 'Internal Voucher No.', value: paymentDetails.bankInternalVoucherNumber },
    ];
  } else {
    detailItems = [
      { label: 'Check Date', value: paymentDateForDisplay },
      { label: 'Check No.', value: paymentDetails.checkNumber },
      { label: 'Designated Person', value: paymentDetails.designatedPerson },
      { label: 'Authorized By', value: paymentDetails.checkApproverName },
      { label: 'Internal Voucher No.', value: paymentDetails.checkInternalVoucherNumber },
    ];
  }
  return (
    <Box marginTop={6} paddingTop={4}>
      <Box marginBottom={4}>
        {isBankTransfer
          ? <h2 fontSize={3}>Bank Transfer Details</h2>
          : <h2 fontSize={3}>Check Details</h2>}
      </Box>
      <DetailSection>
        <MetadataList>
          {detailItems.map(({ label, value }) => (<MetadataItem key={label} label={label} value={value} />))}
        </MetadataList>
      </DetailSection>
    </Box>
  );
};

ReimbursementPaymentDetails.propTypes = {
  paymentDate: PropTypes.string.isRequired,
  paymentDetails: PropTypes.shape({}).isRequired,
};

export default ReimbursementPaymentDetails;
