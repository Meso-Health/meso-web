import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LayoutWithHeader } from 'components/layouts';
import { countUnsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';
import { MetadataList, MetadataItem } from 'components/list';
import DetailSection from 'components/detail-section';
import { formatUploadCount } from 'lib/formatters';
import { formatTimeAgo } from 'lib/formatters/date';
import session from 'lib/session';

class StatusView extends Component {
  static mapDispatchToProps = () => ({
    /* No op */
  })

  static mapStateToProps = (state) => {
    const lastUpload = formatTimeAgo(session.getLastUploadTimestamp());
    const lastDownloadDiagnoses = formatTimeAgo(state.diagnoses.lastSuccessfulFetch);
    const lastDownloadBillables = formatTimeAgo(state.billables.lastSuccessfulFetch);
    const unsyncedClaimCount = formatUploadCount(countUnsyncedDeltasByModelType(state, 'Encounter'));
    const unsyncedPriceScheduleCount = formatUploadCount(countUnsyncedDeltasByModelType(state, 'PriceSchedule'));
    const unsyncedMemberCount = formatUploadCount(countUnsyncedDeltasByModelType(state, 'Member'));
    const unsyncedIdentificationEventCount = formatUploadCount(countUnsyncedDeltasByModelType(state, 'IdentificationEvent'));
    return {
      unsyncedClaimCount,
      unsyncedPriceScheduleCount,
      lastUpload,
      lastDownloadDiagnoses,
      lastDownloadBillables,
      unsyncedMemberCount,
      unsyncedIdentificationEventCount,
    };
  }

  render() {
    const {
      unsyncedClaimCount,
      unsyncedPriceScheduleCount,
      unsyncedIdentificationEventCount,
      unsyncedMemberCount,
      lastUpload,
      lastDownloadDiagnoses,
      lastDownloadBillables,
    } = this.props;

    return (
      <LayoutWithHeader pageTitle="Status" steps={[{ title: 'Status', href: '/status' }]}>
        <DetailSection title="Downloads (Data)">
          <MetadataList>
            <MetadataItem label="Billables" value={lastDownloadBillables} />
            <MetadataItem label="Diagnoses" value={lastDownloadDiagnoses} />
          </MetadataList>
        </DetailSection>
        <DetailSection title="Uploads (Data)">
          <MetadataList>
            <MetadataItem label="Last successful run" value={lastUpload} />
            <MetadataItem label="Claims" value={unsyncedClaimCount} />
            <MetadataItem label="Price Schedules" value={unsyncedPriceScheduleCount} />
            <MetadataItem label="Members" value={unsyncedMemberCount} />
            <MetadataItem label="Identification Events" value={unsyncedIdentificationEventCount} />
          </MetadataList>
        </DetailSection>
      </LayoutWithHeader>
    );
  }
}


export default connect(
  StatusView.mapStateToProps,
  StatusView.mapDispatchToProps,
)(StatusView);

StatusView.propTypes = {
  unsyncedClaimCount: PropTypes.string.isRequired,
  unsyncedPriceScheduleCount: PropTypes.string.isRequired,
  lastUpload: PropTypes.string.isRequired,
  lastDownloadDiagnoses: PropTypes.string.isRequired,
  lastDownloadBillables: PropTypes.string.isRequired,
  unsyncedMemberCount: PropTypes.string.isRequired,
  unsyncedIdentificationEventCount: PropTypes.string.isRequired,
};

StatusView.defaultProps = {};
