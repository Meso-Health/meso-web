import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Head from 'react-helmet';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash/fp';
import { Redirect } from 'react-router-dom';
import styled from '@emotion/styled';

import { login } from 'store/auth/auth-actions';

import Box from 'components/box';
import { Alert } from 'components/alerts';
import Button from 'components/button';
import { TextField } from 'components/inputs';
import BrandedLogo from 'components/branded-logo';
import { featureFlags } from '../lib/config';

/**
 * Styles
 */

const Centered = styled(Box)`
  background: ${props => props.theme.colors.gray[0]};
  height: 100vh;
`;

const Panel = styled.div`
  border-radius: 4px;
  max-width: 440px;
  width: 100%;
  background: white;
  padding: ${props => props.theme.space[5]};
  text-align: center;
`;

class LogInView extends PureComponent {
  static mapStateToProps = state => ({
    errorMessage: state.auth.errorMessage,
    isSubmitting: state.auth.isAuthenticating,
    isAuthenticated: state.auth.isAuthenticated,
  });

  static mapDispatchToProps = dispatch => ({
    loginWith: (username, password) => dispatch(login(username, password)),
  });

  constructor(props) {
    super(props);

    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();

    this.state = {
      username: '',
      password: '',
    };
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { loginWith } = this.props;
    const { username, password } = this.state;

    if (isEmpty(username)) {
      if (this.usernameRef.current) {
        this.usernameRef.current.handleFocus();
      }
      return;
    } if (isEmpty(password)) {
      if (this.passwordRef.current) {
        this.passwordRef.current.handleFocus();
      }
      return;
    }

    // return loginWith(username, password); not sure i understand why this is a return TODO
    loginWith(username, password);
  };

  render() {
    const {
      errorMessage, location, isSubmitting, isAuthenticated,
    } = this.props;
    const { username, password } = this.state;

    if (isAuthenticated) {
      const nextPath = (location.state && location.state.nextPathname) || '/';
      return <Redirect to={nextPath} />;
    }
    const { BRANDED_LOGO_URL } = featureFlags;
    return (
      <Centered flex justifyContent="center" alignItems="center">
        <Panel>
          <Head title="Log In" />
          {BRANDED_LOGO_URL && <BrandedLogo url={BRANDED_LOGO_URL} height={150} />}
          <form onSubmit={this.handleSubmit}>
            {errorMessage.length > 0 && (
              <Box marginBottom={4}>
                <Alert>{errorMessage}</Alert>
              </Box>
            )}
            <Box marginTop={4} marginBottom={4}>
              <TextField
                ref={this.usernameRef}
                onChange={this.handleUsernameChange}
                name="username"
                type="text"
                value={username}
                placeholder="Username"
              />
            </Box>
            <Box marginBottom={4}>
              <TextField
                ref={this.passwordRef}
                onChange={this.handlePasswordChange}
                name="password"
                type="password"
                value={password}
                placeholder="Password"
              />
            </Box>
            <Button primary type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </Panel>
      </Centered>
    );
  }
}

export default connect(
  LogInView.mapStateToProps,
  LogInView.mapDispatchToProps,
)(LogInView);

LogInView.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  loginWith: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      nextPathname: PropTypes.string,
    }),
  }).isRequired,
};
