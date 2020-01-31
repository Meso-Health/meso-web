import uuid from 'uuid/v4';

export const ADD_TOAST = 'ADD_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';

export function addToast(options) {
  return {
    payload: {
      ...options,
      id: uuid(),
    },
    type: ADD_TOAST,
  };
}

export function removeToast(id) {
  return {
    payload: id,
    type: REMOVE_TOAST,
  };
}
