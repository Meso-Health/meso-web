// eslint-disable-next-line import/prefer-default-export
export const ROUTES = {
  CHECK_IN: { base_url: '/check-in', route_match: '/check-in' },
  CLAIMS: { base_url: '/claims', route_match: '/claims' },
  CLAIMS_EXTERNAL: { base_url: '/claims', route_match: '/claims/:adjudicationState(external)?' },
  ENROLLMENT_REPORTING: { base_url: '/enrollment-reporting', route_match: '/enrollment-reporting' },
  MEMBERS: { base_url: '/members', route_match: '/members' },
  REIMBURSEMENTS: { base_url: '/reimbursements', route_match: '/reimbursements/:route(created)?/:id?' },
  SUBMISSIONS: { base_url: '/submissions', route_match: '/submissions' },
  SUBMISSIONS_EDIT: { base_url: '/submissions', route_match: '/submissions/:id/edit' },
  SUMMARY: { base_url: '/summary', route_match: '/summary' },
  USERS: { base_url: '/users', route_match: '/users' },
  LOGIN: { base_url: '/login', route_match: '/login' },
  LOGOUT: { base_url: '/logout', route_match: '/logout' },
  STATUS: { base_url: '/status', route_match: '/status' },
};
