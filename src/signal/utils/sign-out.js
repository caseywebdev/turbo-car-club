import _ from 'underscore';
import app from '..';
import {trigger} from './subs';

export default socket => {
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
