import sockets from '../utils/sockets';
import log from '../utils/log';
import uuid from 'node-uuid';

export default ({socket}) => {
  sockets.all[socket.id = uuid.v4()] = socket;
  log.info(`${socket.id} connected`);
};
