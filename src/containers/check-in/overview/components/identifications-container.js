import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { formatGender } from 'lib/formatters';
import { formatDate, formatAgeFromBirthdate } from 'lib/formatters/date';
import { filterByPredicate } from 'lib/utils';

import { curriedMemberAdministrativeDivisionSelectorCreator } from 'store/members/members-selectors';
import { administrativeDivisionsByIdSelector } from 'store/administrative-divisions/administrative-divisions-selectors';
import { fetchAdministrativeDivisions as fetchAdministrativeDivisionsAction } from 'store/administrative-divisions/administrative-divisions-actions';

import Box from 'components/box';
import Button from 'components/button';
import { Link } from 'react-router-dom';
import { SearchInput } from 'components/inputs';
import { Text } from 'components/text';

import IdentificationEventsTable from 'containers/check-in/overview/components/identification-events-table';

class IdentificationsContainer extends Component {
  static mapStateToProps = state => ({
    administrativeDivisionsById: administrativeDivisionsByIdSelector(state),
    curriedMemberAdministrativeDivisionSelector: curriedMemberAdministrativeDivisionSelectorCreator(state),
  });

  static mapDispatchToProps = dispatch => ({
    fetchAdministrativeDivisions: () => dispatch(fetchAdministrativeDivisionsAction()),
  });

  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
    };
  }

  componentDidMount() {
    const { fetchAdministrativeDivisions } = this.props;
    fetchAdministrativeDivisions();
  }

  handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    this.setState({ searchValue });
  }

  render() {
    const { identificationEvents, membersById, curriedMemberAdministrativeDivisionSelector } = this.props;
    const { searchValue } = this.state;

    const tableData = identificationEvents.map((idEvent) => {
      const member = membersById[idEvent.memberId];

      const administrativeDivision = curriedMemberAdministrativeDivisionSelector(member.id);

      return {
        id: idEvent.id,
        memberId: idEvent.memberId,
        fullName: member.fullName,
        membershipNumber: member.membershipNumber,
        administrativeDivisionName: administrativeDivision ? administrativeDivision.name : null,
        medicalRecordNumber: member.medicalRecordNumber,
        gender: formatGender(member.gender),
        age: formatAgeFromBirthdate(member.birthdate),
        occurredAt: formatDate(idEvent.occurredAt),
      };
    });
    const filteredTableData = filterByPredicate(searchValue, ['fullName', 'membershipNumber', 'medicalRecordNumber', 'administrativeDivision'])(tableData);

    return (
      <>
        <Box flex justifyContent="space-between" marginBottom={4}>
          <Box width="30%">
            <SearchInput
              placeholder="Search"
              onChange={this.handleSearchInputChange}
            />
          </Box>
          <Box>
            <Link to="/check-in/search">
              <Button primary inline onClick={this.handleSearchButtonClick}>
                <Text fontSize={5} marginRight={3}>&#65291;</Text>
                <Text>Check in</Text>
              </Button>
            </Link>
          </Box>
        </Box>
        {identificationEvents
          && <IdentificationEventsTable tableData={filteredTableData} />}
        {!identificationEvents && (
          <Box flex justifyContent="center" marginTop={6}>
            <Text>No checked in members</Text>
          </Box>
        )}
      </>
    );
  }
}

IdentificationsContainer.propTypes = {
  identificationEvents: PropTypes.arrayOf(PropTypes.shape({})),
  membersById: PropTypes.shape({}).isRequired,
  administrativeDivisionsById: PropTypes.shape({}).isRequired,
  fetchAdministrativeDivisions: PropTypes.func.isRequired,
  curriedMemberAdministrativeDivisionSelector: PropTypes.func.isRequired,
};

IdentificationsContainer.defaultProps = {
  identificationEvents: [],
};

export default connect(
  IdentificationsContainer.mapStateToProps,
  IdentificationsContainer.mapDispatchToProps,
)(IdentificationsContainer);
