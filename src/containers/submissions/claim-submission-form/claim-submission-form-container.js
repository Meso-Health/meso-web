import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

import {
  keyBy,
  map,
  indexOf,
  groupBy,
  capitalize,
  filter,
  isFinite,
  isNil,
  pickBy,
  identity,
  isEmpty,
  omit,
} from 'lodash/fp';
import { formatGender, formatShortId, formatMembershipNumber } from 'lib/formatters';
import { formatDate, getBirthdateFromAge } from 'lib/formatters/date';
import {
  PATIENT_OUTCOMES,
  ADJUDICATION_STATES,
  BILLABLE_TYPES,
  REFERRAL_FACILITIES,
  FOLLOW_UP_RECEIVING_FACILITY,
  FOLLOW_UP_REASON,
  REFERRAL_FACILITY_OTHER,
  REASONS_FOR_VISIT,
  SUBMISSION_STATES,
} from 'lib/config';
import { historyPropType, encounterPropType, memberPropType, userPropType } from 'store/prop-types';
import {
  createEncounterWithDelta as createEncounterWithDeltaAction,
  reviseEncounterAndCreateWithDelta as reviseEncounterAndCreateWithDeltaAction,
} from 'store/encounters/encounters-actions';
import { fetchClaim as fetchClaimAction } from 'store/claims/claims-actions';
import { fetchDiagnoses as fetchDiagnosesAction } from 'store/diagnoses/diagnoses-actions';
import { fetchBillables as fetchBillablesAction } from 'store/billables/billables-actions';
import { fetchProviders as fetchProvidersAction } from 'store/providers/providers-actions';
import { createMemberWithDelta as createMemberWithDeltaAction } from 'store/members/members-actions';
import { createIdentificationEventWithDelta as createIdentificationEventWithDeltaAction } from 'store/identification-events/identification-events-actions';
import { createPriceSchedulesWithDeltas as createPriceSchedulesWithDeltasAction } from 'store/price-schedules/price-schedules-actions';
import { calculateClaimPrice } from 'store/encounters/encounters-utils';
import { activeBillablesByCategorySelector, billablesWithPriceSchedulesByIdSelector } from 'store/billables/billables-selectors';
import {
  claimByEncounterIdSelector,
  memberByEncounterIdSelector,
  claimEncountersSelector,
  inboundReferralDetailsSelector,
  outboundReferralDetailsSelector,
  diagnosesByEncounterIdSelector,
} from 'store/encounters/encounters-selectors';
import {
  priceSchedulesKeyedByIdSelector,
} from 'store/price-schedules/price-schedules-selectors';
import { activeDiagnosesSelector } from 'store/diagnoses/diagnoses-selectors';
import {
  currentUserProviderSelector,
  providerVisitTypeListSelector,
  providerIsHealthCenterSelector,
} from 'store/providers/providers-selectors';
import { validators, validateField } from 'lib/validations';
import { SearchDropdownPicker, DatePicker, TextArea, SelectField } from 'components/inputs';
import { Text, Label } from 'components/text';
import { LayoutWithHeader } from 'components/layouts';
import Divider from 'components/dividers/divider';
import DetailSection from 'components/detail-section';
import LoadingIndicator from 'components/loading-indicator';
import DetailHeader from 'components/detail-header';
import { BirthdateItem, MetadataList, MetadataItem } from 'components/list';
import LargeClaimIcon from 'containers/claims/components/large-claim-icon';
import ClaimTimeline from 'components/claim/claim-timeline';
import Box from 'components/box';
import Button from 'components/button';
import { Alert, ErrorLabel } from 'components/alerts';
import MembershipStatusAlert from 'components/member/membership-status-alert';
import Section from 'components/section';

import CheckInIdentificationForm from 'components/identification-event/check-in-identification-form';
import MemberForm from 'components/member/member-form';
import DiagnosisPicker from './components/diagnosis-picker';
import EncounterItemsTable from './components/encounter-items-table';
import AmountSummary from './components/amount-summary';
import PriceModal from './components/price-modal';
import VisitDetailsSection from './components/visit-details-section';

const EMPTY_VALUE = -1;

