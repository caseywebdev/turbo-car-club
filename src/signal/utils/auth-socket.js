import config from '../config';
import log from '../utils/log';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}, authKeyMaxAge} = config;

export default ({socket, auth}) => {
  if (socket.userId) return;
  const data = verify(key, 'auth', auth, authKeyMaxAge);
  if (!data) throw invalidKey;
  log.info(`${socket.id} authorized as User ${data.userId}`);
  socket.userId = data.userId;
};