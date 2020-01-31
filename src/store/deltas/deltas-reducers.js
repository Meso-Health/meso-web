import { keyBy } from 'lodash/fp';
import {
  CREATE_DELTA,
  DELETE_DELTA,
} from 'store/deltas/deltas-actions';

export function initialState() {
  return {
    deltas: {},
  };
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case CREATE_DELTA: {
      const { delta } = action;
      return {
        ...state,
        deltas: {
          ...state.deltas,
          [delta.id]: delta,
        },
      };
    }
    case DELETE_DELTA: {
      const { deltaId } = action;
      const updatedDeltas = keyBy('id', Object.values(state.deltas).filter(delta => delta.id !== deltaId));
      return {
        ...state,
        deltas: updatedDeltas,
      };
    }
    default:
      return state;
  }
}
