import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Box from 'components/box';
import { Subtitle } from 'components/text';
import { UnderlinedAnchor } from 'components/links';

class SyncStatusIndicator extends PureComponent {
  render() {
    const { isLoading, unsyncedClaimCount, fetchingError, handleExportClick } = this.props;
    const claimText = unsyncedClaimCount === 1 ? 'claim' : 'claims';
    let component;
    if (isLoading) {
      component = (
        <Subtitle>Syncing...</Subtitle>
      );
    } else if (unsyncedClaimCount > 0) {
      component = (
        <>
          <Subtitle>{`${unsyncedClaimCount} ${claimText} to upload. `}</Subtitle>
          <UnderlinedAnchor onClick={(() => handleExportClick())}>
            Export
          </UnderlinedAnchor>
        </>
      );
    } else if (fetchingError) {
      component = (
        <>
          <Subtitle>Failed to sync because the computer seems to be offline. </Subtitle>
          <UnderlinedAnchor onClick={(() => window.location.reload())}>
            Try again.
          </UnderlinedAnchor>
        </>
      );
    } else {
      component = (
        <Subtitle>All claims synced.</Subtitle>
      );
    }
    return (
      <Box paddingLeft={3}>
        {component}
      </Box>
    );
  }
}

SyncStatusIndicator.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  unsyncedClaimCount: PropTypes.number.isRequired,
  fetchingError: PropTypes.string.isRequired,
  handleExportClick: PropTypes.func.isRequired,
};

export default SyncStatusIndicator;
