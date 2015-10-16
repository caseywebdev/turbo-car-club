import * as app from 'host';
import log from 'host/utils/log';

export default socket => {
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
};
