/**
 * A thin wrapper around `localStorage` to serialize entries to JSON.
 */

const storage = {
  set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },

  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      return null;
    }
  },

  remove(key) {
    return localStorage.removeItem(key);
  },

  clear() {
    return localStorage.clear();
  },
};

export default storage;
