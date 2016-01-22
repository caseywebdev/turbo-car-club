import app from '..';
import log from '../utils/log';

export default ({socket}) => {
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
};
