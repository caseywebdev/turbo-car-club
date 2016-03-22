import signOut from '../utils/sign-out';

export default {
  'signOut!':
  ({context: {socket}}) => {
    signOut(socket);
    return [
      {path: ['authToken'], value: null},
      {path: ['user'], value: null}
    ];
  }
};