class ClaimSubmissionFormContainer extends Component {
  static mapStateToProps = (state, ownProps) => {
    const { match } = ownProps;
    const { id } = match.params;
    return ({
      member: memberByEncounterIdSelector(state, id),
      activeDiagnoses: activeDiagnosesSelector(state),
      initialDiagnoses: diagnosesByEncounterIdSelector(state, id),
      claim: claimByEncounterIdSelector(state, id),
      isLoadingClaims: state.claims.isLoadingClaims,
      isLoadingBillableDiagnosesOrProviders: (
        state.billables.isLoadingBillables
        || state.diagnoses.isLoadingDiagnoses
        || state.providers.isLoadingProviders
      ),
      encountersError: state.encounters.encountersError,
      billableAndDiagnosesError: state.billables.billablesError,
      user: state.auth.user,
      currentUserProvider: currentUserProviderSelector(state),
      billablesByCategory: activeBillablesByCategorySelector(state),
      billablesWithPriceScheduleById: billablesWithPriceSchedulesByIdSelector(state),
      priceSchedulesById: priceSchedulesKeyedByIdSelector(state),
      claimEncounters: claimEncountersSelector(state, id),
      inboundReferralDetails: inboundReferralDetailsSelector(state, id),
      outboundReferralDetails: outboundReferralDetailsSelector(state, id),
      providerVisitTypeOptions: providerVisitTypeListSelector(state),
      isHealthCenter: providerIsHealthCenterSelector(state),
    });
  }

  static mapDispatchToProps = dispatch => ({
    fetchDiagnoses: () => dispatch(fetchDiagnosesAction()),
    fetchBillables: providerId => dispatch(fetchBillablesAction(providerId)),
    fetchProviders: () => dispatch(fetchProvidersAction()),
    fetchClaim: encounterId => dispatch(fetchClaimAction(encounterId)),
    createEncounterWithDelta: (encounter, newEncounter) => (
      dispatch(createEncounterWithDeltaAction(encounter, newEncounter))
    ),
    reviseEncounterAndCreateWithDelta: encounter => (
      dispatch(reviseEncounterAndCreateWithDeltaAction(encounter))
    ),
    createIdentificationEventWithDelta: idEvent => (
      dispatch(createIdentificationEventWithDeltaAction(idEvent))
    ),
    createMemberWithDelta: member => (
      dispatch(createMemberWithDeltaAction(member))
    ),
    createPriceSchedulesWithDeltas: priceSchedules => (
      dispatch(createPriceSchedulesWithDeltasAction(priceSchedules))
    ),
  });

