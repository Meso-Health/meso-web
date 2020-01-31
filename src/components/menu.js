import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { userSelector } from 'store/auth/auth-selectors';

import { featureFlags, CONTACT_EMAIL, ROLE_PERMISSIONS, ROUTES } from 'lib/config';
import { showRoute } from 'lib/auth-utils';

import { exportData as exportDataAction } from 'store/export/export-actions';
import { countUnsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';

import Box from 'components/box';
import Button from 'components/button';
import BrandedLogo from 'components/branded-logo';
import { PillLink } from 'components/links';
import LogoutModal from 'components/logout-modal';

import { Text } from 'components/text';

const MenuContainer = styled.header`
  height: ${props => props.theme.layout.menuHeight}px;
  ${props => !props.supportsMobile && css`
    min-width: ${props.theme.layout.menuMinWidth}px;
  `}
  ${props => props.withBackground && css`
    background: ${props.theme.colors.black};
    color: white;
  `};
`;

const MenuLink = ({ to, children }) => (
  <Box marginHorizontal={3}>
    <PillLink to={to} inverse>
      <Text fontSize={2}>{children}</Text>
    </PillLink>
  </Box>
);

MenuLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const CurrentUser = styled.span`
  font-size: ${props => props.theme.font.size[2]};
  opacity: 0.6;
  margin-right: ${props => props.theme.space[4]};
  line-height: 26px;
`;

const MenuNavigation = styled(Box)`
  ${props => props.supportsMobile && `
    @media only screen and (max-width: 768px) {
      display: none;
    }
  `}
`;

const Menu = ({ isErrorMenu, supportsMobile }) => {
  const dispatch = useDispatch();
  const [showLogoutModal, setModalVisibility] = useState(false);

  const {
    user,
    unsyncedClaimCount,
  } = useSelector(state => ({
    user: userSelector(state),
    unsyncedClaimCount: countUnsyncedDeltasByModelType(state, 'Encounter'),
  }));

  const { BRANDED_LOGO_URL } = featureFlags;
  const currentPermissions = ROLE_PERMISSIONS[user.role];

  return (
    <MenuContainer withBackground={!isErrorMenu} supportsMobile={supportsMobile}>
      {isErrorMenu ? (
        <Box padding={4} flex alignItems="center" justifyContent="space-between">
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact support</a>
        </Box>
      ) : (
        <Box flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box>
            {BRANDED_LOGO_URL && <BrandedLogo url={BRANDED_LOGO_URL} height={54} />}
          </Box>
          <Box padding={3} flex alignItems="center" justifyContent="space-between">
            <MenuNavigation flex supportsMobile={supportsMobile}>
              {showRoute(currentPermissions, ROUTES.CHECK_IN.route_match) && (
                <MenuLink to={ROUTES.CHECK_IN.base_url}>Check In</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.CLAIMS.route_match) && (
                <MenuLink to={ROUTES.CLAIMS.base_url}>Claims</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.ENROLLMENT_REPORTING.route_match) && (
                <MenuLink to={ROUTES.ENROLLMENT_REPORTING.base_url}>Enrollment</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.MEMBERS.route_match) && (
                <MenuLink to={ROUTES.MEMBERS.base_url}>Members</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.REIMBURSEMENTS.route_match) && (
                <MenuLink to={ROUTES.REIMBURSEMENTS.base_url}>Reimbursements</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.SUBMISSIONS.route_match) && (
                <MenuLink to={ROUTES.SUBMISSIONS.base_url}>Submissions</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.SUMMARY.route_match) && (
                <MenuLink to={ROUTES.SUMMARY.base_url}>Summary</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.USERS.route_match) && (
                <MenuLink to={ROUTES.USERS.base_url}>Users</MenuLink>
              )}
              {showRoute(currentPermissions, ROUTES.STATUS.route_match) && (
                <MenuLink to={ROUTES.STATUS.base_url}>Status</MenuLink>
              )}
            </MenuNavigation>
          </Box>
          <Box flex padding={3} flexDirection="row" alignItems="center">
            <Box>
              <CurrentUser>{user.name}</CurrentUser>
            </Box>
            <Box>
              <Button small inverse onClick={() => setModalVisibility(true)}>Log out</Button>
            </Box>
          </Box>
        </Box>
      )}
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setModalVisibility(false)}
          onExport={() => dispatch(exportDataAction())}
          unsyncedClaimCount={unsyncedClaimCount || 0}
        />
      )}
    </MenuContainer>
  );
};

Menu.propTypes = {
  isErrorMenu: PropTypes.bool,
  supportsMobile: PropTypes.bool,
};

Menu.defaultProps = {
  isErrorMenu: false,
  supportsMobile: false,
};

export default Menu;
