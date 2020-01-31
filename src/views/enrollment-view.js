import React from 'react';
import { Route, Switch } from 'react-router-dom';

import EnrollmentReportingStatsContainer from 'containers/enrollment/enrollment-reporting-stats-container';

const EnrollmentView = () => (
  <Switch>
    <Route
      path="/enrollment-reporting"
      render={() => (<EnrollmentReportingStatsContainer />)}
    />
  </Switch>
);

export default EnrollmentView;
