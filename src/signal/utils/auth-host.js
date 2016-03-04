import {trigger} from '../utils/subs';
import app from '..';
import log from '../utils/log';

export default (socket, ownerId, name, key) => {
  const id = `${ownerId}-${name}`;
  if (socket.host && socket.host.name === id) return;
  if (app.live.hosts[id]) throw new Error(`Host ${id} is already online`);

  socket.host = {id, key, ownerId, name};
  log.info(`${socket.id} signed in as host ${id}`);
  app.live.hosts[id] = socket;
  trigger('host-added');
};
