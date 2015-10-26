import config from 'signal/config';
import verify from 'shared/utils/verify';

const {key, errors: {invalidKey}, authKeyTtl} = config;

export default (socket, signed, cb) => {
  const data = verify(key, 'auth', signed, authKeyTtl);
  if (!data) return cb(invalidKey);
  socket.userId = data.userId;
  cb();
};
