import React, { Component } from 'react';

import MemberSearchInputAndResults from 'containers/member/member-search-input-and-results';
import { LayoutWithHeader } from 'components/layouts';
import Container from 'components/container';

import { historyPropType } from 'store/prop-types';

class MemberSearchContainer extends Component {
  handleRowClick = (memberId) => {
    const { history } = this.props;
    history.push(`/members/${memberId}`);
  }

  render() {
    return (
      <LayoutWithHeader pageTitle="Members" steps={[{ title: 'Members', href: '/members' }]}>
        <Container>
          <MemberSearchInputAndResults
            handleRowClick={memberId => this.handleRowClick(memberId)}
          />
        </Container>
      </LayoutWithHeader>
    );
  }
}

MemberSearchContainer.propTypes = {
  history: historyPropType.isRequired,
};

export default MemberSearchContainer;
