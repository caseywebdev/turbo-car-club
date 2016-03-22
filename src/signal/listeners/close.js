import app from '..';
import log from '../utils/log';
import signOut from '../utils/sign-out';

export default ({socket}) => {
  signOut(socket);
  delete app.live.sockets[socket.id];
  log.info(`${socket.id} disconnected`);
};
