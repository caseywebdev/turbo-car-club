import _ from 'underscore';
import Live from 'live-socket';
import log from '../utils/log';
import ws from 'ws';

import open from '../listeners/open';
import close from '../listeners/close';
import falcomlay from '../listeners/falcomlay';
const LISTENERS = {
  open,
  close,
  falcomlay
};

log.info(`Starting WebSocket server on port 80`);
const server = new ws.Server({port: 80});

const sockets = {};

server.on('connection', ws => {
  const socket = new Live({socket: ws});
  _.each(LISTENERS, (cb, name) =>
    socket.on(name, (params, done) =>
      Promise
        .resolve({socket, params})
        .then(cb)
        .then(res => res === undefined || done(null, res))
        .catch(done)
    )
  );
  socket.trigger('open');
});

export default {sockets};
