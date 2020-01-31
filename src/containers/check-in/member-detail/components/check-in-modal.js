import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import moment from 'moment';

import { REASONS_FOR_VISIT, SEARCH_METHODS, AGE_UNITS } from 'lib/config';
import { validators, validateField } from 'lib/validations';
import { isObjectEmpty } from 'lib/utils';
import { formatMembershipNumber } from 'lib/formatters';
import { getBirthdateFromAge } from 'lib/formatters/date';

import Box from 'components/box';
import Button from 'components/button';
import Modal from 'components/modal';
import { Alert } from 'components/alerts';

import { userPropType, memberPropType, historyPropType } from 'store/prop-types';
import { checkInMember as checkInMemberAction, manuallyCheckInMember as manuallyCheckInMemberAction } from 'store/identification-events/identification-events-actions';
import { addToast as addToastAction } from 'store/toasts/toasts-actions';

import {
  providerIsHealthCenterSelector,
} from 'store/providers/providers-selectors';
import { userSelector } from 'store/auth/auth-selectors';

import CheckInIdentificationForm from 'components/identification-event/check-in-identification-form';
import MemberForm from 'components/member/member-form';

const EMPTY_VALUE = -1;
const initialState = {
  medicalRecordNumber: '',
  visitReason: EMPTY_VALUE,
  date: null,
  gender: EMPTY_VALUE,
  fullName: '',
  age: '',
  ageUnit: AGE_UNITS.YEARS,
  errors: {},
  serverError: false,
};

class CheckInModal extends Component {
  static mapStateToProps = state => ({
    currentUser: userSelector(state),
    isPostingIdentificationEvent: state.identificationEvents.isPostingIdentificationEvent,
    isPostingEncounter: state.encounters.isPostingEncounter,
    isPerformingMemberAction: state.members.isPerformingMemberAction,
    isHealthCenter: providerIsHealthCenterSelector(state),
  });

  static mapDispatchToProps = dispatch => ({
    checkInMember: (data, providerId) => (
      dispatch(checkInMemberAction(data, providerId))
    ),
    manuallyCheckInMember: (data, providerId) => (
      dispatch(manuallyCheckInMemberAction(data, providerId))
    ),
    addToast: options => dispatch(addToastAction(options)),
  });

  constructor(props) {
    super(props);
    const { currentMember } = this.props;

    this.state = initialState;
    this.state.medicalRecordNumber = (currentMember && currentMember.medicalRecordNumber) || '';
  }

  handleFieldChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    // clear date from state if reason for visit changes to a reason other than referral or follow-up
    if (e.target.name === 'visitReason' && e.target.value !== 'referral' && e.target.value !== 'follow_up') {
      this.setState({ date: EMPTY_VALUE });
    }
  }

  handleDateChange = (date) => {
    this.setState({ date });
  }

  handleCancelClick = () => {
    const { onCancel } = this.props;
    onCancel();
    this.setState(initialState);
  }

  validateFields = () => {
    const {
      manualCheckIn,
      membershipNumber,
      isHealthCenter,
    } = this.props;
    const {
      errors,
      medicalRecordNumber,
      visitReason,
      date,
      fullName,
      gender,
      age,
      ageUnit,
    } = this.state;
    const mandatoryDateField = visitReason === REASONS_FOR_VISIT.referral.value
      || visitReason === REASONS_FOR_VISIT.follow_up.value;
    const manualCheckInFields = [{ fullName }, { membershipNumber }, { gender }, { age }, { ageUnit }];

    const newErrors = errors;

    if (manualCheckIn) {
      manualCheckInFields.forEach((field) => {
        const fieldName = Object.keys(field)[0];
        newErrors[fieldName] = validateField(validators[fieldName], field[fieldName], null);
      });
    }

    newErrors.medicalRecordNumber = validateField(validators.medicalRecordNumber, medicalRecordNumber, null);

    // No need to specify this if the provider is from a health_center.
    if (!isHealthCenter) {
      newErrors.visitReason = validateField(validators.visitReason, visitReason, null);
    }

    if (mandatoryDateField) {
      newErrors.date = validateField(validators.requiredDatePicker, date, null);
    }

    this.setState({
      errors: {
        ...errors,
        ...newErrors,
      },
    });

    return errors;
  }

  handleCheckInClick = () => {
    const errors = this.validateFields();
    if (isObjectEmpty(errors)) {
      this.handleCheckInMember();
    }
  }

  handleCheckInMember = () => {
    const {
      checkInMember,
      addToast,
      manuallyCheckInMember,
      currentUser,
      currentMember,
      searchMethod,
      manualCheckIn,
      membershipNumber,
    } = this.props;
    const { medicalRecordNumber, visitReason, date, gender, fullName, age, ageUnit } = this.state;
    const { providerId } = currentUser;
    const userId = currentUser.id;
    const identificationEventId = uuid();
    const encounterId = uuid();
    const memberId = currentMember ? currentMember.id : uuid();
    const inboundReferralDateRequired = visitReason === REASONS_FOR_VISIT.referral.value
      || visitReason === REASONS_FOR_VISIT.follow_up.value;

    const member = {
      id: memberId,
      medicalRecordNumber,
    };

    const manualMember = {
      id: memberId,
      fullName,
      gender,
      medicalRecordNumber,
      enrolledAt: moment().format(),
      birthdateAccuracy: ageUnit,
      membershipNumber: formatMembershipNumber(membershipNumber),
      birthdate: getBirthdateFromAge(age, ageUnit),
    };

    const identificationEvent = {
      id: identificationEventId,
      memberId,
      searchMethod: searchMethod || SEARCH_METHODS.unknown,
      occurredAt: moment().format(),
    };

    const encounter = {
      id: encounterId,
      userId,
      memberId,
      identificationEventId,
      submissionState: 'started',
      occurredAt: moment().format(),
      claimId: encounterId,
      visitReason,
      inboundReferralDate: inboundReferralDateRequired ? date : null,
    };

    if (manualCheckIn) {
      manuallyCheckInMember({ identificationEvent, encounter, member: manualMember }, providerId).then((action) => {
        this.resolveCheckIn(action);
        addToast({ message: `${fullName} was sucessfully checked in.` });
      });
    } else {
      checkInMember({ identificationEvent, encounter, member }, providerId).then((action) => {
        this.resolveCheckIn(action);
        addToast({ message: `${currentMember.fullName} was sucessfully checked in.` });
      });
    }
  }

  resolveCheckIn = (action) => {
    const { history } = this.props;

    if (action.errorMessage) {
      this.setState({ serverError: true });
    } else {
      this.handleCancelClick();
      history.push('/check-in');
    }
  }

  renderFooter() {
    const { isPostingEncounter, isPostingIdentificationEvent, isPerformingMemberAction } = this.props;
    const disable = isPostingEncounter || isPostingIdentificationEvent || isPerformingMemberAction;

    return (
      <Box flex alignItems="space-between" justifyContent="space-between">
        <Button small inline onClick={this.handleCancelClick} disabled={disable}>Cancel</Button>
        <Button small inline primary onClick={this.handleCheckInClick} disabled={disable}>Check In</Button>
      </Box>
    );
  }

  render() {
    const {
      medicalRecordNumber,
      visitReason,
      age,
      fullName,
      errors,
      serverError,
      date,
    } = this.state;
    const { manualCheckIn, membershipNumber } = this.props;

    return (
      <Modal title="Check In" onRequestClose={this.handleCancelClick} footer={this.renderFooter()}>
        {serverError && (
          <Box marginBottom={4}>
            <Alert>An error occurred. Please refresh the page and try again.</Alert>
          </Box>
        )}
        {manualCheckIn
          && (
            <MemberForm
              membershipNumber={membershipNumber}
              age={age}
              fullName={fullName}
              handleFieldChange={this.handleFieldChange}
              errors={errors}
              membershipNumberEditable={false}
            />
          )}
        <CheckInIdentificationForm
          medicalRecordNumber={medicalRecordNumber}
          reasonForVisit={visitReason}
          date={date}
          handleDateChange={this.handleDateChange}
          handleFieldChange={this.handleFieldChange}
          errors={errors}
        />
      </Modal>
    );
  }
}

export default connect(
  CheckInModal.mapStateToProps,
  CheckInModal.mapDispatchToProps,
)(CheckInModal);

CheckInModal.propTypes = {
  currentMember: memberPropType,
  currentUser: userPropType.isRequired,
  onCancel: PropTypes.func.isRequired,
  addToast: PropTypes.func.isRequired,
  checkInMember: PropTypes.func.isRequired,
  manuallyCheckInMember: PropTypes.func.isRequired,
  searchMethod: PropTypes.string.isRequired,
  history: historyPropType.isRequired,
  manualCheckIn: PropTypes.bool,
  isPostingIdentificationEvent: PropTypes.bool.isRequired,
  isPostingEncounter: PropTypes.bool.isRequired,
  isPerformingMemberAction: PropTypes.bool.isRequired,
  membershipNumber: PropTypes.string,
  isHealthCenter: PropTypes.bool.isRequired,
};

CheckInModal.defaultProps = {
  currentMember: null,
  manualCheckIn: false,
  membershipNumber: null,
};
