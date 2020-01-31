import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash/fp';

import { ADJUDICATION_STATES } from 'lib/config';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { withFilter, withApiPagination, withApiSorting, TableCell, TextTableCell } from 'components/table';
import { Text } from 'components/text';
import { formatShortId } from 'lib/formatters';
import { formatCurrency } from 'lib/formatters/currency';
import { formatDate } from 'lib/formatters/date';
import ClaimIcon from 'components/claim-icon';
import Icon from 'components/icon';
import Box from 'components/box';

const ClaimsTable = ({
  data, adjudicationState, onClickRow, onSortChange, sortField, sortDirection,
}) => {
  const hasData = data && data.length > 0;
  const cols = [
    { id: 'claimId', label: 'Claim ID', alignLeft: true, padding: false, sortable: true },
    { id: 'reimbursalAmount', label: 'Amount', alignLeft: false, padding: false, sortable: true },
    { id: 'visitType', label: 'Visit Type', alignLeft: true, padding: false, sortable: true },
    {
      id: `${adjudicationState === ADJUDICATION_STATES.PENDING ? 'occurredAt' : 'adjudicatedAt'}`,
      label: `${adjudicationState === ADJUDICATION_STATES.PENDING ? 'Serviced' : capitalize(adjudicationState)}`,
      alignLeft: false,
      padding: false,
      sortable: true,
    },
    { id: 'flag', label: '', alignLeft: false, padding: false, sortable: false },
    { id: 'submittedAt', label: 'Submitted', alignLeft: false, padding: false, sortable: true },
  ];

  return (
    <>
      <Table>
        <colgroup>
          <col style={{ width: '12%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '24%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '17%' }} />
        </colgroup>
        <TableHead>
          <TableRow>
            {cols.map(col => (
              <TableCell
                key={col.id}
                sortDirection={sortField === col.id ? sortDirection : false}
                align={col.alignLeft ? 'left' : 'right'}
              >
                {col.sortable && (
                  <TableSortLabel
                    active={sortField === col.id}
                    direction={sortDirection}
                    onClick={() => onSortChange(col.id)}
                  >
                    <Text fontSize={3} fontFamily="sans">{col.label}</Text>
                  </TableSortLabel>
                )}
                {!col.sortable && <Text fontSize={3} fontFamily="sans">{col.label}</Text>}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!hasData && <TableRow><TextTableCell align="center" colSpan={6}>No data available</TextTableCell></TableRow>}
          {hasData && data.map((r) => {
            const toolTipTitle = (r.originallySubmittedAt && r.originallySubmittedAt !== r.submittedAt) ? `Originally submitted: ${formatDate(r.originallySubmittedAt)}` : null;
            const UnconfirmedIcon = React.forwardRef((props, ref) => <Icon {...props} ref={ref} name="unconfirmed-member" size={15} iconSize={15} />);
            const InactiveMemberIcon = React.forwardRef((props, ref) => <Icon {...props} ref={ref} name="inactive-member" size={15} iconSize={15} />);
            const UnlinkedReferralIcon = React.forwardRef((props, ref) => <Icon {...props} ref={ref} name="unlinked-referral" size={15} iconSize={15} />);
            const ToolTipTableCell = React.forwardRef((props, ref) => <TextTableCell {...props} forwardRef={ref} align="right">{formatDate(r.submittedAt)}</TextTableCell>);

            return (
              <TableRow key={r.id} style={{ height: 'auto', paddingTop: 8, paddingBottom: 8 }} onClick={() => onClickRow(`/claims/${r.id}`)} hover>
                <TableCell>
                  <ClaimIcon claim={{ ...r, shortClaimId: formatShortId(r.claimId) }} indicator={r.indicator} />
                </TableCell>
                <TextTableCell align="right">{formatCurrency(r.reimbursalAmount)}</TextTableCell>
                <TextTableCell>{r.visitType}</TextTableCell>
                <TextTableCell align="right">{adjudicationState === ADJUDICATION_STATES.PENDING ? formatDate(r.occurredAt) : formatDate(r.adjudicatedAt)}</TextTableCell>
                <TableCell>
                  <Box flex flexDirection="row" alignItems="center" justifyContent="flex-end">
                    {r.memberUnconfirmed && (
                      <Box paddingLeft={10}>
                        <Tooltip title="Claim submitted for unconfirmed member (via manual entry).">
                          <UnconfirmedIcon />
                        </Tooltip>
                      </Box>
                    )}
                    {r.memberInactiveAtTimeOfService && (
                      <Box paddingLeft={10}>
                        <Tooltip title="Claim submitted for expired (or deleted) member.">
                          <InactiveMemberIcon />
                        </Tooltip>
                      </Box>
                    )}
                    {r.inboundReferralUnlinked && (
                      <Box paddingLeft={10}>
                        <Tooltip title="Claim has an inbound referral that has not been linked yet.">
                          <UnlinkedReferralIcon />
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                {toolTipTitle ? (
                  <Tooltip title={toolTipTitle} placement="right">
                    <ToolTipTableCell />
                  </Tooltip>
                ) : (
                  <TextTableCell align="right">{formatDate(r.submittedAt)}</TextTableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default withFilter(withApiSorting((withApiPagination(ClaimsTable))));
// NB: order here matters pagination should always be inner most and filter outer most

ClaimsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // TODO make shape
  adjudicationState: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onClickRow: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};
