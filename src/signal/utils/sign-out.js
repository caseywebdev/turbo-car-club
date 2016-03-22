import _ from 'underscore';
import {remove} from '../utils/subs';
import {trigger} from './subs';
import app from '..';

export default socket => {
  remove(socket);
  if (socket.host) {
    delete app.live.hosts[socket.host.id];
    trigger('host-removed');
    delete socket.host;
  } else if (socket.userId) {
    const {userId} = socket;
    const {users} = app.live;
    users[userId] = _.without(users[userId], socket);
    if (!users[userId].length) delete users[userId];
    delete socket.userId;
  }
};
