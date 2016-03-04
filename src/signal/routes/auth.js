import auth from '../utils/auth';

export default {
  'auth!.$obj':
  ({context: {socket}, 1: options}) => auth(socket, options.token, options)
};
