import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isEmpty, find } from 'lodash/fp';

import { userHasPermissionSetFromList } from 'lib/auth-utils';
import { titleCase } from 'lib/string-utils';
import {
  ROLE_PERMISSIONS,
  claimsReimbursementPermissions,
  reimbursementsViewOnlyPermissions,
} from 'lib/config';
import { formatShortId } from 'lib/formatters';
import { formatDate } from 'lib/formatters/date';
import { isNullOrUndefined } from 'util';

import { UnderlinedLink } from 'components/links';
import { Text } from 'components/text';
import { MetadataList, MetadataItem } from 'components/list';

class ClaimTimeline extends Component {
  renderUnlinkedOutboundReferral() {
    const { outboundReferralDetails } = this.props;

    if (outboundReferralDetails.isFollowUp) {
      return (<Text>Follow-up requested, no claim matched.</Text>);
    }

    return (<Text>Patient was referred, no claim matched.</Text>);
  }

  renderLinkedOutboundReferral() {
    const { outboundReferralDetails } = this.props;
    const { receivingEncounterId, receivingFacility, isFollowUp } = outboundReferralDetails;

    // For outbound referrals we shouldn't be showing the claim information at another facility
    // however since a follow-up is in the same facility we can show a link
    if (isFollowUp) {
      return (
        <>
          <Text>Follow-up requested. See claim </Text>
          <UnderlinedLink newTab to={`/claims/${receivingEncounterId}`}>
            {formatShortId(receivingEncounterId)}
          </UnderlinedLink>
        </>
      );
    }

    return (
      <Text>
        {'Patient referred to '}
        <b>{`${receivingFacility}`}</b>
      </Text>
    );
  }

  renderLinkedInboundReferral() {
    const { inboundReferralDetails } = this.props;
    const { encounterId, sendingFacility, isFollowUp } = inboundReferralDetails;

    let component = (
      <Text>
        {'Patient referred from  '}
        <b>{`${sendingFacility}`}</b>
        {'. See claim '}
      </Text>
    );

    if (isFollowUp) {
      component = (<Text>Follow-up requested. See claim </Text>);
    }

    return (
      <>
        {component}
        <UnderlinedLink newTab to={`/claims/${encounterId}`}>
          {formatShortId(encounterId)}
        </UnderlinedLink>
      </>
    );
  }

  renderReimbursement(currentEncounter, isCompleted) {
    const { user } = this.props;
    const currentUserPermissions = ROLE_PERMISSIONS[user.role];
    const text = isCompleted ? 'Claim reimbursed ' : 'Claim pending reimbursement ';
    const reimbursementPermissions = [reimbursementsViewOnlyPermissions, claimsReimbursementPermissions];
    return (
      <>
        <Text>{text}</Text>
        {userHasPermissionSetFromList(currentUserPermissions, reimbursementPermissions) ? (
          <UnderlinedLink to={`/reimbursements/created/${currentEncounter.reimbursementId}`}>
            {`(${formatShortId(currentEncounter.reimbursementId)})`}
          </UnderlinedLink>
        ) : (
          <Text>{`(${formatShortId(currentEncounter.reimbursementId)})`}</Text>
        )}
      </>
    );
  }

  renderUserAction = (user, text, comment) => (
    <>
      <Text fontWeight="medium">{user}</Text>
      {text}
      {comment && <Comment>{comment}</Comment>}
    </>
  );

