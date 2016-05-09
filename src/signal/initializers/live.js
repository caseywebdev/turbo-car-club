import _ from 'underscore';
import Live from 'live-socket';
import log from '../utils/log';
import ws from 'ws';

import close from '../listeners/close';
import open from '../listeners/open';
import pave from '../listeners/pave';
import signal from '../listeners/signal';
import sub from '../listeners/sub';
import unsub from '../listeners/unsub';

const LISTENERS = {
  close,
  open,
  pave,
  signal,
  sub,
  unsub
};

log.info('Starting WebSocket server on port 80');
const server = new ws.Server({port: 80});

server.on('connection', socket => {
  socket = new Live({socket});
  _.each(LISTENERS, (cb, name) =>
    socket.on(name, (params, done) =>
      Promise
        .resolve({socket, params})
        .then(cb)
        .then(res => res === undefined || done(null, res), done)
    )
  );
  socket.trigger('open');
});

export default {sockets: {}, users: {}, hosts: {}};
