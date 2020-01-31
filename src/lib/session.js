import storage from 'lib/storage';

/**
 * Constants
 */

export const AUTH_TOKEN_STORAGE_KEY = 'authToken';
export const AUTH_USER_STORAGE_KEY = 'authUser';
export const PREV_USER_STORAGE_KEY = 'prevUser';
export const LAST_UPLOAD_TIMESTAMP = 'LAST_UPLOAD_TIMESTAMP';

/**
 * Session Storage
 */

const session = {
  set(tokenWithExpiry, user) {
    storage.set(AUTH_TOKEN_STORAGE_KEY, tokenWithExpiry);
    storage.set(AUTH_USER_STORAGE_KEY, user);
  },

  getTokenWithExpiry() {
    return storage.get(AUTH_TOKEN_STORAGE_KEY);
  },

  getUser() {
    return storage.get(AUTH_USER_STORAGE_KEY);
  },

  clear() {
    storage.remove(AUTH_TOKEN_STORAGE_KEY);
    storage.remove(AUTH_USER_STORAGE_KEY);
    storage.remove(LAST_UPLOAD_TIMESTAMP);
  },

  setPreviousUser() {
    // for security maybe only save role and admin_division
    const prevUser = storage.get(AUTH_USER_STORAGE_KEY);
    storage.set(PREV_USER_STORAGE_KEY, prevUser);
  },

  getPreviousUser() {
    return storage.get(PREV_USER_STORAGE_KEY);
  },


  setLastUploadTimestamp(formattedTimestamp) {
    storage.set(LAST_UPLOAD_TIMESTAMP, formattedTimestamp);
  },

  getLastUploadTimestamp() {
    return storage.get(LAST_UPLOAD_TIMESTAMP);
  },
};

export default session;