  render() {
    const {
      claimEncounters,
      encounterId,
      inboundReferralDetails,
      outboundReferralDetails,
    } = this.props;
    const currentEncounter = find(e => e.id === encounterId)(claimEncounters);
    const reimbursementCreated = !isNullOrUndefined(currentEncounter.reimbursementCreatedAt);
    const reimbursementCompleted = !isNullOrUndefined(currentEncounter.reimbursementCompletedAt);

    const hasLinkedOutboundReferral = outboundReferralDetails && outboundReferralDetails.receivingEncounterId;
    const hasLinkedInboundReferral = currentEncounter.inboundReferralDate && !isEmpty(inboundReferralDetails);

    return (
      <MetadataList>
        {!hasLinkedInboundReferral && currentEncounter.inboundReferralDate && (
          <MetadataItem label={formatDate(currentEncounter.inboundReferralDate)} value="Patient was referred, no claim matched." />
        )}
        {hasLinkedInboundReferral && (
          <MetadataItem
            label={formatDate(currentEncounter.inboundReferralDate)}
            value={this.renderLinkedInboundReferral()}
          />
        )}
        <MetadataItem label={formatDate(currentEncounter.occurredAt)} value="Patient received service" />
        {claimEncounters.map((e) => {
          const auditBeforeAdjudication = e.auditedAt && (e.adjudicatedAt === null || e.adjudicatedAt > e.auditedAt);

          let formattedAdjudicationReason = null;
          if (e.adjudicationComment && e.adjudicationReasonCategory) {
            formattedAdjudicationReason = `${titleCase(e.adjudicationReasonCategory)} - ${e.adjudicationComment}`;
          } else if (e.adjudicationComment) {
            formattedAdjudicationReason = e.adjudicationComment;
          } else if (e.adjudicationReasonCategory) {
            formattedAdjudicationReason = e.adjudicationReasonCategory;
          }

          return (
            <Fragment key={e.id}>
              <MetadataItem
                label={formatDate(e.submittedAt)}
                value={this.renderUserAction(e.submitterName, `${e.revisedEncounterId ? ' resubmitted' : ' submitted'} the claim`, e.providerComment)}
                rightAlignedAction={e.id !== encounterId && <UnderlinedLink newTab to={`/claims/${e.id}`}>View submission</UnderlinedLink>}
              />
              {auditBeforeAdjudication && (
                <MetadataItem
                  label={formatDate(e.auditedAt)}
                  value={this.renderUserAction(e.auditorName, ' marked the claim for audit')}
                />
              )}
              {e.adjudicatedAt && (
                <MetadataItem
                  label={formatDate(e.adjudicatedAt)}
                  value={this.renderUserAction(e.adjudicatorName, ` marked the claim as ${e.adjudicationState === 'revised' ? ' returned' : e.adjudicationState}`, formattedAdjudicationReason)}
                />
              )}
              {e.auditedAt && !auditBeforeAdjudication && (
                <MetadataItem
                  label={formatDate(e.auditedAt)}
                  value={this.renderUserAction(e.auditorName, ' marked the claim for audit')}
                />
              )}

            </Fragment>
          );
        })}
        {!hasLinkedOutboundReferral && !isEmpty(outboundReferralDetails) && (
          <MetadataItem label={formatDate(currentEncounter.occurredAt)} value={this.renderUnlinkedOutboundReferral()} />
        )}
        {hasLinkedOutboundReferral && (
          <MetadataItem label={formatDate(currentEncounter.occurredAt)} value={this.renderLinkedOutboundReferral()} />
        )}
        {reimbursementCompleted && (
          <MetadataItem
            label={formatDate(currentEncounter.reimbursementCompletedAt)}
            value={this.renderReimbursement(currentEncounter, true)}
          />
        )}
        {(reimbursementCreated && !reimbursementCompleted) && (
          <MetadataItem
            label={formatDate(currentEncounter.reimbursementCreatedAt)}
            value={this.renderReimbursement(currentEncounter, false)}
          />
        )}
      </MetadataList>
    );
  }
}

export default ClaimTimeline;

ClaimTimeline.propTypes = {
  user: PropTypes.shape({}).isRequired,
  claimEncounters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  inboundReferralDetails: PropTypes.shape({}),
  outboundReferralDetails: PropTypes.shape({}),
  followUpDetails: PropTypes.shape({}),
  encounterId: PropTypes.string.isRequired,
};

ClaimTimeline.defaultProps = {
  inboundReferralDetails: {},
  outboundReferralDetails: {},
  followUpDetails: {},
};

const Comment = styled.p`
  border-left: 0.15em solid ${props => props.theme.colors.gray[3]};
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
`;
