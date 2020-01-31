import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from 'assets/icons/arrow-up.svg';
import { ReactComponent as ClaimStateApprovedIcon } from 'assets/icons/claim-state-approved.svg';
import { ReactComponent as ClaimStateRejectedIcon } from 'assets/icons/claim-state-rejected.svg';
import { ReactComponent as ClaimStateReturnedIcon } from 'assets/icons/claim-state-returned.svg';
import { ReactComponent as ClaimRowResubmittedIcon } from 'assets/icons/claim-row-resubmitted.svg';
import { ReactComponent as ClaimRowApprovedIcon } from 'assets/icons/claim-row-approved.svg';
import { ReactComponent as ClaimRowPaidIcon } from 'assets/icons/claim-row-paid.svg';
import { ReactComponent as ClaimRowRejectedIcon } from 'assets/icons/claim-row-rejected.svg';
import { ReactComponent as ClaimRowReturnedIcon } from 'assets/icons/claim-row-returned.svg';
import { ReactComponent as ClaimRowPendingIcon } from 'assets/icons/claim-row-pending.svg';
import { ReactComponent as ClearIcon } from 'assets/icons/clear.svg';
import { ReactComponent as DirectionDownIcon } from 'assets/icons/direct-down.svg';
import { ReactComponent as DirectionLeftIcon } from 'assets/icons/direct-left.svg';
import { ReactComponent as DirectionUpIcon } from 'assets/icons/direct-up.svg';
import { ReactComponent as DirectionRightIcon } from 'assets/icons/direct-right.svg';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as ErrorIcon } from 'assets/icons/error.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import { ReactComponent as BypassOverride } from 'assets/icons/claim-flag-bypass-override.svg';
import { ReactComponent as UnconfirmedMember } from 'assets/icons/claim-flag-unconfirmed-member.svg';
import { ReactComponent as UnlinkedReferral } from 'assets/icons/claim-flag-unlinked-referral.svg';
import { ReactComponent as InactiveMember } from 'assets/icons/claim-flag-inactive-member.svg';

export const icons = {
  add: AddIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-up': ArrowUpIcon,
  'bypass-override': BypassOverride,
  'claim-state-approved': ClaimStateApprovedIcon,
  'claim-state-rejected': ClaimStateRejectedIcon,
  'claim-state-returned': ClaimStateReturnedIcon,
  'claim-row-resubmitted': ClaimRowResubmittedIcon,
  'claim-row-approved': ClaimRowApprovedIcon,
  'claim-row-paid': ClaimRowPaidIcon,
  'claim-row-rejected': ClaimRowRejectedIcon,
  'claim-row-returned': ClaimRowReturnedIcon,
  'claim-row-pending': ClaimRowPendingIcon,
  clear: ClearIcon,
  'direct-down': DirectionDownIcon,
  'direct-left': DirectionLeftIcon,
  'direct-up': DirectionUpIcon,
  'direct-right': DirectionRightIcon,
  download: DownloadIcon,
  edit: EditIcon,
  error: ErrorIcon,
  'inactive-member': InactiveMember,
  search: SearchIcon,
  warning: WarningIcon,
  'unconfirmed-member': UnconfirmedMember,
  'unlinked-referral': UnlinkedReferral,
  user: UserIcon,
};

const StyledIcon = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: top;
`;

export default class Icon extends PureComponent {
  render() {
    const { name, iconSize, size, ...rest } = this.props;
    const NamedIcon = icons[name];

    if (!NamedIcon) {
      throw new TypeError(`'${name}' is not a valid icon`);
    }

    return (
      <StyledIcon {...rest} style={{ width: size, height: size }}>
        <NamedIcon width={iconSize} height={iconSize} />
      </StyledIcon>
    );
  }
}

Icon.propTypes = {
  iconSize: PropTypes.number,
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
  size: PropTypes.number,
};

Icon.defaultProps = {
  iconSize: 24,
  size: 24,
};
