import app from '..';
import log from '../utils/log';
import {remove} from '../utils/subs';
import signOut from '../utils/sign-out';

export default ({socket}) => {
  remove(socket);
  delete app.live.sockets[socket.id];
  signOut(socket);
  log.info(`${socket.id} disconnected`);
};
