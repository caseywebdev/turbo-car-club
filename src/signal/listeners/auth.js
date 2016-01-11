import config from '../config';
import log from '../utils/log';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}, authKeyTtl} = config;

export default (socket, signed, cb) => {
  const data = verify(key, 'auth', signed, authKeyTtl);
  if (!data) return cb(invalidKey);
  log.info(`${socket.id} authorized as User ${data.userId}`);
  socket.userId = data.userId;
  cb();
};
