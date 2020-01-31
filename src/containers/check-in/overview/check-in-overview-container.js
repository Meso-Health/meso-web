import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { userPropType, historyPropType } from 'store/prop-types';
import { fetchOpenIdEvents } from 'store/identification-events/identification-events-actions';
import { openIdentificationEventsSelector } from 'store/identification-events/identification-events-selectors';
import { membersKeyedByIdSelector } from 'store/members/members-selectors';

import Box from 'components/box';
import LoadingIndicator from 'components/loading-indicator';
import { LayoutWithHeader } from 'components/layouts';

import IdentificationsContainer from 'containers/check-in/overview/components/identifications-container';

class CheckInOverviewContainer extends Component {
  static mapStateToProps = state => ({
    identificationEvents: openIdentificationEventsSelector(state),
    membersById: membersKeyedByIdSelector(state),
    isLoading: state.identificationEvents.isLoadingIdentificationEvents,
    fetchingError: state.identificationEvents.identificationEventsError,
    user: state.auth.user,
  });

  static mapDispatchToProps = dispatch => ({
    fetchOpenIdentificationEvents: providerId => dispatch(fetchOpenIdEvents(providerId)),
  });

  componentDidMount() {
    const { fetchOpenIdentificationEvents, user } = this.props;
    fetchOpenIdentificationEvents(user.providerId);
  }

  render() {
    const { identificationEvents, membersById, isLoading, fetchingError, history } = this.props;

    if (isLoading || fetchingError) {
      return (
        <LayoutWithHeader pageTitle="Check In" steps={[{ title: 'Check In', href: '/check-in' }]}>
          <Box paddingVertical={5}>
            <LoadingIndicator noun="check ins" error={fetchingError} />
          </Box>
        </LayoutWithHeader>
      );
    }

    return (
      <LayoutWithHeader pageTitle="Check In" steps={[{ title: 'Check In', href: '/check-in' }]}>
        <IdentificationsContainer
          identificationEvents={identificationEvents}
          membersById={membersById}
          history={history}
        />
      </LayoutWithHeader>
    );
  }
}

CheckInOverviewContainer.propTypes = {
  user: userPropType.isRequired,
  fetchOpenIdentificationEvents: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  fetchingError: PropTypes.string.isRequired,
  identificationEvents: PropTypes.arrayOf(PropTypes.shape({})),
  membersById: PropTypes.shape({}).isRequired,
  history: historyPropType.isRequired,
};

CheckInOverviewContainer.defaultProps = {
  identificationEvents: [],
};

export default connect(
  CheckInOverviewContainer.mapStateToProps,
  CheckInOverviewContainer.mapDispatchToProps,
)(CheckInOverviewContainer);
