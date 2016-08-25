import _ from 'underscore';
import {remove, trigger} from '../utils/subs';
import sockets from '../utils/sockets';
import log from '../utils/log';

export default ({socket}) => {
  remove(socket);
  if (socket.host) {
    delete sockets.hosts[socket.host.id];
    trigger('host-removed');
  } else if (socket.userId) {
    const {userId} = socket;
    const {users} = sockets;
    users[userId] = _.without(users[userId], socket);
    if (!users[userId].length) delete users[userId];
  }
  delete sockets.all[socket.id];
  log.info(`${socket.id} disconnected`);
};
