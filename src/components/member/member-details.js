import React, { Children, Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { lowerCase, pickBy, identity } from 'lodash/fp';

import { snakeCaseObject, isObjectEmpty } from 'lib/utils';
import { validateField, validators } from 'lib/validations';
import { formatPhotoUrl } from 'lib/formatters';

import { memberPropType } from 'store/prop-types';

import Button from 'components/button';
import Box from 'components/box';
import DetailSection from 'components/detail-section';
import { MetadataList } from 'components/list';
import { ViewTitle } from 'components/text';
import { UnderlinedAnchor } from 'components/links';
import Modal from 'components/modal';
import { Alert, MessageAlert } from 'components/alerts';

import EditObjectForm from 'containers/edit-object-form/edit-object-form';

import MembershipStatus from 'components/member/membership-status';
import MemberPhoto from './member-photo';

const emptyFields = {
  fullName: '',
  gender: '',
  profession: '',
  phoneNumber: '',
  photo: '',
};

class MemberDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEditMemberField: null,
      fields: emptyFields,
      errors: emptyFields,
      displayServerError: false,
    };
  }

  setCurrentEditMemberField = (field) => {
    this.setState({ currentEditMemberField: field });
  }

  handleEditMemberModalFieldChange = (e) => {
    const { errors, fields } = this.state;
    this.setState({
      errors: { ...errors, [e.target.name]: '' },
      fields: { ...fields, [e.target.name]: e.target.name === 'photo' ? e.target.files : e.target.value },
    });
  }

  clearFields = () => {
    this.setState({
      fields: emptyFields,
      errors: emptyFields,
    });
  }

  closeEditMemberModal = () => {
    this.clearFields();
    this.setState({
      currentEditMemberField: null,
      displayServerError: false,
    });
  }

  checkFieldErrors = (callback) => {
    const { currentEditMemberField, fields, errors } = this.state;

    this.setState({
      errors: {
        ...errors,
        [currentEditMemberField]:
          validateField(validators[currentEditMemberField], fields[currentEditMemberField], null),
      },
    }, callback);
  }

  resolveUpdate = (action) => {
    if (action.errorMessage) {
      this.setState({ displayServerError: true });
    } else {
      this.closeEditMemberModal();
    }
  }

  sendPhotoUpdateRequest = () => {
    const { member, updateMemberPhoto } = this.props;
    const { id } = member;
    const { fields, errors } = this.state;

    if (isObjectEmpty(errors)) {
      updateMemberPhoto(id, fields.photo[0]).then((action) => {
        this.resolveUpdate(action);
      });
    }
  }

  sendFieldUpdateRequest = () => {
    const { member, updateMember } = this.props;
    const { id } = member;
    const { fields, errors } = this.state;

    const memberChanges = pickBy(identity)(fields);
    memberChanges.id = id;

    if (isObjectEmpty(errors)) {
      updateMember(snakeCaseObject(memberChanges)).then((action) => {
        this.resolveUpdate(action);
      });
    }
  }

  handleEditMemberSubmit = (e, field) => {
    e.preventDefault();

    // passing in sending request function as callback
    if (field === 'photo') {
      this.checkFieldErrors(this.sendPhotoUpdateRequest);
    } else {
      this.checkFieldErrors(this.sendFieldUpdateRequest);
    }
  }

  renderAction(field) {
    return (<UnderlinedAnchor onClick={() => this.setCurrentEditMemberField(field)}>Edit</UnderlinedAnchor>);
  }

  render() {
    const {
      member,
      membershipStatus,
      memberCanRenew,
      isSubmitting,
      children,
      updateMemberPhoto,
      primaryAction,
      editableItemNames,
    } = this.props;
    const { currentEditMemberField, fields, errors, displayServerError } = this.state;

    return (
      <>
        {memberCanRenew && (
          <MessageAlert
            type="warning"
            title="Member can renew"
            description="Membership has not yet renewed for the current enrollment period."
          />
        )}
        <Box flex justifyContent="space-between">
          <DetailSection>
            <Box flex justifyContent="flex-start">
              <MemberPhoto src={formatPhotoUrl(member.photoUrl)} name="Name" />
              <Box marginLeft={4}>
                <ViewTitle>{member.fullName}</ViewTitle>
              </Box>
            </Box>
            {updateMemberPhoto && (
              <Box marginTop={3}>
                <UnderlinedAnchor onClick={() => this.setCurrentEditMemberField('photo')}>Edit photo</UnderlinedAnchor>
              </Box>
            )}
          </DetailSection>
          {primaryAction
            && (
              <Box>
                <Button primary onClick={primaryAction.onClick}>{primaryAction.buttonText}</Button>
              </Box>
            )}
        </Box>
        <MembershipStatus {...membershipStatus} />
        <DetailSection title="Member information">
          <MetadataList>
            {Children.map(children, (child) => {
              const { name } = child.props;
              if (editableItemNames.includes(name)) {
                return cloneElement(child, { action: this.renderAction(name) });
              }
              return child;
            })}
          </MetadataList>
        </DetailSection>
        {currentEditMemberField && (
          <Modal title={`Edit ${lowerCase(currentEditMemberField)}`} onRequestClose={this.closeEditMemberModal}>
            {displayServerError && (
              <Box marginBottom={4}>
                <Alert>An unknown error occurred. Please refresh the page and try again.</Alert>
              </Box>
            )}
            <EditObjectForm
              isSubmitting={isSubmitting}
              field={currentEditMemberField}
              onCancel={this.closeEditMemberModal}
              onSubmit={this.handleEditMemberSubmit}
              object={fields}
              errors={errors}
              handleFieldChange={this.handleEditMemberModalFieldChange}
            />
          </Modal>
        )}
      </>
    );
  }
}

export default MemberDetails;


MemberDetails.propTypes = {
  member: memberPropType,
  membershipStatus: PropTypes.shape({
    memberStatusEnum: PropTypes.string.isRequired,
    memberStatusDate: PropTypes.string.isRequired,
    beneficiaryStatusEnum: PropTypes.string,
    beneficiaryStatusDate: PropTypes.string,
  }),
  memberCanRenew: PropTypes.bool,
  updateMember: PropTypes.func.isRequired,
  updateMemberPhoto: PropTypes.func,
  isSubmitting: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  editableItemNames: PropTypes.arrayOf(PropTypes.string),
  primaryAction: PropTypes.shape({
    buttonText: PropTypes.string,
    onClick: PropTypes.func,
  }),
};

MemberDetails.defaultProps = {
  editableItemNames: [],
  member: {},
  membershipStatus: {},
  memberCanRenew: null,
  updateMemberPhoto: null,
  primaryAction: null,
};
