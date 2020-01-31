import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Switch from '@material-ui/core/Switch';

import api from 'lib/api';
import theme from 'styles/theme';
import { encounterByIdSelector } from 'store/encounters/encounters-selectors';
import { updateEncounter as updateEncounterAction } from 'store/encounters/encounters-actions';
import Box from 'components/box';
import Button from 'components/button';
import { TextArea, SelectField } from 'components/inputs';
import {
  ADJUDICATION_RETURN_REASONS,
  ADJUDICATION_REJECT_REASONS,
  ADJUDICATION_STATES,
} from 'lib/config';

class AdjudicationForm extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { encounterId } = ownProps;
    const encounter = encounterByIdSelector(state, encounterId);

    return {
      adjudicationState: encounter.adjudicationState,
      currentUserId: state.auth.user.id,
      auditedAt: encounter.auditedAt,
      adjudicationComment: encounter.adjudicationComment,
      adjudicationReasonCategory: encounter.adjudicationReasonCategory,
    };
  }

  static mapDispatchToProps = dispatch => ({
    updateEncounter(claim) {
      dispatch(updateEncounterAction(claim));
    },
  })

  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      ...this.getAdjudicationState(props),
      // TODO: fix for uncontrolled -> controlled error (markedForAudit: props.auditedAt !== null ? true : false)
      markedForAudit: props.auditedAt,
    };
  }

  componentDidUpdate(prevProps) {
    const { encounterId } = this.props;
    if (prevProps.encounterId !== encounterId) {
      this.updateAdjudicationState(this.props);
    }
  }

  updateAdjudicationState = (props) => {
    this.setState(this.getAdjudicationState(props));
  }

  getAdjudicationState = props => ({
    adjudicationState: props.adjudicationState,
    adjudicationComment: props.adjudicationComment,
    adjudicationReasonCategory: props.adjudicationReasonCategory,
  })

  handleAdjudicationStateOptionChange = (e) => {
    this.setState({ adjudicationState: e.target.value, adjudicationReasonCategory: '' });
  }

  handleAdjudicationCommentChange = (e) => {
    this.setState({ adjudicationComment: e.target.value });
  }

  handleAdjudicationReasonCategoryChange = (e) => {
    this.setState({ adjudicationReasonCategory: e.target.value });
  }

  handleAuditChange = (e) => {
    this.setState({ markedForAudit: e.target.checked });
  }

  handleAdjudicationSubmit = (e) => {
    const {
      onAdjudicationSuccess,
      onAdjudicationError,
      updateEncounter,
      encounterId,
      currentUserId,
      adjudicationState: existingAdjudicationState,
      auditedAt,
    } = this.props;
    const {
      adjudicationState,
      markedForAudit,
      adjudicationComment,
      adjudicationReasonCategory,
    } = this.state;
    const isChangedAdjudicationState = existingAdjudicationState !== adjudicationState;
    const isChangedAudit = markedForAudit !== auditedAt;

    e.preventDefault();

    let claim;
    if (isChangedAdjudicationState) {
      claim = {
        id: encounterId,
        adjudicatorId: currentUserId,
        adjudicatedAt: new Date(),
      };

      switch (adjudicationState) {
        case ADJUDICATION_STATES.APPROVED:
          claim.adjudicationState = ADJUDICATION_STATES.APPROVED;
          claim.adjudicationComment = null;
          break;
        case ADJUDICATION_STATES.RETURNED:
          claim.adjudicationState = ADJUDICATION_STATES.RETURNED;
          claim.adjudicationComment = adjudicationComment;
          claim.adjudicationReasonCategory = adjudicationReasonCategory;

          break;
        case ADJUDICATION_STATES.REJECTED:
          claim.adjudicationState = ADJUDICATION_STATES.REJECTED;
          claim.adjudicationComment = adjudicationComment;
          claim.adjudicationReasonCategory = adjudicationReasonCategory;
          break;
        default:
          return;
      }
    }

    if (isChangedAudit) {
      claim = {
        id: encounterId,
        auditorId: currentUserId,
        auditedAt: new Date(),
      };
    }

    this.setState({ isSubmitting: true });

    api.patchEncounter(claim)
      .then((encounter) => {
        this.setState({ isSubmitting: false });
        updateEncounter(encounter);
        onAdjudicationSuccess(encounter);
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        onAdjudicationError(err);
      });
  }

  render() {
    const { adjudicationState: existingAdjudicationState, auditedAt, adjudicationIsAllowed } = this.props;
    const {
      adjudicationState,
      isSubmitting,
      adjudicationComment,
      markedForAudit,
      adjudicationReasonCategory,
    } = this.state;

    const isUnchangedAdjudicationState = existingAdjudicationState === adjudicationState;
    const isUnchangedAuditState = markedForAudit === auditedAt
      || (!markedForAudit && !auditedAt);
    const isFormUnchanged = isUnchangedAdjudicationState && isUnchangedAuditState;
    const isApproved = adjudicationState === ADJUDICATION_STATES.APPROVED;
    const isReturned = adjudicationState === ADJUDICATION_STATES.RETURNED;
    const isRevised = adjudicationState === ADJUDICATION_STATES.REVISED;
    const isRejected = adjudicationState === ADJUDICATION_STATES.REJECTED;

    const missingAdjudicationFields = (
      (isReturned || isRejected)
      && (
        // Category must be chosen.
        // If category is 'other', adjuducation comment must be filled in.
        !adjudicationReasonCategory || (adjudicationReasonCategory === 'other' && !adjudicationComment)
      )
    );

    const canAdjudicateEncounter = existingAdjudicationState === ADJUDICATION_STATES.PENDING
      || existingAdjudicationState === ADJUDICATION_STATES.APPROVED;
    const isAdjudicationDisabled = isSubmitting || !canAdjudicateEncounter || !isUnchangedAuditState;
    const isAuditDisabled = isSubmitting || auditedAt || adjudicationState !== existingAdjudicationState;
    const isSubmittingDisabled = isFormUnchanged
      || missingAdjudicationFields;

    const hideAudit = (existingAdjudicationState !== ADJUDICATION_STATES.PENDING && auditedAt)
      || existingAdjudicationState === ADJUDICATION_STATES.RETURNED;

    return (
      <form onSubmit={this.handleAdjudicationSubmit}>
        <Box border={`1px ${theme.colors.gray[2]} solid`} borderRadius="4px" paddingHorizontal={5}>
          {!hideAudit && (
            <Box
              flex
              justifyContent="space-between"
              alignItems="center"
              paddingTop={4}
              paddingBottom={4}
              borderBottom={adjudicationIsAllowed && `1px ${theme.colors.gray[2]} solid`}
              color={isAuditDisabled ? theme.colors.gray[4] : undefined}
            >
              Mark for Audit
              <Switch
                checked={markedForAudit}
                onChange={this.handleAuditChange}
                disabled={isAuditDisabled}
                color="primary"
              />
            </Box>
          )}
          {adjudicationIsAllowed && (
            <Box flex justifyContent="space-between" paddingTop={5} paddingBottom={5} color={isAdjudicationDisabled ? theme.colors.gray[4] : undefined}>
              <Box flex>
                <Box paddingRight={5}>
                  <label htmlFor="approvedRadio">
                    <input
                      id="approvedRadio"
                      type="radio"
                      name="adjudicationState"
                      value="approved"
                      disabled={isAdjudicationDisabled}
                      checked={isApproved}
                      onChange={this.handleAdjudicationStateOptionChange}
                    />
                    {' Approved'}
                  </label>
                </Box>
                <label htmlFor="returnedRadio">
                  <input
                    id="returnedRadio"
                    type="radio"
                    name="adjudicationState"
                    value="returned"
                    disabled={isAdjudicationDisabled}
                    checked={isReturned || isRevised}
                    onChange={this.handleAdjudicationStateOptionChange}
                  />
                  {' Returned'}
                </label>
              </Box>
              <label htmlFor="rejectedRadio">
                <input
                  id="rejectedRadio"
                  type="radio"
                  name="adjudicationState"
                  value="rejected"
                  disabled={isAdjudicationDisabled}
                  checked={isRejected}
                  onChange={this.handleAdjudicationStateOptionChange}
                />
                {' Rejected'}
              </label>
            </Box>
          )}
          {(isReturned || isRejected) && (
            <Box paddingTop={2}>
              {isReturned && (
                <>
                  <Box marginBottom={4}>
                    Explain why this claim is being returned and how to correct it.
                  </Box>
                  <Box marginTop={3} marginBottom={3}>
                    <SelectField
                      label="Return reason"
                      key="returnReason"
                      name="returnReason"
                      options={[{ value: '', name: 'Select reason...' }, ...ADJUDICATION_RETURN_REASONS]}
                      value={adjudicationReasonCategory}
                      onChange={this.handleAdjudicationReasonCategoryChange}
                      disabled={isAdjudicationDisabled}
                    />
                  </Box>
                </>
              )}
              {isRejected && (
                <>
                  <Box marginBottom={4}>
                    Explain why this claim is being rejected.
                  </Box>
                  <Box marginTop={3} marginBottom={3}>
                    <SelectField
                      label="Reject reason"
                      key="rejectReason"
                      name="rejectReason"
                      options={[{ value: '', name: 'Select reason...' }, ...ADJUDICATION_REJECT_REASONS]}
                      value={adjudicationReasonCategory}
                      onChange={this.handleAdjudicationReasonCategoryChange}
                      disabled={isAdjudicationDisabled}
                    />
                  </Box>
                </>
              )}
              <Box marginTop={4} marginBottom={4}>
                <TextArea
                  value={adjudicationComment}
                  minRows={5}
                  disabled={isAdjudicationDisabled}
                  placeholder="Add a comment..."
                  onChange={this.handleAdjudicationCommentChange}
                />
              </Box>
            </Box>
          )}
        </Box>
        <Box paddingTop={5}>
          <Button primary disabled={isSubmittingDisabled} type="submit">{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
        </Box>
      </form>
    );
  }
}

export default connect(
  AdjudicationForm.mapStateToProps,
  AdjudicationForm.mapDispatchToProps,
)(AdjudicationForm);

AdjudicationForm.propTypes = {
  currentUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  encounterId: PropTypes.string.isRequired,
  onAdjudicationError: PropTypes.func,
  onAdjudicationSuccess: PropTypes.func,
  updateEncounter: PropTypes.func.isRequired,
  adjudicationState: PropTypes.string.isRequired,
  auditedAt: PropTypes.string,
  adjudicationIsAllowed: PropTypes.bool.isRequired,
};

AdjudicationForm.defaultProps = {
  onAdjudicationSuccess: () => {},
  onAdjudicationError: () => {},
  auditedAt: null,
};
