import * as TYPES from './actions';

const defaultState = {
  __buffer__: []
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case TYPES.EXECUTE_QUERY:
      return { ...state, ...action.payload };

    case TYPES.PICK_BUFFER:
      return { ...state, __buffer__: action.payload };

    default:
      return state;
  }
}
