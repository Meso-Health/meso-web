import React from 'react';
import PropTypes from 'prop-types';
import { isNil, map, startCase, sum, toPairs, values } from 'lodash/fp';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { formatNumber } from 'lib/formatters';
import { formatCurrency, formatCurrencyWithLabel } from 'lib/formatters/currency';

import Box from 'components/box';
import Divider from 'components/dividers/divider';
import LargeStatsDisplay from 'components/large-stats-display';
import { TextTableCell } from 'components/table';

import LoadingIndicator from 'components/loading-indicator';

const EnrollmentReportingStatsDisplay = ({ isLoading, members, beneficiaries, membershipPayment }) => {
  if (isLoading) {
    return <LoadingIndicator noun="stat" />;
  }
  const paymentTotal = sum(values(membershipPayment));
  const stats = [
    { label: 'Members', value: formatNumber(members) },
    { label: 'Beneficiaries', value: formatNumber(beneficiaries) },
    { label: 'Payment', value: formatCurrencyWithLabel(paymentTotal) },
  ];
  const paymentInfo = map(pair => ({
    key: startCase(pair[0]),
    value: isNil(pair[1]) ? '-' : formatCurrency(pair[1]),
  }))(toPairs(membershipPayment));

  return (
    <Box marginTop={5}>
      <LargeStatsDisplay stats={stats} />
      <Box marginTop={5} marginBottom={3}>
        <Divider />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TextTableCell>Payment Type</TextTableCell>
            <TextTableCell>Amount</TextTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentInfo.map(row => (
            <TableRow key={row.key}>
              <TextTableCell>{row.key}</TextTableCell>
              <TextTableCell>{row.value}</TextTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default EnrollmentReportingStatsDisplay;

EnrollmentReportingStatsDisplay.propTypes = {
  beneficiaries: PropTypes.number,
  isLoading: PropTypes.bool,
  members: PropTypes.number,
  membershipPayment: PropTypes.shape({
    annualContribution: PropTypes.number,
    registrationFee: PropTypes.number,
    additionalMembers: PropTypes.number,
    cardReplacementFee: PropTypes.number,
    penalty: PropTypes.number,
    otherFees: PropTypes.number,
  }),
};

EnrollmentReportingStatsDisplay.defaultProps = {
  beneficiaries: null,
  isLoading: false,
  members: null,
  membershipPayment: null,
};
