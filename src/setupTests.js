/* eslint-disable import/no-extraneous-dependencies */
import { axiosInstance } from 'lib/api';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import withApi from 'store/api-middleware/api';

/**
 * Mock `axios`
 */

const mockAdapter = new MockAdapter(axiosInstance);
global.mockAdapter = mockAdapter;

/**
 * Mock `store`
 */

const mockStore = api => configureMockStore([thunk, withApi(api)]);
global.mockStore = mockStore;

/**
 * Mock `localStorage`
 */

let store = {};
const localStorageMock = {
  setItem(key, value) {
    store[key] = value;
  },
  getItem(key) {
    return store[key] || null;
  },
  removeItem(key) {
    store[key] = undefined;
  },
  clear() {
    store = {};
  },
};

global.localStorage = localStorageMock;
