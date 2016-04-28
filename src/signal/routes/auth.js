import auth from '../utils/auth';

export default {
  'auth!.$obj':
  ({store: {cache: {socket}}, 1: options}) =>
    auth(socket, options.token, options)
};
