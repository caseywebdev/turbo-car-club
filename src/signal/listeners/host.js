import config from 'signal/config';
import log from 'signal/utils/log';
import verify from 'shared/utils/verify';

const {key, errors: {invalidKey}} = config;

export default (socket, signed, cb) => {
  const data = verify(key, 'host', signed);
  if (!data) return cb(invalidKey);
  socket.host = {key: signed, ...data};
  log.info([
    `${socket.id} is now a host`,
    `USER ID ${data.userId}`,
    `REGION ${data.region}`,
    `NAME ${data.name}`,
    `URL ${data.url}`
  ].join('\n'));
  cb();
};
