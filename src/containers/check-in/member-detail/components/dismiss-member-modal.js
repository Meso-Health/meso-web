import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { historyPropType } from 'store/prop-types';
import { patchIdentificationEvent as patchIdentificationEventAction } from 'store/identification-events/identification-events-actions';

import Modal from 'components/modal';
import Box from 'components/box';
import Button from 'components/button';
import { Alert } from 'components/alerts';

class DismissMemberModal extends Component {
  static mapDispatchToProps = dispatch => ({
    patchIdentificationEvent: (identificationEvent, identificationEventId) => (
      dispatch(patchIdentificationEventAction(identificationEvent, identificationEventId))
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      serverError: false,
    };
  }

  handleDismissMemberClick = () => {
    const { identificationEventId, patchIdentificationEvent, onCancel, history } = this.props;

    patchIdentificationEvent({ id: identificationEventId, dismissed: true }).then((action) => {
      if (action.errorMessage) {
        this.setState({ serverError: true });
      } else {
        onCancel();
        history.push('/check-in');
      }
    });
  };

  renderFooter() {
    const { onCancel } = this.props;

    return (
      <Box flex alignItems="space-between" justifyContent="space-between">
        <Button small inline onClick={onCancel}>Cancel</Button>
        <Button small inline primary onClick={this.handleDismissMemberClick}>Yes, dismiss member</Button>
      </Box>
    );
  }

  render() {
    const { onCancel } = this.props;
    const { serverError } = this.state;

    return (
      <Modal title="Dismiss Member" onRequestClose={onCancel} footer={this.renderFooter()}>
        {serverError && (
          <Box marginBottom={4}>
            <Alert>An error occurred. Please refresh the page and try again.</Alert>
          </Box>
        )}
        <Box textAlign="center" lineHeight="loose">
          Are you sure you want to dismiss member and remove them from the checked in list?
        </Box>
      </Modal>
    );
  }
}

export default connect(
  DismissMemberModal.mapStateToProps,
  DismissMemberModal.mapDispatchToProps,
)(DismissMemberModal);

DismissMemberModal.propTypes = {
  patchIdentificationEvent: PropTypes.func.isRequired,
  identificationEventId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  history: historyPropType.isRequired,
};