  initialState = {
    formPrefilled: false,
    encounterItemsWithBillable: [],
    selectedDiagnoses: [],
    newPriceSchedules: [],
    serviceDate: null,
    inboundReferralDate: null,
    dischargeDate: null,
    visitType: null,
    patientOutcome: null,
    referralReceivingFacility: null,
    referralReceivingFacilityOther: null,
    referralNumber: null,
    referralReason: null,
    referralDate: null,
    fullName: '',
    age: '',
    gender: EMPTY_VALUE,
    membershipNumber: '',
    birthdateAccuracy: 'Y',
    backdatedOccurredAt: false,
    medicalRecordNumber: '',
    visitReason: EMPTY_VALUE,
    errors: {},
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  componentDidMount() {
    const {
      fetchDiagnoses,
      fetchBillables,
      fetchClaim,
      user,
      manualSubmission,
      fetchProviders,
      match,
      claim,
    } = this.props;
    const { id: idFromMatch } = match.params;
    // If it's a new submission, then the claimId is the same as in the URL.
    // Otherwise, the claimId is taken from the claim that's loaded.
    const claimId = manualSubmission ? idFromMatch : claim.claimId;

    // We need to fetch encounters only if this is not a manual submission.
    if (!manualSubmission) {
      fetchClaim(claimId);
    }
    fetchDiagnoses();
    fetchBillables(user.providerId);
    fetchProviders();
  }

  componentDidUpdate() {
    const { claim, manualSubmission } = this.props;
    const { formPrefilled } = this.state;

    if (!manualSubmission && claim && !formPrefilled) {
      this.prefillClaimData();
    }
  }

  prefillClaimData = () => {
    const { encounterItemsWithBillable } = this.state;
    const { claim, initialDiagnoses, billablesWithPriceScheduleById, priceSchedulesById } = this.props;
    const {
      encounterItems,
      dischargeDate,
      occurredAt,
      visitType,
      patientOutcome,
      referrals,
      inboundReferralDate,
      providerComment,
      visitReason,
    } = claim;

    let referral = null;
    if (referrals) {
      [referral] = claim.referrals;
    }

    const initialEncounterItems = map((ei) => {
      const priceSchedule = priceSchedulesById[ei.priceScheduleId];
      const { billable } = billablesWithPriceScheduleById[priceSchedule.billableId];
      return ({
        ...ei,
        billableId: billable.id,
        billable,
        priceScheduleId: priceSchedule.id,
        originalPriceSchedule: priceSchedule,
        // originalPriceSchedule is needed keep track of what the original price is, so if a user changes price,
        // and then changes it back to the original price, we do not need to create a new price schedule for them.
        priceSchedule,
        previousPriceScheduleId: null,
      });
    })(encounterItems);

    this.setState({
      formPrefilled: true,
      selectedDiagnoses: initialDiagnoses,
      serviceDate: moment(occurredAt),
      dischargeDate: dischargeDate ? moment(dischargeDate) : null,
      inboundReferralDate: inboundReferralDate ? moment(inboundReferralDate) : null,
      visitType,
      visitReason,
      patientOutcome,
      providerComment,
      referralReceivingFacility: (
        (referral && REFERRAL_FACILITIES.includes(referral.receivingFacility)) ? referral.receivingFacility : null
      ),
      referralReceivingFacilityOther: (
        (referral && !REFERRAL_FACILITIES.includes(referral.receivingFacility)) ? referral.receivingFacility : null
      ),
      referralNumber: referral && referral.number,
      referralReason: referral && referral.reason,
      referralDate: referral && moment(referral.date),
      encounterItemsWithBillable: [...initialEncounterItems, ...encounterItemsWithBillable],
    });
  }

  handleStateChange = (value, key) => {
    const { errors } = this.state;
    const newErrors = omit(key, errors);

    this.setState({ [key]: value, errors: newErrors });
  }

  handleUpdateSelectedDiagnoses = (selectedDiagnoses) => {
    this.setState({ selectedDiagnoses });
  }

  handleBackdateService = (date) => {
    this.handleStateChange(date, 'serviceDate');
    this.setState({ backdatedOccurredAt: true });
  }

  handleSelectEncounterItem = (billableId) => {
    const { encounterItemsWithBillable, errors } = this.state;
    const { billablesWithPriceScheduleById } = this.props;
    const { billable, activePriceSchedule } = billablesWithPriceScheduleById[billableId];

    const newEncounterItem = {
      id: uuid(),
      billableId: billable.id,
      billable,
      quantity: 1,
      stockout: false,
      priceScheduleId: activePriceSchedule.id,
      originalPriceSchedule: activePriceSchedule,
      // originalPriceSchedule is needed keep track of what the original price is, so if a user changes price,
      // and then changes it back to the original price, we do not need to create a new price schedule for them.
      priceSchedule: activePriceSchedule,
      previousPriceScheduleId: null,
      priceScheduleIssued: false,
    };
    const newErrors = omit('claimTotal', errors);
    this.setState({
      encounterItemsWithBillable: [...encounterItemsWithBillable, newEncounterItem],
      errors: newErrors,
    });
  }

  handleDeleteEncounterItem = (id) => {
    const { encounterItemsWithBillable, newPriceSchedules } = this.state;
    const updatedSelection = filter(ei => ei.id !== id)(encounterItemsWithBillable);
    const updatedPriceSchedules = filter(p => p.encounterItemId !== id)(newPriceSchedules);
    this.setState({
      encounterItemsWithBillable: [...updatedSelection],
      modalEncounterItem: null,
      newPriceSchedules: [...updatedPriceSchedules],
    });
  }

  handleUpdateEncounterItem = (encounterItemUpdates) => {
    const { modalEncounterItem, encounterItemsWithBillable } = this.state;
    const updatedEncounterItemsWithBillables = encounterItemsWithBillable.map((encounterItem) => {
      if (encounterItem.id === modalEncounterItem.id) {
        return { ...modalEncounterItem, ...encounterItemUpdates };
      }
      return encounterItem;
    });
    this.setState({
      encounterItemsWithBillable: updatedEncounterItemsWithBillables,
      modalEncounterItem: null,
    });
  }

  isPatientOutcomeReferral = () => {
    const { patientOutcome } = this.state;
    return PATIENT_OUTCOMES[patientOutcome] === PATIENT_OUTCOMES.referred;
  }

  isPatientOutcomeFollowup = () => {
    const { patientOutcome } = this.state;
    return PATIENT_OUTCOMES[patientOutcome] === PATIENT_OUTCOMES.follow_up;
  }

  handleFieldErrors = (callback) => {
    const {
      serviceDate,
      visitType,
      patientOutcome,
      dischargeDate,
      referralReceivingFacility,
      referralReceivingFacilityOther,
      referralDate,
      referralReason,
      fullName,
      age,
      membershipNumber,
      gender,
      visitReason,
      inboundReferralDate,
      medicalRecordNumber,
      encounterItemsWithBillable,
      providerComment,
    } = this.state;
    const {
      claim,
      manualSubmission,
      providerVisitTypeOptions,
      isHealthCenter,
    } = this.props;

    const newErrors = {};

    // Check that claim total is not negative amount
    const claimTotal = calculateClaimPrice(encounterItemsWithBillable);
    if (claimTotal < 0) {
      newErrors.claimTotal = 'Total claimed amount cannot be negative';
    } else if (!this.isPatientOutcomeReferral() && encounterItemsWithBillable.length === 0) {
      newErrors.claimTotal = 'Claim must include billable items unless the outcome is referral.';
    }

    if (manualSubmission) {
      // Check member fields.
      newErrors.fullName = validateField(validators.fullName, fullName, null);
      newErrors.membershipNumber = validateField(validators.membershipNumber, membershipNumber, null);
      newErrors.age = validateField(validators.age, age, null);
      newErrors.gender = validateField(validators.gender, gender, null);
      newErrors.medicalRecordNumber = validateField(validators.medicalRecordNumber, medicalRecordNumber, null);

      // Check ID event fields.
      if (!isHealthCenter) {
        newErrors.visitReason = validateField(validators.visitReason, visitReason, null);
      }

      const mandatoryDateField = visitReason === REASONS_FOR_VISIT.referral.value
      || visitReason === REASONS_FOR_VISIT.follow_up.value;

      if (mandatoryDateField) {
        newErrors.date = validateField(validators.requiredDatePicker, inboundReferralDate, null);
      }
    }

    // serviceDate, visitType, patientOutcome are all required.
    newErrors.serviceDate = validateField(validators.requiredDatePicker, serviceDate, null);
    newErrors.patientOutcome = validateField(validators.patientOutcome, patientOutcome, null);

    // if visitType is one that requires a discharge, then discharge date is required.
    newErrors.visitType = validateField(
      validators.visitType,
      visitType,
      { visitTypeOptions: providerVisitTypeOptions },
    );

    const visitTypes = keyBy('name', providerVisitTypeOptions);
    if (visitTypes[visitType] && visitTypes[visitType].isDischarge) {
      newErrors.dischargeDate = validateField(validators.dischargeDate, dischargeDate, null);
    }

    if (this.isPatientOutcomeFollowup()) {
      newErrors.referralDate = validateField(validators.requiredDatePicker, referralDate, null);
    }

    if (this.isPatientOutcomeReferral()) {
      newErrors.referralReason = validateField(validators.referralReason, referralReason, null);
      newErrors.referralDate = validateField(validators.requiredDatePicker, referralDate, null);
      newErrors.referralReceivingFacility = validateField(
        validators.referralReceivingFacility,
        referralReceivingFacility,
        null,
      );

      // If the user chooses 'Other' for receiving facility, they need to fill in the receiving facility.
      if (referralReceivingFacility === REFERRAL_FACILITY_OTHER) {
        newErrors.referralReceivingFacilityOther = validateField(validators.referralReceivingFacility,
          referralReceivingFacilityOther, null);
      }
    }

    // Claim needs a comment if it is a resubmission of a claim
    // that is returned from either the facility head or claims adjudicator.
    if (
      claim && (
        [ADJUDICATION_STATES.RETURNED, ADJUDICATION_STATES.REJECTED].includes(claim.adjudicationState)
        || SUBMISSION_STATES.NEEDS_REVISION === claim.submissionState
      )
    ) {
      newErrors.providerComment = validateField(validators.comment, providerComment);
    }

    const newErrorState = pickBy(identity)(newErrors);
    if (!isEmpty(newErrorState)) {
      window.scrollTo(0, 0);
    }

    this.setState({ errors: newErrorState }, callback);
  }

  onValidationFinishSuccess = () => {
    const {
      providerComment,
      selectedDiagnoses,
      encounterItemsWithBillable,
      patientOutcome,
      visitType,
      serviceDate,
      errors,
      referralReceivingFacility,
      referralReceivingFacilityOther,
      referralDate,
      referralReason,
      referralNumber,
      dischargeDate,
      fullName,
      age,
      birthdateAccuracy,
      membershipNumber,
      gender,
      visitReason,
      inboundReferralDate,
      medicalRecordNumber,
      backdatedOccurredAt,
    } = this.state;

    if (!isEmpty(errors)) {
      return;
    }
    const {
      createEncounterWithDelta,
      createPriceSchedulesWithDeltas,
      createMemberWithDelta,
      reviseEncounterAndCreateWithDelta,
      createIdentificationEventWithDelta,
      manualSubmission,
      match,
      claim,
      history,
      user,
    } = this.props;
    const { id: idFromMatch } = match.params;
    // If it's a new submission, then the claimId is the same as in the URL.
    // Otherwise, the claimId is taken from the claim that's loaded.
    const claimId = manualSubmission ? idFromMatch : claim.claimId;

    const memberId = manualSubmission ? uuid() : claim.memberId;
    const identificationEventId = manualSubmission ? uuid() : claim.identificationEventId;
    if (manualSubmission) {
      const newMember = {
        id: memberId,
        fullName,
        birthdate: getBirthdateFromAge(age, birthdateAccuracy),
        birthdateAccuracy,
        membershipNumber: formatMembershipNumber(membershipNumber),
        gender,
        medicalRecordNumber,
        enrolledAt: moment().format(),
      };

      const newIdentificationEvent = {
        id: identificationEventId,
        occurredAt: moment().format(),
        memberId: newMember.id,
        searchMethod: 'manual_entry',
      };
      createMemberWithDelta(newMember);
      createIdentificationEventWithDelta(newIdentificationEvent);
    }

    let receivingFacility;
    let calculatedReferralReason = referralReason;
    if (this.isPatientOutcomeFollowup()) {
      receivingFacility = FOLLOW_UP_RECEIVING_FACILITY;
      calculatedReferralReason = FOLLOW_UP_REASON;
    } else {
      receivingFacility = (
        referralReceivingFacility === REFERRAL_FACILITY_OTHER
          ? referralReceivingFacilityOther : referralReceivingFacility
      );
    }

    const claimTotal = calculateClaimPrice(encounterItemsWithBillable);
    // reimbursal amounts must be integers and policy is to have patient pay less when rounding
    const reimbursalAmount = Math.ceil(claimTotal);
    // If the claim total is not equal to the reimbursal amount, then that means there is a custom amount.
    const customReimbursalAmount = claimTotal !== reimbursalAmount ? reimbursalAmount : null;

    let encounterIdToPersist;
    const encounter = {
      id: idFromMatch,
      claimId,
      backdatedOccurredAt,
      occurredAt: serviceDate ? serviceDate.format() : serviceDate,
      preparedAt: moment().format(),
      submittedAt: null,
      submissionState: 'prepared',
      adjudicationState: (
        claim && claim.adjudicationState === ADJUDICATION_STATES.RETURNED ? ADJUDICATION_STATES.pending : null
      ),
      providerComment,
      inboundReferralDate: inboundReferralDate ? inboundReferralDate.format() : inboundReferralDate,
      patientOutcome,
      visitType,
      userId: user.id,
      encounterItems: encounterItemsWithBillable.map((ei) => {
        // No need to include the nested price schedule and billable in the encounterItem that we need to store.
        const { _billable, _priceSchedule, _originalPriceSchedule, ...encounterItem } = ei;
        return encounterItem;
      }),
      diagnosisIds: selectedDiagnoses.map(d => d.id),
      memberId,
      identificationEventId,
      referrals: this.isPatientOutcomeFollowup() || this.isPatientOutcomeReferral() ? [{
        id: uuid(),
        receivingFacility,
        date: referralDate ? referralDate.format() : referralDate,
        reason: calculatedReferralReason,
        number: referralNumber,
        encounterId: encounterIdToPersist,
      }] : [],
      dischargeDate: dischargeDate ? dischargeDate.format() : dischargeDate,
      visitReason,
      reimbursalAmount, // Not needed in the POST, but needed when loading from local store.
      customReimbursalAmount, // needed in the POST
    };
    if (claim && claim.adjudicationState === ADJUDICATION_STATES.RETURNED) {
      reviseEncounterAndCreateWithDelta(encounter);
    } else {
      createEncounterWithDelta(encounter, manualSubmission);
    }

    const newPriceSchedules = encounterItemsWithBillable
      .filter(ei => ei.priceScheduleIssued)
      .map(ei => ei.priceSchedule);
    createPriceSchedulesWithDeltas(newPriceSchedules);
    // TODO make all the create with deltas a chain of promises before navigating to /submissions.
    history.push('/submissions');
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.handleFieldErrors(this.onValidationFinishSuccess);
  }

  handleQuantityChange = (quantity, encounterItem) => {
    const { encounterItemsWithBillable, errors } = this.state;
    const indexOfItem = indexOf(encounterItem)(encounterItemsWithBillable);
    const parsedQuantity = parseInt(quantity, 10);
    const newErrors = omit('claimTotal', errors);

    if (indexOfItem >= 0 && (isFinite(parsedQuantity) || quantity.length === 0)) {
      const newQuantity = isFinite(parsedQuantity) ? parsedQuantity : quantity;
      const updatedEncounterItems = [...encounterItemsWithBillable];

      // in order to avoid reorder the list on change we splice the new item into the list
      updatedEncounterItems.splice(indexOfItem, 1, { ...encounterItem, quantity: newQuantity });
      this.setState({ encounterItemsWithBillable: [...updatedEncounterItems], errors: newErrors });
    }
  }

  handleRowClick = (encounterItem) => {
    this.setState({ modalEncounterItem: encounterItem });
  }

  renderSearchDropdown({ key, label }) {
    const { encounterItemsWithBillable } = this.state;
    const { billablesByCategory } = this.props;
    const encounterItemsByCategory = groupBy(ei => ei.billable.type)(encounterItemsWithBillable);
    const tableEncounterItemsWithBillable = encounterItemsByCategory[key] || [];
    const options = billablesByCategory[key] || [];

    return (
      <Box marginBottom={4}>
        <Box marginBottom={3}>
          <Label fontWeight="medium" fontSize={3}>{capitalize(label)}</Label>
        </Box>
        <SearchDropdownPicker
          options={options}
          handleSelect={selection => this.handleSelectEncounterItem(selection.id)}
          selected={tableEncounterItemsWithBillable}
          itemSize={60}
        />
        {tableEncounterItemsWithBillable.length > 0 && (
          <EncounterItemsTable
            handleQuantityChange={(quantity, encounterItem) => this.handleQuantityChange(quantity, encounterItem)}
            encounterItemsWithBillable={tableEncounterItemsWithBillable}
            handleRowClick={this.handleRowClick}
          />
        )}
      </Box>
    );
  }

  renderDropdown({ key, label }) {
    const { encounterItemsWithBillable } = this.state;
    const { billablesByCategory } = this.props;
    const encounterItemsByCategory = groupBy(ei => ei.billable.type)(encounterItemsWithBillable);
    const tableEncounterItemsWithBillable = encounterItemsByCategory[key] || [];
    const options = billablesByCategory[key] || [];
    return (
      <Box marginBottom={4}>
        <SelectField
          name={label}
          label={capitalize(label)}
          labelProps={{ fontWeight: 'medium', fontSize: 3 }}
          options={[{ value: null, name: `Select ${label}...` }, ...options]}
          value=""
          onChange={e => this.handleSelectEncounterItem(e.target.value)}
        />
        {tableEncounterItemsWithBillable.length > 0 && (
          <EncounterItemsTable
            handleQuantityChange={(quantity, billableId) => this.handleQuantityChange(quantity, billableId)}
            encounterItemsWithBillable={tableEncounterItemsWithBillable}
            handleRowClick={this.handleRowClick}
          />
        )}
      </Box>
    );
  }

  renderIdentificationSection() {
    const {
      medicalRecordNumber,
      visitReason,
      errors,
      inboundReferralDate,
    } = this.state;

    const {
      manualSubmission,
    } = this.props;

    if (manualSubmission) {
      return (
        <CheckInIdentificationForm
          medicalRecordNumber={medicalRecordNumber}
          reasonForVisit={visitReason}
          date={inboundReferralDate}
          handleDateChange={date => this.handleStateChange(date, 'inboundReferralDate')}
          handleFieldChange={e => this.handleStateChange(e.target.value, e.target.name)}
          errors={errors}
        />
      );
    }
    return null;
  }

  renderMemberSection() {
    const {
      age,
      membershipNumber,
      fullName,
      errors,
    } = this.state;
    const {
      manualSubmission,
      match,
      member,
      claim,
      claimEncounters,
      user,
      inboundReferralDetails,
      outboundReferralDetails,
      isHealthCenter,
      currentUserProvider,
    } = this.props;

    const { id: idFromMatch } = match.params;

    if (manualSubmission) {
      return (
        <MemberForm
          membershipNumber={membershipNumber}
          age={age}
          fullName={fullName}
          handleFieldChange={e => this.handleStateChange(e.target.value, e.target.name)}
          errors={errors}
        />
      );
    }

    const medicalRecordNumber = member.medicalRecordNumbers && currentUserProvider
      && member.medicalRecordNumbers[currentUserProvider.id];
    return (
      <>
        <DetailHeader
          icon={(
            <LargeClaimIcon
              adjudicationState={claim.adjudicationState}
              reimbursementId={claim.reimbursementId}
            />
          )}
          title={`Claim ${formatShortId(idFromMatch)}`}
          subtitle={`MRN ${medicalRecordNumber || '-'}`}
        />
        {(claim.adjudicationState === ADJUDICATION_STATES.RETURNED && claimEncounters) && (
          <>
            <DetailSection title="History">
              {/* TODO: Figure out why we pass claimId here instead of encounterId of the current encounter */}
              <ClaimTimeline
                user={user}
                claimEncounters={claimEncounters}
                encounterId={idFromMatch}
                inboundReferralDetails={inboundReferralDetails}
                outboundReferralDetails={outboundReferralDetails}
              />
            </DetailSection>
          </>
        )}
        <DetailSection title="Member Information">
          <MetadataList>
            <MetadataItem label="Full Name" value={member.fullName} />
            <MetadataItem label="Beneficiary ID" value={member.membershipNumber} />
            <MetadataItem label="Gender" value={formatGender(member.gender)} />
            <BirthdateItem member={member} />
            <MetadataItem label="Medical Record Number" value={medicalRecordNumber} />
            {!isHealthCenter && <MetadataItem label="Reason for Visit" value={REASONS_FOR_VISIT[claim.visitReason].label} />}
            <MetadataItem label="Inbound Referral Date" value={formatDate(claim.inboundReferralDate)} />
          </MetadataList>
        </DetailSection>
      </>
    );
  }

  render() {
    const {
      match,
      claim,
      isLoadingClaims,
      isLoadingBillableDiagnosesOrProviders,
      activeDiagnoses,
      billablesWithPriceScheduleById,
      manualSubmission,
      billableAndDiagnosesError,
      encountersError,
      member,
      currentUserProvider,
      isHealthCenter,
      providerVisitTypeOptions,
    } = this.props;
    const {
      encounterItemsWithBillable,
      patientOutcome,
      visitType,
      serviceDate,
      modalEncounterItem,
      selectedDiagnoses,
      dischargeDate,
      errors,
      referralReceivingFacility,
      referralReceivingFacilityOther,
      referralNumber,
      referralDate,
      referralReason,
      providerComment,
    } = this.state;
    const { id: idFromMatch } = match.params;
    let component;
    const steps = [{ title: `${formatShortId(idFromMatch)}`, href: `/submissions/${idFromMatch}/${manualSubmission ? 'new' : 'edit'}` }];
    if (activeDiagnoses.length === 0
        || Object.keys(billablesWithPriceScheduleById).length === 0
        || isNil(currentUserProvider)) {
      if (isLoadingBillableDiagnosesOrProviders) {
        component = (<LoadingIndicator noun="billables, diagnoses and provider info" />);
      } else {
        component = (<LoadingIndicator noun="billables, diagnoses and provider info" error={billableAndDiagnosesError} />);
      }
    } else if (!manualSubmission && (isNil(claim) || isNil(member))) {
      // We will need the claim only if it's editing a claim.
      if (isLoadingClaims) {
        component = (<LoadingIndicator noun="open claim" />);
      } else {
        component = (
          <Text>{`Could not find open claim with the ID "${idFromMatch}". ${encountersError}`}</Text>
        );
      }
    } else {
      component = (
        <>
          { !isEmpty(errors) && (
            <Box padding={5}>
              <Alert>Some required fields are missing or invalid. Please verify all required fields.</Alert>
            </Box>
          )}
          <MembershipStatusAlert member={member} />
          {this.renderMemberSection()}
          {this.renderIdentificationSection()}
          <form onSubmit={this.handleFormSubmit}>
            <Section title="Service date">
              <DatePicker
                onChange={this.handleBackdateService}
                defaultDate={formatDate(serviceDate)}
                maxDate={formatDate(moment())}
                name="service-date"
                error={errors.serviceDate}
              />
            </Section>
            <Section title="Visit Information">
              <VisitDetailsSection
                onChange={this.handleStateChange}
                visitType={visitType}
                currentUserProvider={currentUserProvider}
                dischargeDate={formatDate(dischargeDate)}
                patientOutcome={patientOutcome}
                referralReceivingFacilityOther={referralReceivingFacilityOther}
                referralReceivingFacility={referralReceivingFacility}
                referralReason={referralReason}
                referralNumber={referralNumber}
                referralDate={formatDate(referralDate)}
                serviceDate={formatDate(serviceDate)}
                maxDate={formatDate(moment())}
                errors={errors}
                providerVisitTypeOptions={providerVisitTypeOptions}
              />
            </Section>
            <Section title="Diagnoses">
              <DiagnosisPicker
                searchableDiagnoses={activeDiagnoses}
                selectedDiagnoses={selectedDiagnoses}
                handleSelect={this.handleUpdateSelectedDiagnoses}
              />
            </Section>
            <Section title="Services">
              {this.renderDropdown(BILLABLE_TYPES.service)}
              <Divider marginBottom={4} marginHorizontal="-16" />
              {this.renderDropdown(BILLABLE_TYPES.lab)}
              <Divider marginBottom={4} marginHorizontal="-16" />
              {this.renderSearchDropdown(BILLABLE_TYPES.drug)}
              <Divider marginBottom={4} marginHorizontal="-16" />
              {!isHealthCenter && (
                <>
                  {this.renderDropdown(BILLABLE_TYPES.imaging)}
                  <Divider marginBottom={4} marginHorizontal="-16" />
                  {this.renderDropdown(BILLABLE_TYPES.bed_day)}
                  <Divider marginBottom={4} marginHorizontal="-16" />
                  {this.renderDropdown(BILLABLE_TYPES.procedure)}
                </>
              )}
            </Section>
            <Section title="Comment">
              <TextArea
                minRows={2}
                placeholder="Add a comment..."
                onChange={e => this.handleStateChange(e.target.value, 'providerComment')}
                value={providerComment || ''}
              />
              {errors.providerComment && (
                <ErrorLabel>{errors.providerComment}</ErrorLabel>
              )}
            </Section>
            <Section title="Amount">
              <AmountSummary
                handleChange={this.handleStateChange}
                encounterItemsWithBillable={encounterItemsWithBillable}
                claimTotalError={errors.claimTotal}
              />
            </Section>
            <Box paddingTop={5}>
              <Button primary disabled={false} type="submit">Save</Button>
            </Box>
          </form>
          {modalEncounterItem && (
            <PriceModal
              encounterItem={modalEncounterItem}
              onClose={() => this.setState({ modalEncounterItem: null })}
              onDelete={() => this.handleDeleteEncounterItem(modalEncounterItem.id)}
              onSave={encounterItemUpdates => this.handleUpdateEncounterItem(encounterItemUpdates)}
            />
          )}
        </>
      );
    }
    return (
      <LayoutWithHeader pageTitle="Submissions" steps={[{ title: 'Submission', href: '/submissions' }, ...steps]}>
        {component}
      </LayoutWithHeader>
    );
  }
}

export default connect(
  ClaimSubmissionFormContainer.mapStateToProps,
  ClaimSubmissionFormContainer.mapDispatchToProps,
)(ClaimSubmissionFormContainer);

ClaimSubmissionFormContainer.propTypes = {
  user: userPropType.isRequired,
  member: memberPropType,
  billablesByCategory: PropTypes.shape({}).isRequired,
  billablesWithPriceScheduleById: PropTypes.shape({}).isRequired,
  priceSchedulesById: PropTypes.shape({}).isRequired,
  activeDiagnoses: PropTypes.arrayOf(PropTypes.shape({})),
  initialDiagnoses: PropTypes.arrayOf(PropTypes.shape({})),
  claim: encounterPropType,
  claimEncounters: PropTypes.arrayOf(PropTypes.shape({})),
  fetchBillables: PropTypes.func.isRequired,
  fetchDiagnoses: PropTypes.func.isRequired,
  fetchProviders: PropTypes.func.isRequired,
  fetchClaim: PropTypes.func.isRequired,
  isLoadingClaims: PropTypes.bool.isRequired,
  isLoadingBillableDiagnosesOrProviders: PropTypes.bool.isRequired,
  encountersError: PropTypes.string,
  billableAndDiagnosesError: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  manualSubmission: PropTypes.bool,
  createEncounterWithDelta: PropTypes.func.isRequired,
  reviseEncounterAndCreateWithDelta: PropTypes.func.isRequired,
  createPriceSchedulesWithDeltas: PropTypes.func.isRequired,
  createMemberWithDelta: PropTypes.func.isRequired,
  createIdentificationEventWithDelta: PropTypes.func.isRequired,
  currentUserProvider: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    administrativeDivisionId: PropTypes.number,
    providerType: PropTypes.string,
  }).isRequired,
  history: historyPropType.isRequired,
  inboundReferralDetails: PropTypes.shape({}),
  outboundReferralDetails: PropTypes.shape({}),
  providerVisitTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isDischarge: PropTypes.bool.isRequired,
  })).isRequired,
  isHealthCenter: PropTypes.bool.isRequired,
};

ClaimSubmissionFormContainer.defaultProps = {
  activeDiagnoses: [],
  initialDiagnoses: [],
  encountersError: null,
  billableAndDiagnosesError: null,
  member: null,
  claim: null,
  claimEncounters: [],
  manualSubmission: false,
  inboundReferralDetails: {},
  outboundReferralDetails: {},
};
