import merge from 'ramda/src/merge';
import { execute, executePipe } from './executor';

let context = {};
export const getContext = () => context;
export const setContext = (ctx = {}) => {
  context = merge(getContext(), ctx);
};

function Xform() {
  setContext({});

  return {
    execute: (query, data, ctx = {}, dispatch = undefined) => {
      setContext(ctx);
      return execute(query, data, dispatch);
    },
    executePipe: (pipe, data, ctx = {}) => {
      setContext(ctx);
      return executePipe(pipe, data);
    }
  };
}

export default Xform();
