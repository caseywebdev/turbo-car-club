import app from '..';
import log from '../utils/log';
import uuid from 'node-uuid';

export default socket => {
  app.live.sockets[socket.id = uuid.v4()] = socket;
  log.info(`${socket.id} connected`);
};
