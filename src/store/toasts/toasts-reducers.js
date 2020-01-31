import { remove } from 'lodash/fp';
import { ADD_TOAST, REMOVE_TOAST } from 'store/toasts/toasts-actions';

const initialState = {
  toasts: [],
};

export default function toasts(state = initialState, action) {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        toasts: [action.payload, ...state.toasts],
      };
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: remove(toast => toast.id === action.payload)(state.toasts),
      };
    default:
      return state;
  }
}
