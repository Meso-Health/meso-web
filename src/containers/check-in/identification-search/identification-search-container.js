import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SEARCH_METHODS } from 'lib/config';

import { memberSearchQuerySelector } from 'store/search-ui/search-ui-selectors';
import { historyPropType } from 'store/prop-types';

import MemberSearchInputAndResults from 'containers/member/member-search-input-and-results';
import { UnderlinedLink } from 'components/links';

import { LayoutWithHeader } from 'components/layouts';

import CheckInModal from 'containers/check-in/member-detail/components/check-in-modal';

class IdentificationSearchContainer extends Component {
  static mapStateToProps = state => ({
    query: memberSearchQuerySelector(state),
  });

  constructor(props) {
    super(props);

    this.state = {
      activeTab: null,
      checkInModalOpen: false,
    };
  }

  handleOpenCheckInModal = () => {
    this.setState({ checkInModalOpen: true });
  }

  handleCloseCheckInModal = () => {
    this.setState({ checkInModalOpen: false });
  }

  handleRowClick = (memberId) => {
    const { activeTab } = this.state;
    const { history } = this.props;
    const searchMethod = SEARCH_METHODS[activeTab.key];

    history.push(`/check-in/members/${memberId}/${searchMethod}`);
  }

  render() {
    const { history, query } = this.props;
    const { activeTab, checkInModalOpen } = this.state;

    const checkInManuallyString = ' or check-in manually';
    return (
      <LayoutWithHeader pageTitle="Check In" steps={[{ title: 'Check In', href: '/check-in' }, { title: 'Search', href: '/check-in/search' }]}>
        <MemberSearchInputAndResults
          onSelectTab={(tab) => {
            this.setState({ activeTab: tab });
          }}
          extraHintIfNoResults={
            (activeTab === 'membershipNumber')
            && (
              <UnderlinedLink onClick={this.handleOpenCheckInModal}>{checkInManuallyString}</UnderlinedLink>
            )
          }
          handleRowClick={memberId => this.handleRowClick(memberId)}
        />
        {checkInModalOpen && (
          <CheckInModal
            onCancel={this.handleCloseCheckInModal}
            searchMethod={SEARCH_METHODS.manual}
            history={history}
            membershipNumber={query}
            manualCheckIn
          />
        )}
      </LayoutWithHeader>
    );
  }
}

export default connect(
  IdentificationSearchContainer.mapStateToProps,
  IdentificationSearchContainer.mapDispatchToProps,
)(IdentificationSearchContainer);

IdentificationSearchContainer.propTypes = {
  history: historyPropType.isRequired,
  query: PropTypes.string,
};

IdentificationSearchContainer.defaultProps = {
  query: '',
};
