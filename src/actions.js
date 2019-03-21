export const EXECUTE_QUERY = 'EXECUTE_QUERY';
export const PICK_BUFFER = 'PICK_BUFFER';

export const executeQuery = result => {
  return {
    type: EXECUTE_QUERY,
    payload: result
  };
};
