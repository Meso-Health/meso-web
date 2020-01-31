import {
  featureFlags,
  ROUTES,
  claimsAdjudicationPermissions,
  claimsApprovalPermissions,
  claimsPreparationPermissions,
  claimsReimbursementPermissions,
  claimsStatisticsPermissions,
  claimsResubmissionPermissions,
  claimsViewOnlyPermissions,
  enrollmentPermissions,
  enrollmentStatisticsPermissions,
  identificationPermissions,
  reimbursementsViewOnlyPermissions,
  memberViewOnlyPermissions,
  membershipPermissions,
  externalClaimsViewPermissions,
} from 'lib/config';

const {
  ENABLE_CLAIMS,
  ENABLE_FACILITY_REPORTING,
  ENABLE_MEMBER_EDITING,
  ENABLE_ENROLLMENT_REPORTING,
  ENABLE_REIMBURSEMENTS,
  ENABLE_SUBMISSION,
  ENABLE_CHECK_IN,
  ENABLE_STATUS,
} = featureFlags;

// Checks that a user has a single permission
export const userHasPermission = (currentUserPermissions, permission) => currentUserPermissions.includes(permission);

// Checks that a user has all permissions in set
export const userHasAllPermissionsInSet = (currentUserPermissions, neededPermissions) => {
  if (!currentUserPermissions) {
    return false;
  }
  return neededPermissions.every(permission => userHasPermission(currentUserPermissions, permission));
};

// Checks that a user has full set of permissions from a list of sets
// only needs to match one set
export const userHasPermissionSetFromList = (currentUserPermissions, permissionSetList) => {
  if (!currentUserPermissions) {
    return false;
  }

  return permissionSetList.some(set => userHasAllPermissionsInSet(currentUserPermissions, set));
};

export const showRoute = (currentPermissions, routeName) => {
  let permissions = [];
  let hasFlagsSet = true;

  switch (routeName) {
    case ROUTES.CHECK_IN.route_match:
      hasFlagsSet = ENABLE_CHECK_IN;
      permissions = [identificationPermissions];
      break;
    case ROUTES.CLAIMS.route_match:
      hasFlagsSet = ENABLE_CLAIMS;
      permissions = [
        claimsPreparationPermissions,
        claimsApprovalPermissions,
        claimsAdjudicationPermissions,
        claimsReimbursementPermissions,
        claimsResubmissionPermissions,
        claimsViewOnlyPermissions,
      ];
      break;
    case ROUTES.CLAIMS_EXTERNAL.route_match:
      hasFlagsSet = ENABLE_CLAIMS;
      permissions = [
        externalClaimsViewPermissions,
      ];
      break;
    case ROUTES.ENROLLMENT_REPORTING.route_match:
      hasFlagsSet = ENABLE_ENROLLMENT_REPORTING;
      permissions = [enrollmentStatisticsPermissions];
      break;
    case ROUTES.MEMBERS.route_match:
      hasFlagsSet = ENABLE_MEMBER_EDITING;
      permissions = [enrollmentPermissions, membershipPermissions, memberViewOnlyPermissions];
      break;
    case ROUTES.REIMBURSEMENTS.route_match:
      hasFlagsSet = ENABLE_REIMBURSEMENTS;
      permissions = [claimsReimbursementPermissions, reimbursementsViewOnlyPermissions];
      break;
    case ROUTES.SUBMISSIONS.route_match:
      hasFlagsSet = ENABLE_SUBMISSION;
      // TODO: see if having the role is necessary here
      permissions = [
        claimsApprovalPermissions,
        claimsPreparationPermissions,
      ];
      break;
      // TODO: check if this falls inline with 'resubmissionPermission'
    case ROUTES.SUBMISSIONS_EDIT.route_match:
      hasFlagsSet = ENABLE_SUBMISSION;
      permissions = [
        claimsPreparationPermissions,
        claimsResubmissionPermissions,
      ];
      break;
    case ROUTES.SUMMARY.route_match:
      hasFlagsSet = ENABLE_FACILITY_REPORTING;

      permissions = [claimsStatisticsPermissions];
      break;
    case ROUTES.STATUS.route_match:
      hasFlagsSet = ENABLE_STATUS;
      permissions = [claimsPreparationPermissions];
      break;
    default:
      return false;
  }

  return currentPermissions && hasFlagsSet && userHasPermissionSetFromList(currentPermissions, permissions);
};
