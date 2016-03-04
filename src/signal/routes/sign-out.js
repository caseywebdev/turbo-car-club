import signOut from '../utils/sign-out';

export default {'sign-out!': ({context: {socket}}) => signOut(socket)};
