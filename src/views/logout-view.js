import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logout } from 'store/auth/auth-actions';
import Box from 'components/box';
import { Paragraph } from 'components/text';

class LogOutView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      redirectToIndex: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(logout()).then(() => {
      this.setState({ redirectToIndex: true });
    });
  }

  render() {
    const { redirectToIndex } = this.state;
    if (redirectToIndex) {
      return <Redirect to="/" />;
    }

    return (
      <Box padding={4}>
        <Paragraph fontSize={2}>
          You are now logged out. Feel free to close this page.
        </Paragraph>
      </Box>
    );
  }
}

export default connect()(LogOutView);

LogOutView.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
