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

const LISTENERS = _.map({
  close,
  open,
  pave,
  signal,
  sub,
  unsub
}, (cb, name) =>
  socket =>
    socket.on(name, (params, done) =>
      Promise
        .resolve({socket, params})
        .then(cb)
        .then(_.partial(done, null), done)
    )
);

log.info('Starting WebSocket server...');
const wss = new ws.Server({port: 80});

wss.on('connection', socket => {
  _.invoke(LISTENERS, 'call', null, socket = new Live({socket}));
  socket.trigger('open');
});

export default {sockets: {}, users: {}, hosts: {}};
