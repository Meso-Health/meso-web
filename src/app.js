import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Head from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import { Global } from '@emotion/core';

import { title, titleTemplate } from 'lib/config';
import theme from 'styles/theme';
import GlobalStyles from 'styles/global';
import { ToastContainer } from 'components/alerts';

/**
 * Application Component
 */

class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Global styles={GlobalStyles} />
        <div id="app">
          <ToastContainer />
          <Head defaultTitle={title} titleTemplate={titleTemplate} />
          {children}
        </div>
      </ThemeProvider>
    );
  }
}

/**
 * Exports
 */

export default withRouter(App);
