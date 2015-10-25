import config from 'signal/config';
import log from 'signal/utils/log';
import updateSignedInAt from 'signal/utils/update-signed-in-at';
import verify from 'shared/utils/verify';

const {
  key,
  errors: {invalidKey, unknown},
  authKeyTtl
} = config;

export default (socket, signed, cb) => {
  const data = verify(key, 'auth', signed, authKeyTtl);
  if (!data) return cb(invalidKey);
  updateSignedInAt(data.userId, er => {
    if (er) {
      log.error(er);
      return cb(unknown);
    }
    socket.userId = data.userId;
    cb();
  });
};
