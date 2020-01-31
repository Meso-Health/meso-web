import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ROUTES } from 'lib/config';

import Box from 'components/box';
import Button from 'components/button';
import { Text } from 'components/text';
import Modal from 'components/modal';

class LogoutModal extends Component {
  renderFooter() {
    const { onClose, onExport, unsyncedClaimCount } = this.props;

    return (
      <Box flex alignItems="space-between" justifyContent="space-between">
        <Box flex>
          <Box marginRight={2}>
            <Button small inline onClick={onClose}>Cancel</Button>
          </Box>
          {unsyncedClaimCount > 0 && (
            <Box>
              <Button small inline primary onClick={onExport}>Export</Button>
            </Box>
          )}
        </Box>
        <Link to={ROUTES.LOGOUT.base_url}><Button small inline primaryRed>Log out</Button></Link>
      </Box>
    );
  }

  render() {
    const { onClose, unsyncedClaimCount } = this.props;
    return (
      <Modal title="Logout" onRequestClose={onClose} footer={this.renderFooter()}>
        <Box flex marginTop={-4} flexDirection="column">
          <Box marginBottom={2}>
            <Text fontWeight="semibold">Are you sure you want to log out?</Text>
          </Box>
          {unsyncedClaimCount === 1 && <Text>{`There is ${unsyncedClaimCount} unsynced claim that will be deleted.`}</Text>}
          {unsyncedClaimCount > 1 && <Text>{`There are ${unsyncedClaimCount} unsynced claims that will be deleted.`}</Text>}
        </Box>
      </Modal>
    );
  }
}

export default LogoutModal;

LogoutModal.propTypes = {
  unsyncedClaimCount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};
