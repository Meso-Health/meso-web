import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  CALENDAR_FORMATS,
  DATE_FORMAT,
  DATE_PICKER_FORMAT,
  DATE_PICKER_ETH_FORMAT,
  localeConsts,
} from 'lib/config';
import { toGregorian } from 'ethiopian-date';
import TextField from 'components/inputs/text-field';
import { ErrorLabel } from 'components/alerts';
import CalendarPicker from 'components/inputs/calendar-picker';

const { GLOBAL_DATE_FORMAT } = localeConsts;

class DatePicker extends Component {
  constructor(props) {
    super(props);

    let dateFormat = DATE_PICKER_FORMAT;
    const calendarType = GLOBAL_DATE_FORMAT;

    if (GLOBAL_DATE_FORMAT === CALENDAR_FORMATS.ETHIOPIAN) {
      dateFormat = DATE_PICKER_ETH_FORMAT;
    }

    this.state = {
      dateFormat,
      calendarType,
      showCalendar: false,
      date: '',
    };
  }

  clear = () => {
    this.setState({ date: undefined });
  }

  toggleCalendar = () => {
    const { showCalendar } = this.state;

    this.setState({ showCalendar: !showCalendar });
  }

  handleSelect = (date) => {
    const { onChange } = this.props;
    const { calendarType } = this.state;
    this.setState({ date });

    if (calendarType === CALENDAR_FORMATS.ETHIOPIAN) {
      // we know the format is dd-mm-yyyy because we set it in constructor
      const [day, month, year] = date.split('-');
      const gregorianDate = toGregorian(
        parseInt(year, 10),
        parseInt(month, 10),
        parseInt(day, 10),
      );

      // Previously: we were subtracting 1, but the index doesn't need to
      // be compensated for if we send in the date format to moment
      // gregorianDate[1] -= 1;

      onChange(moment.utc(gregorianDate, DATE_FORMAT), date);
    } else {
      onChange(moment.utc(date, DATE_FORMAT), date);
    }
    this.setState({ showCalendar: false });
  }

  render() {
    const { date, showCalendar, dateFormat, calendarType } = this.state;
    const { minDate, maxDate, name, disabled, label, defaultDate, error, overlayCalendar, internalLabel } = this.props;
    const inputValue = date || defaultDate;
    return (
      <div>
        {disabled ? (
          <>
            <TextField
              name={name}
              label={label}
              internalLabel={internalLabel}
              value=""
              disabled
            />
          </>
        ) : (
          <>
            <TextField
              onClick={this.toggleCalendar}
              name={name}
              label={label}
              internalLabel={internalLabel}
              value={inputValue || ''}
              placeholder="Select date..."
              hasError={Boolean(error)}
              readOnly
            />
            {showCalendar && (
              <CalendarPicker
                defaultDate={defaultDate}
                disabled={disabled}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat={dateFormat}
                calendarType={calendarType}
                onSelect={this.handleSelect}
                overlayCalendar={overlayCalendar}
              />
            )}
            {error && (
              <ErrorLabel>{error}</ErrorLabel>
            )}
          </>
        )}
      </div>
    );
  }
}

export default DatePicker;

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired, // (moment date obj (Gregorian), DD_MM_YYYY String) => {... }
  disabled: PropTypes.bool,
  label: PropTypes.string,
  defaultDate: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  name: PropTypes.string.isRequired,
  overlayCalendar: PropTypes.bool,
  error: PropTypes.string,
  internalLabel: PropTypes.bool,
};

DatePicker.defaultProps = {
  disabled: false,
  label: null,
  defaultDate: null,
  minDate: null,
  maxDate: null,
  overlayCalendar: true,
  error: null,
  internalLabel: false,
};
