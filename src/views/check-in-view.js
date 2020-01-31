import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CheckInOverviewContainer from 'containers/check-in/overview/check-in-overview-container';
import IdentificationSearchContainer from 'containers/check-in/identification-search/identification-search-container';
import CheckInMemberDetailContainer from 'containers/check-in/member-detail/check-in-member-detail-container';

const CheckInView = () => {
  const steps = [{ title: 'Check In', href: '/check-in' }];

  return (
    <>
      <Switch>
        <Route
          path="/check-in/members/:id/:searchMethod"
          render={props => (<CheckInMemberDetailContainer {...props} steps={steps} />)}
        />
        <Route
          path="/check-in/members/:id"
          render={props => (<CheckInMemberDetailContainer {...props} steps={steps} />)}
        />
        <Route
          exact
          path="/check-in/search"
          render={props => (<IdentificationSearchContainer {...props} steps={steps} />)}
        />
        <Route
          path="/check-in"
          render={props => (<CheckInOverviewContainer {...props} steps={steps} />)}
        />
      </Switch>
    </>
  );
};

export default CheckInView;
