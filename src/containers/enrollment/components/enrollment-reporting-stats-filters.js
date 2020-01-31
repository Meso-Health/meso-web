import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';

import { formatDate } from 'lib/formatters/date';

import Box from 'components/box';
import { SelectField, DatePicker } from 'components/inputs';
import AdministrativeDivisionPicker from 'components/inputs/administrative-division-picker';
import Icon from 'components/icon';
import Button from 'components/button';

const EMPTY_VALUE = '-1';
const EMPTY_FILTER = {
  startDate: undefined,
  endDate: undefined,
  administrativeDivisionId: undefined,
  paying: undefined,
  renewal: undefined,
  gender: undefined,
};

class EnrollmentReportingStatsFilters extends Component {
  startDateRef = React.createRef();

  endDateRef = React.createRef();

  handleAdministrativeDivisionChange = (administrativeDivisionId) => {
    const { filters, updateFilters } = this.props;
    updateFilters({ ...filters, administrativeDivisionId });
  }

  handleDateChange = (momentDate, isStartDate) => {
    const { filters, updateFilters } = this.props;
    const filterKey = isStartDate ? 'startDate' : 'endDate';
    const isoDateString = momentDate.format('YYYY-MM-DD');
    updateFilters({ ...filters, [filterKey]: isoDateString });
  }

  handleSelectChange = (e) => {
    const { filters, updateFilters } = this.props;
    const value = e.target.value === EMPTY_VALUE ? undefined : e.target.value;
    updateFilters({ ...filters, [e.target.name]: value });
  }

  handleClearFilter = () => {
    const { updateFilters } = this.props;
    updateFilters(EMPTY_FILTER);

    if (this.startDateRef.current) {
      this.startDateRef.current.clear();
    }

    if (this.endDateRef.current) {
      this.endDateRef.current.clear();
    }
  }

  render() {
    const { administrativeDivisions, filters } = this.props;
    const { paying, renewal, gender, administrativeDivisionId } = filters;

    // convert current, start and end dates to format YYYY-MM-DD
    // to be compatiblewith DatePicker
    const formattedCurrentDate = formatDate(moment());
    const formattedStartDate = filters.startDate ? formatDate(filters.startDate) : undefined;
    const formattedEndDate = filters.endDate ? formatDate(filters.endDate) : undefined;

    const payingOptions = [
      { value: EMPTY_VALUE, name: 'Paying & Indigent' },
      { value: 'true', name: 'Paying' },
      { value: 'false', name: 'Indigent' },
    ];

    const renewalOptions = [
      { value: EMPTY_VALUE, name: 'New & Renewal' },
      { value: 'false', name: 'New' },
      { value: 'true', name: 'Renewal' },
    ];

    const genderOptions = [
      { value: EMPTY_VALUE, name: 'Female & Male' },
      { value: 'F', name: 'Female' },
      { value: 'M', name: 'Male' },
    ];

    return (
      <>
        <AdministrativeDivisionPicker
          handleChange={this.handleAdministrativeDivisionChange}
          administrativeDivisions={administrativeDivisions}
          administrativeDivisionId={administrativeDivisionId}
        />
        <Grid container>
          <Grid item xs={6}>
            <Box paddingRight={3} paddingBottom={3}>
              <SelectField
                key="paying"
                name="paying"
                label="Membership type"
                internalLabel
                options={payingOptions}
                value={paying || EMPTY_VALUE}
                onChange={this.handleSelectChange}
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box paddingRight={3} paddingBottom={3}>
              <DatePicker
                ref={this.startDateRef}
                defaultDate={formattedStartDate}
                label="Start Date"
                internalLabel
                name="start-date"
                maxDate={formattedEndDate || formattedCurrentDate}
                onChange={momentDate => this.handleDateChange(momentDate, true)}
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box paddingBottom={3}>
              <DatePicker
                ref={this.endDateRef}
                defaultDate={formattedEndDate}
                label="End Date"
                internalLabel
                minDate={formattedStartDate}
                maxDate={formattedCurrentDate}
                name="end-date"
                onChange={momentDate => this.handleDateChange(momentDate, false)}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6}>
            <Box paddingRight={3} paddingBottom={3}>
              <SelectField
                key="renewal"
                name="renewal"
                label="Enrollment type"
                internalLabel
                options={renewalOptions}
                value={renewal || EMPTY_VALUE}
                onChange={this.handleSelectChange}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box paddingBottom={3}>
              <SelectField
                key="gender"
                name="gender"
                label="Gender"
                internalLabel
                options={genderOptions}
                value={gender || EMPTY_VALUE}
                onChange={this.handleSelectChange}
              />
            </Box>
          </Grid>
        </Grid>
        <Box flex justifyContent="space-between">
          <Box flex flexDirection="column">
            <Button small onClick={this.handleClearFilter}>
              <Icon name="clear" size={18} iconSize={18} />
              {' Clear all filters'}
            </Button>
          </Box>
        </Box>
      </>
    );
  }
}

export default EnrollmentReportingStatsFilters;

EnrollmentReportingStatsFilters.propTypes = {
  administrativeDivisions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    administrativeDivisionId: PropTypes.number,
    paying: PropTypes.string,
    renewal: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  updateFilters: PropTypes.func.isRequired,
};
