import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import Modal from 'components/modal';
import Box from 'components/box';
import Button from 'components/button';
import { Text } from 'components/text';

class OverrideModal extends Component {
  renderFooter() {
    const { onCancel, onOverride } = this.props;

    return (
      <Box flex alignItems="space-between" justifyContent="space-between">
        <Button small inline onClick={onCancel}>Cancel</Button>
        <Button small inline primary onClick={onOverride}>Yes, check in member</Button>
      </Box>
    );
  }

  render() {
    const { onCancel } = this.props;

    return (
      <Modal title="Check In" onRequestClose={onCancel} footer={this.renderFooter()}>
        <Box justifyContent="center">
          <Text>Member is marked as inactive or needs renewal.</Text>
          <Text> Are you sure you want to check in member?</Text>
        </Box>
      </Modal>
    );
  }
}

export default connect(
  OverrideModal.mapStateToProps,
  OverrideModal.mapDispatchToProps,
)(OverrideModal);

OverrideModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOverride: PropTypes.func.isRequired,
};
