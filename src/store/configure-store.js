import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { get } from 'lodash';
import withApi from 'store/api-middleware/api';
import api from 'lib/api';
import rootReducer from 'store/reducers';
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persist-config';

const devTools = get(window, '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__');
const composeEnhancers = devTools || compose;

export default function configureStore() {
  const middleware = [thunkMiddleware, withApi(api)];

  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer,
    {},
    composeEnhancers(applyMiddleware(...middleware)),
  );
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return { store, persistor };
}
