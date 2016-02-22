import _ from 'underscore';
import app from '..';
import log from '../utils/log';
import {remove, trigger} from '../utils/subs';

export default ({socket}) => {
  remove(socket);
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
  if (socket.host) {
    delete app.live.hosts[socket.host.id];
    trigger('host-removed');
  } else if (socket.userId) {
    const {userId} = socket;
    const {users} = app.live;
    users[userId] = _.without(users[userId], socket);
    if (!users[userId].length) delete users[userId];
  }
};
