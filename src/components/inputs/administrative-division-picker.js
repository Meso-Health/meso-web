import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { filter, find, flow, map, sortBy } from 'lodash/fp';
import Grid from '@material-ui/core/Grid';

import { ADMIN_DIVISIONS } from 'lib/config';

import Box from 'components/box';
import { SelectField } from 'components/inputs';

const EMPTY_VALUE = '-1';

class AdministrativeDivisionPicker extends Component {
  handleAdministrativeDivisionChange = (e) => {
    const { handleChange } = this.props;
    let value = e.target.value === EMPTY_VALUE ? undefined : parseInt(e.target.value, 10);
    if (!value) {
      // update the selection based on the filters from the previous division level
      const divisionLevel = e.target.name;
      const selectedDivisions = this.selectedDivisions();
      if (divisionLevel === ADMIN_DIVISIONS.THIRD_LEVEL) {
        // eslint-disable-next-line prefer-destructuring
        value = selectedDivisions[0];
      } else if (divisionLevel === ADMIN_DIVISIONS.FOURTH_LEVEL) {
        // eslint-disable-next-line prefer-destructuring
        value = selectedDivisions[1];
      }
    }
    handleChange(value);
  }

  selectedDivisions = () => {
    const { administrativeDivisions, administrativeDivisionId } = this.props;

    const ancestors = [];
    let ancestor = find(ad => ad.id === administrativeDivisionId)(administrativeDivisions);
    // don't include first-level divisons because they aren't used in the filter UI
    // TODO: we need to generalize this component for arbitrary levels of administrative divisions
    const findParent = find(ad => ad.id === ancestor.parentId && ad.level !== ADMIN_DIVISIONS.FIRST_LEVEL);
    while (ancestor) {
      ancestors.unshift(ancestor.id);
      ancestor = findParent(administrativeDivisions);
    }
    return ancestors;
  }

  render() {
    const { administrativeDivisions } = this.props;
    const selectedDivisions = this.selectedDivisions();
    const secondLevelId = selectedDivisions.shift();
    const thirdLevelId = selectedDivisions.shift();
    const fourthLevelId = selectedDivisions.shift();

    const secondLevelOptions = flow(
      filter(adminDivision => adminDivision.level === ADMIN_DIVISIONS.SECOND_LEVEL),
      map(division => ({
        value: division.id,
        name: division.name,
      })),
      sortBy(adminDivision => adminDivision.value),
    )(administrativeDivisions);

    const thirdLevelOptions = flow(
      filter(adminDivision => adminDivision.parentId === secondLevelId),
      map(division => ({
        value: division.id,
        name: division.name,
      })),
      sortBy(adminDivision => adminDivision.value),
    )(administrativeDivisions);

    const fourthLevelOptions = flow(
      filter(adminDivision => adminDivision.parentId === thirdLevelId),
      map(division => ({
        value: division.id,
        name: division.name,
      })),
      sortBy(adminDivision => adminDivision.value),
    )(administrativeDivisions);

    const secondLevelDropdownOptions = [
      { value: EMPTY_VALUE, name: `All ${ADMIN_DIVISIONS.SECOND_LEVEL}` },
      ...secondLevelOptions,
    ];

    const thirdLevelDropdownOptions = [
      { value: EMPTY_VALUE, name: `All ${ADMIN_DIVISIONS.THIRD_LEVEL}` },
      ...thirdLevelOptions,
    ];

    const fourthLevelDropdownOptions = [
      { value: EMPTY_VALUE, name: `All ${ADMIN_DIVISIONS.FOURTH_LEVEL}` },
      ...fourthLevelOptions,
    ];

    return (
      <Grid container>
        <Grid item xs={4}>
          <Box paddingRight={3} paddingBottom={3}>
            <SelectField
              key={ADMIN_DIVISIONS.SECOND_LEVEL}
              name={ADMIN_DIVISIONS.SECOND_LEVEL}
              label={`Member ${ADMIN_DIVISIONS.SECOND_LEVEL}`}
              internalLabel
              options={secondLevelDropdownOptions}
              value={secondLevelId || EMPTY_VALUE}
              onChange={this.handleAdministrativeDivisionChange}
            />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box paddingRight={3} paddingBottom={3}>
            <SelectField
              key={ADMIN_DIVISIONS.THIRD_LEVEL}
              name={ADMIN_DIVISIONS.THIRD_LEVEL}
              label={`Member ${ADMIN_DIVISIONS.THIRD_LEVEL}`}
              internalLabel
              options={thirdLevelDropdownOptions}
              value={thirdLevelId || EMPTY_VALUE}
              onChange={this.handleAdministrativeDivisionChange}
            />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box paddingBottom={3}>
            <SelectField
              key={ADMIN_DIVISIONS.FOURTH_LEVEL}
              name={ADMIN_DIVISIONS.FOURTH_LEVEL}
              label={`Member ${ADMIN_DIVISIONS.FOURTH_LEVEL}`}
              internalLabel
              options={fourthLevelDropdownOptions}
              value={fourthLevelId || EMPTY_VALUE}
              onChange={this.handleAdministrativeDivisionChange}
            />
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default AdministrativeDivisionPicker;

AdministrativeDivisionPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  administrativeDivisions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  administrativeDivisionId: PropTypes.number,
};

AdministrativeDivisionPicker.defaultProps = {
  administrativeDivisionId: undefined,
};
