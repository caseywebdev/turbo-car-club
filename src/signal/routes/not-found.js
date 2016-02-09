const ROUTE_NOT_FOUND_ERROR = new Error('No matching route found');

export default {
  '*': () => { throw ROUTE_NOT_FOUND_ERROR; }
};
