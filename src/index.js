import { PersistGate } from 'redux-persist/es/integration/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Router from './router';
import configureStore from './store/configure-store';
import { register } from './serviceWorker';

const { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
register();
