import _ from 'underscore';
import config from 'host/config';
import fs from 'fs';
import Live from 'live-socket';
import path from 'path';
import ws from 'ws';

const dir = path.resolve(__dirname, path.join('..', 'listeners'));
const LISTENERS = _.reduce(fs.readdirSync(dir), (listeners, file) => {
  if (file[0] !== '.') {
    const basename = path.basename(file, path.extname(file));
    listeners[basename] = require(path.join(dir, file));
  }
  return listeners;
}, {});

const server = new ws.Server(_.pick(config, 'port'));

const sockets = {};

server.on('connection', ws => {
  const socket = new Live({socket: ws});
  _.each(LISTENERS, (cb, name) => socket.on(name, _.partial(cb, socket)));
  socket.trigger('open');
});

export default {sockets, server};
