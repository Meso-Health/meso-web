import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { SUBMISSION_STATES } from 'lib/config';

import Box from 'components/box';
import Button from 'components/button';
import theme from 'styles/theme';

class SubmissionForm extends PureComponent {
  state = {
    isApproved: true,
  };

  handleSelectionChange = (isApproved) => {
    this.setState({ isApproved });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { onSubmit, encounter } = this.props;
    const data = new FormData(e.target);
    const submissionState = data.get('submissionState');
    const submittedAt = submissionState === SUBMISSION_STATES.SUBMITTED ? moment() : null;
    onSubmit({ id: encounter.id, submittedAt, submissionState });
  }

  render() {
    const { isSubmitting } = this.props;
    const { isApproved } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Box flex flexDirection="column" border={`1px ${theme.colors.gray[2]} solid`} borderRadius="4px" paddingVertical={5} paddingHorizontal={5}>
          <Box flex>
            <Box paddingRight={5}>
              <label htmlFor="approved">
                <input
                  id="approved"
                  type="radio"
                  name="submissionState"
                  value={SUBMISSION_STATES.SUBMITTED}
                  checked={isApproved}
                  onChange={e => this.handleSelectionChange(e.target.value)}
                />
                {' Approve'}
              </label>
            </Box>
            <Box>
              <label htmlFor="returned">
                <input
                  id="returned"
                  type="radio"
                  name="submissionState"
                  value={SUBMISSION_STATES.NEEDS_REVISION}
                  checked={!isApproved}
                  onChange={e => this.handleSelectionChange(!e.target.value)}
                />
                {' Return'}
              </label>
            </Box>
          </Box>
        </Box>
        <Box paddingTop={5}>
          <Button primary type="submit">{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
        </Box>
      </form>
    );
  }
}

export default SubmissionForm;

SubmissionForm.propTypes = {
  isSubmitting: PropTypes.bool,
  encounter: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

SubmissionForm.defaultProps = {
  isSubmitting: false,
};
