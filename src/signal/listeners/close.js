import _ from 'underscore';
import app from '..';
import log from '../utils/log';

export default ({socket}) => {
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
  if (!socket.host) return;
  _.each(app.live.sockets, socket =>
    socket.send('falcomlay', {path: ['hosts'], value: undefined})
  );
};
