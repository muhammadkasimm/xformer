import * as TYPES from './actions';

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case TYPES.EXECUTE_QUERY:
      return { ...state, ...action.payload };

    case TYPES.PICK_BUFFER:
      return { ...state, buffer: action.payload };

    default:
      return state;
  }
}
