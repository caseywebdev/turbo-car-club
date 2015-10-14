import * as app from 'server';
import log from 'server/utils/log';

export default socket => {
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
};
