import _ from 'underscore';
import fs from 'fs';
import Live from 'live-socket';
import log from '../utils/log';
import path from 'path';
import ws from 'ws';

const dir = path.resolve(__dirname, path.join('..', 'listeners'));
const LISTENERS = _.reduce(fs.readdirSync(dir), (listeners, file) => {
  if (file[0] !== '.') {
    const basename = path.basename(file, path.extname(file));
    listeners[basename] = require(path.join(dir, file)).default;
  }
  return listeners;
}, {});

log.info(`Starting WebSocket server on port 80`);
const server = new ws.Server({port: 80});

const sockets = {};

server.on('connection', ws => {
  const socket = new Live({socket: ws});
  _.each(LISTENERS, (cb, name) => socket.on(name, _.partial(cb, socket)));
  socket.trigger('open');
});

export default {sockets};
