import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/button';
import Box from 'components/box';

import GenericField from 'containers/edit-object-form/components/generic-field';
import PasswordField from 'containers/edit-object-form/components/password-field';
import PhotoField from 'containers/edit-object-form/components/photo-field';
import ProfessionField from 'containers/edit-object-form/components/profession-field';
import GenderField from 'containers/edit-object-form/components/gender-field';

import { validators } from 'lib/validations';

export default class EditObjectForm extends PureComponent {
  static propTypes = {
    errors: PropTypes.shape({}).isRequired,
    field: PropTypes.string.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    object: PropTypes.shape({}).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isSubmitting: false,
  }

  handleCancelClick = (e) => {
    e.preventDefault();
    const { onCancel } = this.props;
    onCancel();
  }

  handleChange = (e) => {
    const { handleFieldChange } = this.props;
    const field = e.target.name;
    const { formatter } = validators[field];

    if (typeof formatter === 'function') {
      e.target.value = formatter(e.target.value);
    }

    handleFieldChange(e);
  }

  render() {
    const { onSubmit, isSubmitting, field, object, errors } = this.props;
    let fieldComponent;

    if (field === 'password') {
      fieldComponent = <PasswordField object={object} errors={errors} handleChange={this.handleChange} />;
    } else if (field === 'gender') {
      fieldComponent = <GenderField object={object} errors={errors} handleChange={this.handleChange} />;
    } else if (field === 'profession') {
      fieldComponent = <ProfessionField object={object} errors={errors} handleChange={this.handleChange} />;
    } else if (field === 'photo') {
      fieldComponent = <PhotoField errors={errors} handleChange={this.handleChange} />;
    } else {
      fieldComponent = <GenericField field={field} object={object} errors={errors} handleChange={this.handleChange} />;
    }

    return (
      <form onSubmit={e => onSubmit(e, field)}>
        {fieldComponent}
        <Box marginTop={5} flex justifyContent="flex-end">
          <Button small inline onClick={this.handleCancelClick}>
            Cancel
          </Button>
          <Box marginLeft={3}>
            <Button small inline primary type="submit">
              {isSubmitting ? 'Saving...' : 'Save' }
            </Button>
          </Box>
        </Box>
      </form>
    );
  }
}
