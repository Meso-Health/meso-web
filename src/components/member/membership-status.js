import React from 'react';
import PropTypes from 'prop-types';

import { MetadataList, MetadataItem } from 'components/list';
import DetailSection from 'components/detail-section';
import MembershipStatusIndicator from 'components/member/membership-status-indicator';

const MembershipStatus = ({ memberStatusEnum, memberStatusDate, beneficiaryStatusEnum, beneficiaryStatusDate }) => (
  <DetailSection title="Membership Status">
    <MetadataList>
      <MetadataItem label="Member" value={<MembershipStatusIndicator statusEnum={memberStatusEnum} statusDate={memberStatusDate} />} />
      {beneficiaryStatusEnum
        && <MetadataItem label="Beneficiary" value={<MembershipStatusIndicator statusEnum={beneficiaryStatusEnum} statusDate={beneficiaryStatusDate} />} />
      }
    </MetadataList>
  </DetailSection>
);

export default MembershipStatus;

MembershipStatus.propTypes = {
  memberStatusEnum: PropTypes.string.isRequired,
  memberStatusDate: PropTypes.string.isRequired,
  beneficiaryStatusEnum: PropTypes.string,
  beneficiaryStatusDate: PropTypes.string,
};

MembershipStatus.defaultProps = {
  beneficiaryStatusEnum: null,
  beneficiaryStatusDate: null,
};
