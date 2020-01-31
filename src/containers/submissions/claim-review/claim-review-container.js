import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { SUBMISSION_STATES } from 'lib/config';

import Box from 'components/box';
import { Text } from 'components/text';
import ClaimDetails from 'components/claim/claim-details';
import ClaimLayout from 'containers/claims/components/claim-layout';

import { historyPropType, claimPropType } from 'store/prop-types';
import { fetchDiagnoses } from 'store/diagnoses/diagnoses-actions';
import { patchEncounter as patchEncounterAction } from 'store/encounters/encounters-actions';
import { fetchClaim } from 'store/claims/claims-actions';
import { fetchProviders } from 'store/providers/providers-actions';

import {
  encounterErrorSelector,
  claimByEncounterIdSelector,
  encounterIsPatchingSelector,
  encounterPatchErrorSelector,
} from 'store/encounters/encounters-selectors';

import { ErrorLabel } from 'components/alerts';
import SubmissionForm from './components/submission-form';

class ClaimReviewContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const isLoading = state.claims.isLoadingClaims
      || state.providers.isLoadingProviders;
    const { match } = ownProps;
    const { id } = match.params;
    return {
      isLoading,
      encounterId: id,
      isPatching: encounterIsPatchingSelector(state),
      error: encounterErrorSelector(state),
      patchError: encounterPatchErrorSelector(state),
      claim: claimByEncounterIdSelector(state, id),
    };
  }

  static mapDispatchToProps = dispatch => ({
    loadData(encounterId) {
      dispatch(fetchClaim(encounterId));
      dispatch(fetchDiagnoses());
      dispatch(fetchProviders());
    },
    patchEncounter: encounter => dispatch(patchEncounterAction(encounter)),
  });

  componentDidMount() {
    const { loadData, encounterId } = this.props;
    loadData(encounterId);
  }

  handleSubmit = (encounter) => {
    const { patchEncounter } = this.props;
    patchEncounter(encounter);
  }

  render() {
    const {
      encounterId,
      isLoading,
      error,
      isPatching,
      patchError,
      claim,
      history,
    } = this.props;
    if (claim && claim.submissionState !== SUBMISSION_STATES.PREPARED) {
      return <Redirect to="/submissions" />;
    }

    return (
      <ClaimLayout
        pageTitle="Submissions"
        page="submissions"
        path="/submissions"
        claim={claim}
        encounterId={encounterId}
        isLoading={isLoading}
        error={error}
      >
        <ClaimDetails history={history} encounterId={encounterId} />
        <Box marginBottom={4}>
          <Text fontSize={4} fontWeight="medium">Submit</Text>
        </Box>
        {patchError && <ErrorLabel>{patchError}</ErrorLabel>}
        <SubmissionForm encounter={claim} onSubmit={this.handleSubmit} isSubmitting={isPatching} />
      </ClaimLayout>
    );
  }
}

export default connect(
  ClaimReviewContainer.mapStateToProps,
  ClaimReviewContainer.mapDispatchToProps,
)(ClaimReviewContainer);

ClaimReviewContainer.propTypes = {
  encounterId: PropTypes.string.isRequired,
  history: historyPropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isPatching: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  patchEncounter: PropTypes.func.isRequired,
  patchError: PropTypes.string.isRequired,
  claim: claimPropType,
  error: PropTypes.string,
};

ClaimReviewContainer.defaultProps = {
  claim: null,
  error: null,
};
