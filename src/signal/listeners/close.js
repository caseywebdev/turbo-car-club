import app from '..';
import log from '../utils/log';
import {remove, trigger} from '../utils/subs';

export default ({socket}) => {
  remove(socket);
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
  if (!socket.host) return;
  trigger('host-removed');
};
