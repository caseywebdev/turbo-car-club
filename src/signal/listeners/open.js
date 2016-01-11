import app from 'signal';
import log from 'signal/utils/log';
import uuid from 'node-uuid';

export default socket => {
  app.live.sockets[socket.id = uuid.v4()] = socket;
  log.info(`${socket.id} connected`);
};
