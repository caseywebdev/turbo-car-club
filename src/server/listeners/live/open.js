import * as app from 'server';
import broadcastPeers from 'server/utils/broadcast-peers';
import uuid from 'node-uuid';

export default socket => {
  app.live.sockets[socket.id = uuid.v4()] = socket;
  broadcastPeers();
};
