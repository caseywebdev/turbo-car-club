import app from '..';
import Router from '../data/router';

export default ({socket, params: {method, args}}) =>
  new Promise(resolve =>
    (new Router({
      socket,
      sockets: app.live.sockets
    }))[method](...args).subscribe(resolve)
  );
