import * as app from 'server';
import broadcastPeers from 'server/utils/broadcast-peers';

export default socket => {
  delete app.live.sockets[socket.id];
  broadcastPeers();
};
