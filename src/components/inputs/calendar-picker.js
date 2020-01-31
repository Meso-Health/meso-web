/* eslint-disable no-return-assign */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import $ from 'jquery';

require('lib/date-picker/jquery.plugin.js');
require('lib/date-picker/jquery.calendars.all.js');
require('lib/date-picker/jquery.calendars.ethiopian.js');
require('lib/date-picker/meso.calendars.picker.css');

class CalendarPicker extends React.Component {
  pickerRef = React.createRef();

  componentDidMount() {
    const { minDate, maxDate, defaultDate, dateFormat, calendarType, disabled } = this.props;
    const calendar = $.calendars.instance(calendarType);
    this.$pickerRef = $(this.pickerRef.current);
    this.$pickerRef.calendarsPicker({
      calendar,
      defaultDate,
      minDate,
      maxDate,
      onSelect: this.handleSelect,
      dateFormat,
    });
    if (disabled) {
      this.$pickerRef.calendarsPicker('disable');
    }
  }

  componentDidUpdate(prevProps) {
    const { disabled } = this.props;
    if (disabled !== prevProps.disabled) {
      if (disabled) {
        this.$pickerRef.calendarsPicker('disable');
      } else {
        this.$pickerRef.calendarsPicker('enable');
      }
    }
  }

  componentWillUnmount() {
    this.$pickerRef.calendarsPicker('destroy');
  }

  handleSelect = (date) => {
    const { onSelect, dateFormat } = this.props;
    if (date[0]) {
      onSelect(date[0].formatDate(dateFormat));
    }
  }

  render() {
    const { overlayCalendar } = this.props;

    return (
      <StyledPicker overlay={overlayCalendar} id="picker" ref={this.pickerRef} />
    );
  }
}

const StyledPicker = styled.div`
  ${props => props.overlay && css`
    position: absolute;
    z-index: 1000;
  `}
`;

export default CalendarPicker;

CalendarPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  calendarType: PropTypes.string.isRequired,
  defaultDate: PropTypes.string,
  overlayCalendar: PropTypes.bool,
};

CalendarPicker.defaultProps = {
  minDate: null,
  maxDate: null,
  disabled: false,
  defaultDate: null,
  overlayCalendar: true,
};
