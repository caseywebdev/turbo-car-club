import * as app from 'signal';
import log from 'signal/utils/log';

export default socket => {
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
};
