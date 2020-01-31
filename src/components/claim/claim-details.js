import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash/fp';

import { PATIENT_OUTCOMES, PROVIDER_TYPES, REASONS_FOR_VISIT, REFERRAL_REASONS } from 'lib/config';

import theme from 'styles/theme';
import { formatGender, formatShortId, formatStringArray } from 'lib/formatters';
import { formatDate } from 'lib/formatters/date';

import Box from 'components/box';
import { userSelector } from 'store/auth/auth-selectors';
import {
  claimEncountersSelector,
  memberByEncounterIdSelector,
  recentClaimsByEncounterIdSelector,
  providerByClaimIdSelector,
  inboundReferralDetailsSelector,
  outboundReferralDetailsSelector,
  encounterWithExtrasByIdSelector,
} from 'store/encounters/encounters-selectors';
import { encounterPropType, providerPropType, memberPropType, userPropType } from 'store/prop-types';

import ClaimTimeline from 'components/claim/claim-timeline';
import DetailHeader from 'components/detail-header';
import { BirthdateItem, MetadataList, MetadataItem } from 'components/list';
import LargeClaimIcon from 'containers/claims/components/large-claim-icon';
import DetailSection from 'components/detail-section';
import ServiceDetailHeader from 'containers/claims/components/service-detail-header';
import EncounterReceipt from 'containers/claims/components/encounter-receipt';
import MembershipStatusAlert from 'components/member/membership-status-alert';
import RecentClaimsList from 'containers/claims/components/recent-claims-list';

class ClaimDetails extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { encounterId } = ownProps;
    return {
      member: memberByEncounterIdSelector(state, encounterId),
      currentEncounterWithExtras: encounterWithExtrasByIdSelector(state, encounterId),
      claimEncounters: claimEncountersSelector(state, encounterId),
      recentClaims: recentClaimsByEncounterIdSelector(state, encounterId),
      currentUser: userSelector(state),
      provider: providerByClaimIdSelector(state, encounterId),
      inboundReferralDetails: inboundReferralDetailsSelector(state, encounterId),
      outboundReferralDetails: outboundReferralDetailsSelector(state, encounterId),
    };
  }

  handleRowClick = (route) => {
    window.open(route, '_blank');
  }

  renderReferralDetails() {
    const { outboundReferralDetails } = this.props;
    if (!outboundReferralDetails || isEmpty(outboundReferralDetails)) {
      return null;
    }
    let title = 'Referral Details';
    let items = [
      { label: 'Referring to', value: outboundReferralDetails.receivingFacility },
      { label: 'Reason', value: REFERRAL_REASONS[outboundReferralDetails.reason] },
      { label: 'Date', value: formatDate(outboundReferralDetails.date) },
      { label: 'Referral Number', value: outboundReferralDetails.number },
    ];
    if (outboundReferralDetails.isFollowUp) {
      title = 'Follow-up Details';
      items = [
        { label: 'Date', value: formatDate(outboundReferralDetails.date) },
        { label: 'Follow-up Number', value: outboundReferralDetails.number },
      ];
    }

    return (
      <DetailSection title={title}>
        <MetadataList>
          {items.map(({ label, value }) => (<MetadataItem key={label} label={label} value={value} />))}
        </MetadataList>
      </DetailSection>
    );
  }

  render() {
    const {
      currentUser,
      currentEncounterWithExtras,
      claimEncounters,
      member,
      provider,
      recentClaims,
      inboundReferralDetails,
      outboundReferralDetails,
      encounterId,
      adjudicationIsAllowed,
    } = this.props;
    const isHealthCenter = provider && provider.providerType === PROVIDER_TYPES.HEALTH_CENTER;
    const medicalRecordNumber = member.medicalRecordNumbers && member.medicalRecordNumbers[provider && provider.id];
    const claimDiagnosesNames = formatStringArray(currentEncounterWithExtras.diagnoses.map(d => d.description));
    const reasonForVisit = currentEncounterWithExtras.visitReason
      ? REASONS_FOR_VISIT[currentEncounterWithExtras.visitReason].label
      : null;
    return (
      <>
        <MembershipStatusAlert encounter={currentEncounterWithExtras} />
        <DetailHeader
          icon={(
            <LargeClaimIcon
              adjudicationState={currentEncounterWithExtras.adjudicationState || 'draft'}
              reimbursementId={currentEncounterWithExtras.reimbursementId}
            />
          )}
          title={`Claim ${formatShortId(currentEncounterWithExtras.claimId)}`}
          subtitle={`${provider && provider.name}`}
        />
        <DetailSection title="History">
          <ClaimTimeline
            user={currentUser}
            claimEncounters={claimEncounters}
            encounterId={encounterId}
            inboundReferralDetails={inboundReferralDetails}
            outboundReferralDetails={outboundReferralDetails}
          />
        </DetailSection>
        <DetailSection title="Member Information">
          <MetadataList>
            <MetadataItem label="Beneficiary ID" value={member.membershipNumber} />
            <MetadataItem label="Gender" value={formatGender(member.gender)} />
            <BirthdateItem member={member} />
            <MetadataItem label="Medical Record Number" value={medicalRecordNumber} />
            {!isHealthCenter && <MetadataItem label="Reason for Visit" value={reasonForVisit} />}
            <MetadataItem label="Recent Claims" value={<RecentClaimsList data={recentClaims} onClickRow={this.handleRowClick} rowsPerPage={10} />} />
          </MetadataList>
        </DetailSection>
        <DetailSection title="Service Details">
          <Box
            border={`1px ${theme.colors.gray[2]} solid`}
            borderRadius="4px"
            flex
            flexDirection="column"
          >
            <Box
              paddingTop={5}
              paddingHorizontal={5}
              flex
              flexDirection="row"
              justifyContent="space-between"
            >
              <ServiceDetailHeader headerText="Diagnoses" value={claimDiagnosesNames} first />
              <ServiceDetailHeader headerText="Visit Type" value={currentEncounterWithExtras.visitType} />
              <ServiceDetailHeader
                headerText="Outcome"
                value={PATIENT_OUTCOMES[currentEncounterWithExtras.patientOutcome]}
                alignRight
              />
            </Box>
            <Box padding={5} flex flexDirection="column">
              <EncounterReceipt
                encounterWithExtras={currentEncounterWithExtras}
                currentUser={currentUser}
                adjudicationIsAllowed={adjudicationIsAllowed}
              />
            </Box>
          </Box>
        </DetailSection>
        {this.renderReferralDetails()}
      </>
    );
  }
}

export default connect(
  ClaimDetails.mapStateToProps,
  ClaimDetails.mapDispatchToProps,
)(ClaimDetails);

ClaimDetails.propTypes = {
  currentUser: userPropType.isRequired,
  provider: providerPropType,
  encounterId: PropTypes.string.isRequired,
  adjudicationIsAllowed: PropTypes.bool.isRequired,
  currentEncounterWithExtras: encounterPropType.isRequired,
  claimEncounters: PropTypes.arrayOf(PropTypes.shape({})),
  recentClaims: PropTypes.arrayOf(PropTypes.shape({})),
  member: memberPropType.isRequired,
  inboundReferralDetails: PropTypes.shape({}),
  outboundReferralDetails: PropTypes.shape({
    date: PropTypes.string,
    number: PropTypes.string,
    isFollowUp: PropTypes.bool,
    reason: PropTypes.string,
    receivingFacility: PropTypes.string,
  }),
};

ClaimDetails.defaultProps = {
  claimEncounters: [],
  recentClaims: [],
  provider: {},
  inboundReferralDetails: {},
  outboundReferralDetails: {},
};
