import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { formatShortId } from 'lib/formatters';
import {
  ADJUDICATION_STATES,
  SUBMISSION_STATES,
  ROLE_PERMISSIONS,
  claimsAdjudicationPermissions,
} from 'lib/config';
import { userHasAllPermissionsInSet } from 'lib/auth-utils';

import { userPropType, claimPropType, historyPropType } from 'store/prop-types';
import { fetchClaim, fetchMemberClaims as fetchMemberClaimsAction } from 'store/claims/claims-actions';
import {
  userSelector,
  userAdjudicationLimitSelector,
  userHasAdjudicationLimitSelector,
} from 'store/auth/auth-selectors';
import {
  claimFlagSelector,
} from 'store/encounters/encounters-selectors';
import { claimByEncounterIdSelector } from 'store/claims/claims-selectors';
import { fetchProviders } from 'store/providers/providers-actions';

import AdjudicationForm from 'containers/claims/components/adjudication-form';

import DetailSection from 'components/detail-section';
import { MessageAlert } from 'components/alerts';

import AdjudicationStatus from 'containers/claims/components/adjudication-status';
import ClaimLayout from 'containers/claims/components/claim-layout';
import ClaimDetails from 'components/claim/claim-details';

class ClaimDetailContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { match } = ownProps;
    const { id: encounterId } = match.params;

    return {
      currentUser: userSelector(state),
      userAdjudicationLimit: userAdjudicationLimitSelector(state),
      userHasAdjudicationLimit: userHasAdjudicationLimitSelector(state),
      encounterId,
      hasFlag: claimFlagSelector(state, encounterId),
      isLoading: state.claims.isLoadingClaims || state.providers.isLoadingProviders,
      claim: claimByEncounterIdSelector(state, encounterId),
    };
  }

  static mapDispatchToProps = dispatch => ({
    loadData(id) {
      dispatch(fetchClaim(id));
      dispatch(fetchProviders());
    },
    fetchMemberClaims: memberId => dispatch(fetchMemberClaimsAction(memberId)),
  });

  componentDidMount() {
    const { loadData, encounterId } = this.props;
    loadData(encounterId);
  }

  componentDidUpdate(prevProps) {
    const { claim, fetchMemberClaims } = this.props;
    if (!prevProps.claim && prevProps.claim !== claim) {
      fetchMemberClaims(claim.memberId);
    }
  }

  parseAdjudicationState = adjudicationState => (adjudicationState === ADJUDICATION_STATES.REVISED
    ? ADJUDICATION_STATES.RETURNED
    : adjudicationState);

  handleAdjudicationSuccess = () => {
    const { history } = this.props;
    history.push('/claims');
    window.scrollTo(0, 0);
  };

  renderClaimDetail() {
    const {
      encounterId,
      claim,
      hasFlag,
      history,
      viewOnly,
      currentUser,
      userHasAdjudicationLimit,
      userAdjudicationLimit,
    } = this.props;

    const { lastEncounter, encounters } = claim;
    const currentEncounter = encounters && encounters[encounterId];
    const adjudicationState = currentEncounter && this.parseAdjudicationState(currentEncounter.adjudicationState);
    const claimCanBeAdjudicated = lastEncounter
      && !lastEncounter.reimbursementId
      && lastEncounter.submissionState === SUBMISSION_STATES.SUBMITTED
      && lastEncounter.adjudicationState !== ADJUDICATION_STATES.EXTERNAL;
    const claimAlreadyAdjudicated = adjudicationState !== ADJUDICATION_STATES.PENDING
      && lastEncounter.adjudicationState !== ADJUDICATION_STATES.EXTERNAL; // External claims will never be adjudicated

    const adjudicationIsAllowed = !viewOnly
      && userHasAllPermissionsInSet(ROLE_PERMISSIONS[currentUser.role], claimsAdjudicationPermissions)
      && claimCanBeAdjudicated
      && (!userHasAdjudicationLimit || userAdjudicationLimit >= lastEncounter.reimbursalAmount);

    const showAdjudicationSection = adjudicationIsAllowed || claimAlreadyAdjudicated;

    return (
      <>
        {/* Flagging claims is so far just hardcoded so we are leaving this copy as is. In the future we would want to be able to
        change the copy to fit the reason for the flagging. This is only visible if EXPIRIMENTAL_FEATURES is true. */}
        {hasFlag && (
          <MessageAlert type="error" title="Invalid treatment" description="Diagnoses or billable items related to pregnancy are not valid for male members." />
        )}
        <ClaimDetails history={history} encounterId={encounterId} adjudicationIsAllowed={adjudicationIsAllowed} />
        {showAdjudicationSection && (
          <DetailSection title="Adjudication">
            {claimAlreadyAdjudicated && (
              <AdjudicationStatus
                adjudicationState={adjudicationState}
                adjudicatorName={currentEncounter.adjudicatorName}
                adjudicatedAt={currentEncounter.adjudicatedAt}
              />
            )}
            <AdjudicationForm
              encounterId={currentEncounter.id}
              onAdjudicationSuccess={this.handleAdjudicationSuccess}
              adjudicationIsAllowed={adjudicationIsAllowed}
            />
          </DetailSection>
        )}
      </>
    );
  }

  render() {
    const {
      isLoading,
      encounterId,
      fetchError,
      claim,
    } = this.props;

    return (
      <ClaimLayout
        encounterId={encounterId}
        claim={claim}
        pageTitle={claim ? `Claim ${formatShortId(claim.id)}` : 'Claim'}
        page="claim"
        path="/claims"
        isLoading={isLoading}
        error={fetchError}
      >
        {claim && this.renderClaimDetail()}
      </ClaimLayout>
    );
  }
}

export default connect(
  ClaimDetailContainer.mapStateToProps,
  ClaimDetailContainer.mapDispatchToProps,
)(ClaimDetailContainer);


ClaimDetailContainer.propTypes = {
  currentUser: userPropType.isRequired, // TODO make shape
  encounterId: PropTypes.string.isRequired,
  history: historyPropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  fetchMemberClaims: PropTypes.func.isRequired,
  userAdjudicationLimit: PropTypes.number,
  userHasAdjudicationLimit: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  claim: claimPropType,
  hasFlag: PropTypes.bool,
  fetchError: PropTypes.string,
  viewOnly: PropTypes.bool,
};

ClaimDetailContainer.defaultProps = {
  claim: null,
  hasFlag: false,
  fetchError: null,
  viewOnly: false,
  userAdjudicationLimit: null,
};
