import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, removeCurrencyFormatting } from 'lib/formatters/currency';

import TextField from './text-field';

const currencyRegex = /^\d*[.,]?\d{0,2}$/;

class CurrencyInput extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    const { value } = this.props;
    this.state = {
      value: value !== null ? formatCurrency(value) : '',
    };
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleBlur(e.target.value);
    }
  }

  handleBlur = (value) => {
    const { defaultValue, onChange } = this.props;

    // if value is empty we set to a default value
    if (value.length === 0) {
      onChange(defaultValue);
      this.setState({ value: formatCurrency(defaultValue) });
    } else {
      const rawValue = removeCurrencyFormatting(value);
      onChange(rawValue);
      this.setState({ value: formatCurrency(rawValue) });
    }
  }

  handleChange = (value) => {
    if (currencyRegex.test(value) || value.length === 0) {
      this.setState({ value });
    }
  }

  handleFocus = () => {
    this.inputRef.current.handleFocus();
  }

  render() {
    const { name, hasError, label, placeholder, disabled } = this.props;
    const { value } = this.state;
    return (
      <TextField
        ref={this.inputRef}
        name={name}
        type="text"
        value={value}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        hasError={hasError}
        onChange={e => this.handleChange(e.target.value)}
        onBlur={e => this.handleBlur(e.target.value)}
        onKeyDown={e => this.handleKeyDown(e)}
      />
    );
  }
}

export default CurrencyInput;

CurrencyInput.propTypes = {
  hasError: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.number.isRequired,
  value: PropTypes.number || PropTypes.string,
  label: PropTypes.string,
};

CurrencyInput.defaultProps = {
  disabled: false,
  hasError: false,
  value: '',
  placeholder: null,
  label: null,
};
