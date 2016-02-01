import authSocket from '../utils/auth-socket';
import Router from '../data/router';

export default ({socket, params: {auth, method, args}}) => {
  authSocket({socket, auth});
  return new Promise(resolve =>
    (new Router({
      userId: socket.userId
    }))[method](...args).subscribe(resolve)
  );
};
