import * as app from 'server';
import broadcastPeers from 'server/utils/broadcast-peers';
import log from 'server/utils/log';

export default socket => {
  delete app.live.sockets[socket.id];
  log.info(`Socket closed ${socket.id}`);
  broadcastPeers();
};
