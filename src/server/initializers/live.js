import _ from 'underscore';
import {server} from 'server/initializers/express';
import Live from 'live-socket';
import ws from 'ws';

import fs from 'fs';
import path from 'path';

const dir = path.resolve(__dirname, path.join('..', 'listeners', 'live'));
const LISTENERS = _.reduce(fs.readdirSync(dir), (listeners, file) => {
  if (file[0] !== '.') {
    const basename = path.basename(file, path.extname(file));
    listeners[basename] = require(path.join(dir, file));
  }
  return listeners;
}, {});

const wss = new ws.Server({server});

const sockets = {};

wss.on('connection', ws => {
  const socket = new Live(ws);
  _.each(LISTENERS, (cb, name) => socket.on(name, cb));
  socket.emit('open', socket);
});

export default {sockets, wss};
